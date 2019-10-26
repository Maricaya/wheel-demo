function max(array) {
    let temp = array[0]
    for (let i = 0; i < array.length; i++) {
       temp = array[i+1] > temp ? array[i+1] : temp
    }
    return temp
}
function max(array) {
    if(array.length === 1) return array[0]
    otherMax = max(array.slice(1))
    return array[0] > otherMax ? array[0] : otherMax
}

const maxOfTwo = (a,b) => a>b?a:b
function max([first, ...others]) {
    return others.length === 0 ? first
                               : maxOfTwo(first, max(others))
}

max([23, 99, 17, 28, 84]) // 99
max([1]) // 1
max([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) // 1

// 汉诺塔问题
/**
 * h(1) AC
 * h(2) AB AC BC
 * h(3) h(2, A,c,b) + h(1,abc)+h2(bac)
 * h(n) h(n-1,A,C,B) + AC + h(n-1,B,A,C)
 */
function h(n, from, cache, to){
    return n === 1 ? `${from}${to}`
           : h(n-1, `${from}`,`${to}`,`${cache}`) 
           + `  ${from}${to}` +
            h(n-1, `${cache}`, `${from}`, `${to}`)
}

h(4, 'A', 'B', 'C')
//AB,AC,BC,AB,CA,CB,AB,AC,BC,BA,CA,BC,AB,AC,BC

// 斐波那契数列
memorize = fn => {
    let cache = {}
    return (first, ...args) => {
        if(!(first in cache)) cache[first] = fn(first, ...args)
        return cache[first]
    }
    
}
/**
 * n = 0 0
 *     1 1
 *     2 0+1
 */
f = memorize( n =>
    n === 0 ? 0 :
    n === 1 ? 1 
            : f(n-1) + f(n-2)
)

f(48) //4807526976