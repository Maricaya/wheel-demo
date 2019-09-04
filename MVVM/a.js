class Mvvm {
    constructor(options = {}) {
        this.$options = options
        let data = this._data = this.$options.data;
        /*
           1.数据劫持
           种下监听器 set get
        */
        observe(data);
        /*
                2.数据代理
                让我们每次拿data里的数据时不用每次都写一长串，
                eg. mvvm._data.a.b，可以直接写成mvvm.a.b
            */
        for (let key in data) {
            Object.defineProperty(this, key, {
                configurable: true, //  可以配置对象，删除属性
                enumerable: true, //  可以枚举
                get() {
                    return this._data[key]; // 如this.a = {b: 1}
                },
                set(newVal) {
                    this._data[key] = newVal;
                }
            });
        }
        /*
              3.数据编译
              将 {{ }} 替换为数据
           */
        new Compile(options.el, this)

        /*
         数据编译后，并没有在页面上展示
         -> 4.通过 发布-订阅模式实现
        */
    }
}

// 1. 数据劫持
function Observe(data) {
    // 所谓数据劫持就是给对象增加get,set
    // 先遍历一遍对象再说

    // 5.数据更新视图***************
    let dep = new Dep();
    for (let key in data) { // 把data属性通过defineProperty的方式定义属性
        let val = data[key];
        observe(val); // 递归继续向下找，实现深度的数据劫持
        Object.defineProperty(data, key, {
            configurable: true,
            get() {
                // 5.数据更新视图*************** 当获取值的时候就会自动调用get方法，于是找一下数据劫持那里的get方法
                Dep.target && dep.addSub(Dep.target); //5. 将watcher添加到订阅事件中 [watcher]
                return val;
            },
            set(newVal) { // 更改值的时候
                if (val === newVal) { // 设置的值和以前值一样就不理它
                    return;
                }
                val = newVal; // 如果以后再获取值(get)的时候，将刚才设置的值再返回去
                observe(newVal); // 当设置为新值后，也需要把新值再去定义成属性
                // 5.数据更新视图***************     
                dep.notify(); // 5. 让所有watcher的update方法执行即可 --> 去修改update
            }
        });
    }
}

// 外面再写一个函数
// 不用每次调用都写个new
// 也方便递归调用
function observe(data) {
    // 如果不是对象的话就直接return掉
    // 防止递归溢出
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}

// 4. 发布订阅模式
// 发布订阅模式  订阅和发布 如[fn1, fn2, fn3]
class Dep {
    constructor() {
        this.subs = [] // 一个数组(存放函数的事件池)
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        // 绑定的方法，都有一个update方法
        this.subs.forEach(sub => sub.update());
    }
}

// 监听函数
// 通过Watcher这个类创建的实例，都拥有update方法

class Watcher {
    constructor(vm, exp, fn) {
        this.fn = fn // 将fn放到实例上
        // 5.数据更新视图*************** 重写watcher
        this.vm = vm;
        this.exp = exp;
        // 添加一个事件
        // 这里我们先定义一个属性
        Dep.target = this;
        let arr = exp.split('.');
        let val = vm;
        arr.forEach(key => { // 取值
            val = val[key]; // 获取到this.a.b，默认就会调用get方法
        });
        Dep.target = null;
    }
    update() {
        // 5.数据更新视图*************** 
        // notify的时候值已经更改了
        // 再通过vm, exp来获取新的值
        let arr = this.exp.split('.');
        let val = this.vm;
        arr.forEach(key => {
            val = val[key]; // 通过get获取到新的值
        });
        this.fn(val); // 将每次拿到的新值去替换{{}}的内容即可
    }
}

// 3.数据编译 创建Compile构造函数
function Compile(el, vm) {
    // 将el挂载到实例上方便调用
    vm.$el = document.querySelector(el);
    /*   
      在el范围里将内容都拿到，当然不能一个一个的拿
      可以选择移到内存中去然后放入文档碎片中，节省开销 
      创建一个新的空白的文档片段
      因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（使用文档片段通常会带来更好的性能
    */
    let fragment = document.createDocumentFragment();

    while (child = vm.$el.firstChild) {
        fragment.appendChild(child); // 此时将el中的内容放入内存中
    }
    // 对el里面的内容进行替换
    function replace(frag) {
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            let reg = /\{\{(.*?)\}\}/g; // 正则匹配{{}}

            if (node.nodeType === 3 && reg.test(txt)) { // 即是文本节点又有大括号的情况{{}}
                console.log(RegExp.$1); // 匹配到的第一个分组 如： a.b, c
                let arr = RegExp.$1.split('.');
                let val = vm;
                arr.forEach(key => {
                    val = val[key]; // 如this.a.b
                });
                // 用trim方法去除一下首尾空格
                node.textContent = txt.replace(reg, val).trim();

                // 5.数据更新视图***************
                // 监听变化  给Watcher再添加两个参数，用来取新的值(newVal)给回调函数传参
                new Watcher(vm, RegExp.$1, newVal => {
                    node.textContent = txt.replace(reg, newVal).trim();
                });
            }
            // 6. 双向数据绑定
            if (node.nodeType === 1) { // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name; // v-model  type
                    let exp = attr.value; // c        text
                    if (name.includes('v-')) {
                        node.value = vm[exp]; // this.c 为 2
                    }
                    // 监听变化
                    new Watcher(vm, exp, function (newVal) {
                        node.value = newVal; // 当watcher触发时会自动将内容放进输入框中
                    });

                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给this.c赋了一个新值
                        // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
                        vm[exp] = newVal;
                    });
                });
            }
            //   双向数据绑定结束

            // 如果还有子节点，继续递归replace
            if (node.childNodes && node.childNodes.length) {
                replace(node);
            }
        });
    }

    replace(fragment); // 替换内容

    vm.$el.appendChild(fragment); // 再将文档碎片放入el中
}

let mvvm = new Mvvm({
    el: '#app',
    data: {
        a: {
            b: 1
        },
        c: 2
    }
})