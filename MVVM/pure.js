// 无注释版
class Mvvm {
    constructor(options = {}) {
        this.$options = options
        let data = this._data = this.$options.data
        this.observe(data)
        for (let key in data) {
            Object.defineProperty(this, key, {
                configurable: true, //  可以配置对象，删除属性
                enumerable: true, //  可以枚举
                get() {
                    return this._data[key] // 如this.a = {b: 1}
                },
                set(newVal) {
                    this._data[key] = newVal
                }
            });
        }
        compile(options.el, this)
    }
    observe(data) {
        const vm = this
        Object.keys(data).forEach(key => {
            let dep = new Dep()
            let val = data[key]
            vm.newObserve(val) // 递归继续向下找，实现深度的数据劫持
            Object.defineProperty(data, key, {
                get() {
                    Dep.target && dep.addSub(Dep.target)
                    return val
                },
                set(newVal) {
                    if (val === newVal) return // 设置的值和以前值一样就不理它
                    val = newVal
                    vm.newObserve(newVal)
                    dep.notify() 
                }
            })
        })
    }
    newObserve(data) {
        if (!data || typeof data !== 'object') return
        return this.observe(data)
    }
}
class Dep {
    constructor() {
        this.subs = [] // 一个数组(存放函数的事件池)
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}
class Watcher {
    constructor(vm, exp, fn) {
        this.fn = fn // 将fn放到实例上
        this.vm = vm
        this.exp = exp
        Dep.target = this
        let arr = exp.split('.') // ['c'] ['a', 'b']
        let val = vm
        arr.forEach(key => {
            val = val[key]  // 如this.a.b
        })
        Dep.target = null
    }
    update() {
        let arr = this.exp.split('.')
        let val = this.vm
        arr.forEach(key => {
            val = val[key] // 通过get获取到新的值
        })
        this.fn(val) // 将每次拿到的新值去替换{{}}的内容即可
    }
}
function compile(el, vm) {
    // 将el挂载到实例上方便调用
    vm.$el = document.querySelector(el)
    let fragment = document.createDocumentFragment()
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child) // 此时将el中的内容放入内存中
    }

    replace(fragment)
    function replace(frag) {
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            let reg = /\{\{(.*?)\}\}/g; // 正则匹配{{}}
            if (node.nodeType === 3 && reg.test(txt)) {
                new Watcher(vm, RegExp.$1, newVal => {
                    node.textContent = txt.replace(reg, newVal).trim()
                })
            }
            if (node.nodeType === 1) {
                Array.from(node.attributes).forEach(attr => {
                    let name = attr.name
                    let exp = attr.value
                    if (name.includes('v-model')) {
                        node.value = vm[exp]
                    }
                    node.addEventListener('input', e => vm[exp] = e.target.value)
                    new Watcher(vm, exp, (newVal) => node.value = newVal)
                })
            }
            if (node.childNodes && node.childNodes.length) {
                replace(node)
            }
        })
    }
    vm.$el.appendChild(fragment) // 再将文档碎片放入el中
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
mvvm.c = 3
mvvm.a.b = 2
console.log(mvvm)