class EventHub {
    // 声明为一个cache 对象
    // -    key: value
    // -    key是string : value 数组
    // -                        数组中是函数 参数（未知） 和 返回值（为空）
    private cache: { [key: string]: Array<(data: unknown) => void>} = {}
    // private safeCache(eventName) {
    //     return this.cache[eventName] || []
    // }
    // unknow 第一次传递的为什么类型，以后只能传递此种类型，不能修改
    // void 返回值为空
    on(eventName: string, fn: (data: unknown) => void) {
        // 如果没有，初始化
        // if (this.cache[eventName] === undefined) {
        // this.cache[eventName] = []
        // }
        this.cache[eventName] = this.cache[eventName] || []
        // let array = this.cache[eventName]
        // array.push(fn)
        this.cache[eventName].push(fn)
    }
    // data? 表示可以为空，不传递
    emit(eventName: string, data?: unknown) {
        // let array = this.cache[eventName]
        // if (array === undefined) {
        //     array = []
        // }
        // this.cache[eventName] = this.cache[eventName] || []
        // this.cache[eventName].forEach(fn => 
        //     fn()
        // )
        (this.cache[eventName] || []).forEach(fn => fn(data))
    }
    off(eventName: string, fn: (data: unknown) => void) {
        // 把fn从this.cache[eventName] 删掉
        // this.cache[eventName] = this.cache[eventName] || []
        let index = indexOf(this.cache[eventName], fn)
        // if(index === undefined) {
        //     return
        // } else {
        //     this.cache[eventName].splice(index, 1)
        // }
        if (index === undefined) return
        this.cache[eventName].splice(index, 1)
    }
}

export default EventHub

function indexOf(array: Array<unknown>, item: unknown) {
    if (array === undefined) return -1
    let index = -1
    for (let i = 0; i < array.length; i++) {
        if (array[i] === item) {
            index = i
            break
        }
    }
}