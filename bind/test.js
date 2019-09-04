const bind = require('./index')


test1('fn.bind 能使用')
test2('this绑定成功')
test3('this，p1,p2 绑定成功')
test4('this，p1绑定成功，后传p2调用成功')

function test1(message) {
    console.log(message)
    Function.prototype.bind2 = bind
    console.assert(Function.prototype.bind2 !== undefined)
}

function test2(message) {
    console.log(message)
    // 防止test1被删除，test2还能使用
    Function.prototype.bind2 = bind
    const fn1 = function () {
        return this
    }
    const newFn1 = fn1.bind2({
        name: 'Frank'
    })
    console.assert(newFn1().name === 'Frank')
}

function test3(message) {
    console.log(message)
    Function.prototype.bind2 = bind
    // fn.bind(asThis, param1, param2)
    const fn = function (p1, p2) {
        return [this, p1, p2]
    }
    const newFn = fn.bind2({ name: 'Frank' }, 123, 456)
    console.assert(newFn()[0].name === 'Frank')
    console.assert(newFn()[1] === 123)
    console.assert(newFn()[2] === 456)
}

function test4(message) {
    console.log(message)
    Function.prototype.bind2 = bind
    const fn = function (p1, p2) {
        return [this, p1, p2]
    }
    const newFn = fn.bind2({
        name: 'Frank'
    }, 123)
    console.assert(newFn(245)[0].name === 'Frank')
    console.assert(newFn(245)[1] === 123)
    console.assert(newFn(245)[2] === 245)
}

test5('new 的时候，绑定了x1，x2, 并且fn有prototype.sayHi')

function test5(message) {
    console.log(message)
    Function.prototype.bind2 = bind
    const fn = function (p1, p2) {
        this.p1 = p1
        this.p2 = p2
    }
    fn.prototype.sayHi = function() {}
    const fn2 = fn.bind2(undefined, 'x', 'y')
    const object = new fn2()
    console.assert(object.p1 === 'x', 'x')
    console.assert(object.p2 === 'y', 'y')
    console.assert(object.__proto__ === fn.prototype)
    console.assert(typeof object.sayHi === 'function')
}

test6('bind，不用new，但用new 过的对象')

function test6(message) {
    console.log(message)
    Function.prototype.bind2 = bind
    const fn = function (p1, p2) {
        this.p1 = p1
        this.p2 = p2
    }
    fn.prototype.sayHi = function() {}
    const object1 = new fn('a', 'b')
    const fn2 = fn.bind2(object1, 'x', 'y')
    const object = fn2() // 没有用new
    // 有一个错误判断，但是在我们的代码中没有问题
    console.assert(object === undefined, '没有返回值，object为空')
    console.assert(object1.p1 === 'x', 'x')
    console.assert(object1.p2 === 'y', 'y')
}