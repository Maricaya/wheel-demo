// class EventEmitter {
//     cache = []
//     on () {} // class 中函数是不可读的,for in遍历不到
//     off () {}
//     emit () {}
// }

function createEventEmitter() {
    const cache = []
    return {
        on() {},
        off() {},
        emit() {}
    }
}

class Person {
    name
    sayHi() {}
}

p1 = new Person()

function mixin(to, from) {
    for (let key in from) {
        to[key] = from[key]
    }
}

mixin(p1, createEventEmitter())

// 组合，非常灵活
const createWang = (state) => ({
    wangwang: () => {
        console.log(`汪汪，我是${state.name}`)
    }
})
const createRun = (state) => ({
    run: () => state.position += 1
})
const createDog = (name) => {
    const state = {
        name,
        position: 0
    }
    return Object.assign({},
        createWang(state),
        createRun(state)
    )
}
const dog = createDog('小白')

// 内存问题

// 1，继承
class A {
    sayA() {}
}

class B extends A {
    constructor(name) {
        super()
        this.name = name // 自己的
    }
    sayB() {} // 公用的
}

// 2，组合
createF1 = (state) => ({
    f1() {
        console.log(state)
    }
})
createF2 = (state) => ({
    f1() {
        console.log(state)
    }
})

createDog = (name) => {
    const state = {name}
    return Object.assign({}, createF1(state), createF2(state))
}
dog = createDog()

dog2 = createDog()

dog.f1 !== dog2.f1

// 内存重复，但是很容易消除
const f1 = (d) => {console.log(d.name)}

// 这样，createF1无论调多少遍，都是同一个f1
createF1 = (state) => ({f1: () => f1(state)})

// 面向对象节约函数，但是创造新的对象。
// 组合创造新的一小部分函数 () => ，节约对象。
// 所以，是平均的

