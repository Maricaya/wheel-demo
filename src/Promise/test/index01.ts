import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.use(sinonChai)

const assert = chai.assert
import Promise from '../src/promise'

describe("Promise", () => {
    it('是一个类', () => {
        assert.isFunction(Promise)
        assert.isObject(Promise.prototype)
    })
    it('new Promise() 如果接受不是函数，就报错', () => {
        // 预测会报错 assert.throw
        assert.throw(() => {
            // @ts-ignore
            new Promise()
        })
        assert.throw(() => {
            // @ts-ignore
            new Promise(1)
        })
    })
    it('new Promise(fn) 会生成一个对象，对象有then方法', () => {
        const promise = new Promise(() => {})
        assert.isFunction(promise.then)
    })
    it('new Promise(fn) 中的fn立即执行', () => {
        let fn = sinon.fake()
        new Promise(fn)
        assert(fn.called)
        // let called = false
        // const promise = new Promise(() => {
        //     called = true
        // })
        // // @ts-ignore
        // assert(called === true)
    })
    it('new Promise(fn) 中fn执行的时候接受resolve和reject两个函数', done => {
        new Promise((resolve, reject) => {
            assert.isFunction(resolve)
            assert.isFunction(reject)
            done()
            // 保证执行了
        })
    })
    it('promise.then(success) 中的success 会在resolve被调用的时候执行', done => {
        const success = sinon.fake()
        const promise = new Promise((resolve, reject) => {
            // 该函数没有执行
            assert.isFalse(success.called)
            resolve()
            // 该函数执行了
            setTimeout(() => {
                assert.isTrue(success.called)
                // 告诉mocha测试完成
                done()
            })
        })
        // @ts-ignore
        promise.then(success)
    })
    it('promise.then(null, fail) 中的 fail 会在reject被调用的时候执行', done => {
        const fail = sinon.fake()
        const promise = new Promise((resolve, reject) => {
            // 该函数没有执行
            assert.isFalse(fail.called)
            reject()
            // 该函数执行了
            setTimeout(() => {
                assert.isTrue(fail.called)
                // 告诉mocha测试完成
                done()
            })
        })
        // @ts-ignore
        promise.then(null, fail)
    })
})
