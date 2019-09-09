/**
 * new 的作用
var fn = function(a){this.a=a}
new fn()
fn {a: undefined}
new fn('x')
fn {a: "x"}

   new 关键字的作用
         var temp = {}
         temp.__proto__ = fn.prototype // 关键
         fn.call(temp) // temp{}作为this绑定给fn
         return this

         var fn('x')
         var fn2 = fn.bind(undefined, 'y')
         new fn2() // fn{a: 'y'}

 */


function bind(asThis) {
    // this 就是函数
    // slice 方法可以用来将一个类数组（Array-like）对象/集合转换成一个新数组。你只需将该方法绑定到这个对象上。 
    // 一个函数中的  arguments 就是一个类数组对象。
    var args = Array.prototype.slice.call(arguments, 1)
    // 要删除第0个
    var fn = this
    if (typeof fn !== 'function') {
        throw new Error('bind必须调用在函数身上')
    }
    return function () {
        var args2 = Array.prototype.slice.call(arguments, 0)
        // 返回函数，this改变为asThis
        return fn.apply(asThis, args.concat(args2))
    }
}

function _bind (asThis, ...args) {
    var fn = this
    function resultFn(...args2) {
        /**
         new 关键字的作用
         var temp = {}
         temp.__proto__ = fn.prototype // 关键
         fn.call(temp) // temp{}作为this绑定给fn
         return this

         new function(...args2) {
         this new 生成的 (方应行 new)
         return this
         但是我们此函数中有返回，fn.call(asThis ...) asThis 作为this
         结论 ： 不能使用asThis作为参数
         如果调用函数时，使用new 要传出this
                      没有使用new 传出asThis

        var fn = function(){console.log(this); console.log(this.__proto__ === fn.prototype)}
        fn() // Window false
        fn.call({name: 'frank'}) // {name: 'frank'} false
        new fn() // fn {}  true 
        */
        /**
         * __proto__ 不是标准属性，浏览器自己胡乱添加的
         * this.__proto__ === resultFn.prototype // 
         * this.constructor === resultFn // 可能继承更多 ？？
         * this instanceof resultFn // this 是 resultFn 构造出来的 （最好的代替方案）
         * resultFn.prototype.isPrototypeOf(this) // this 是 resultFn 构造出来的 （最好的代替方案）
        */
        return fn.call(
            this instanceof resultFn ? this : asThis,
            ...args, ...args2)
    }
    resultFn.prototype = fn.prototype
    return resultFn
}
// export default bind2;
module.exports = _bind

if (!Function.prototype.bind) {
    Function.prototype.bind = _bind
}