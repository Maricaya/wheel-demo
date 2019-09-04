const char = require('chai')
const sinon = require('sinon') 
const sinonChai = require('sinon-chai')

const deepClone = require('../index')

describe('deepClone', () => {
    it('是一个函数', () => {})
    it('能够复制基本类型', () => {
        const n = 123
        // '123' true undefined null
        // Symbol() 一种不可变的引用类型 -- 知识盲区
        const n2 = deepClone(n)
        assert(n === n2) // 基本类型
    })
    describe('对象', () => {
        it('能够复制普通对象', () => {
            const a = {name: 'Tyler', fans: {name: 'aaa'}}
            const a2 = deepClone(a)
            assert(a !== a2)
            assert(a.name === a2.name)
            assert(a.fans !== a2.fans)
            assert(a.fans.name === a2.fans.name)
        })
    })
})