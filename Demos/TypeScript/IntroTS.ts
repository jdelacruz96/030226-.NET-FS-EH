console.log("Hello world!")

function addNum(x: number, y: number): number {
    return  x + y
}

console.log(addNum(10, 11))

interface Animal {
    name: String;
    age: Number;
    pet?: boolean;
    bark(): string;
}

class Dog implements Animal {
    constructor(
        public name: string,
        public breed: string,
        public age: number
    ) {}

    bark(): string {
        return "woof woof"
    }
}

const pancake = new Dog("pancake", "maltese", 11)

console.log(pancake.bark)