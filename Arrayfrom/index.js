const someNumbers = { '0': 10, '1': 15, length: 2 };
// 类数组对象  
Array.from(someNumbers, value => value * 2); // => [20, 30]
console.log(someNumbers)

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
Array.from('Hey');                   // => ['H', 'e', 'y']
Array.from(new Set(['one', 'two'])); // => ['one', 'two']

const map = new Map();
map.set('one', 1)
map.set('two', 2);
Array.from(map); // => [['one', 1], ['two', 2]]