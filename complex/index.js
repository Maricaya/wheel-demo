// Array.form
const someNumbers = {
    '0': 10,
    '1': 15,
    length: 2
};
// 类数组对象  
Array.from(someNumbers, value => value * 2); // => [20, 30]
// 2.将类数组转换成数组
/**
 * 函数中的 arguments 关键字，或者是一个 DOM 集合。
 * 
 */
function sumArguments() {
    return Array.from(arguments).reduce((sum, num) => sum + num);
}

sumArguments(1, 2, 3); // => 6

// Array.from() 的第一个参数可以是任意一个可迭代对象，我们继续看一些例子:
Array.from('Hey'); // => ['H', 'e', 'y']
Array.from(new Set(['one', 'two'])); // => ['one', 'two']

const map = new Map();
map.set('one', 1)
map.set('two', 2);
Array.from(map); // => [['one', 1], ['two', 2]]

// String.prototype.replace()
let txt = '{{a}}这是数据{{b}} {{a}}'
let reg = /\{\{(.*?)\}\}/g
txt.replace(reg, (matched, placeholder) => {
    // placeholder () 内的内容
    // console.log(matched, placeholder)  // 匹配到的分组 a, b...
})

// Array.prototype.reduce()
/*

arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
Accumulator (acc) (累计器)
Current Value (cur) (当前值)
Current Index (idx) (当前索引)
Source Array (src) (源数组)

*/
var total = [0, 1, 2, 3].reduce(
    (acc, cur) => acc + cur,
    4
)

let mvvm = {
    a: '1',
    b: {
        c: '2'
    }
}
let arr = 'b.c'.split('.')
'b.c'.split('.').reduce((val, key) => {
    if (val && val[key]) console.log(val[key])
}, mvvm)
// for (let i = 0; i < arr.length; i++) {
// mvvm[arr]
// }
console.log(arr, mvvm.b.c)