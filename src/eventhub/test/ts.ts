import EventHub from '../src/index'

// 定义一种类型 TestCase 传递string参数，返回值为空
type TestCase = (message: string) => void

// 第一个测试用例，起名为test1 在最后调用
// 断言 eventHub是个对象
const test1: TestCase = message => {
    const eventHub = new EventHub()
    console.assert(eventHub instanceof Object === true, 'eventHub 是个对象')
    // 确定成功之后打出message
    console.log(message)
}

const test2: TestCase = message => {
    const eventHub = new EventHub()
    // on emit
    let called = false
    eventHub.on('xxx', y => {
        called = true
        console.assert(y === 'hello')
    })
    eventHub.emit('xxx', 'hello')
    console.assert(called)
    console.log(message)
}

const test3: TestCase = message => {
    const eventHub = new EventHub()
    let called = false
    const fn1 = () => {
        called = true
    }
    eventHub.on('yyy', fn1)
    eventHub.off('yyy', fn1)
    eventHub.emit('yyy')
    console.assert(called === false)
    console.log(message)
}