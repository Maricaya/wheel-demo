class Person {
    sayHi(): void{}
    constructor(public name: string, public age: number) {
    }
}
class Person1 {
    mySayHi = () => {} // 自用
    sayHi(): void{} // 共用
}
let person1 = new Person('frank', 18)
let person2 = new Person('jack', 23)