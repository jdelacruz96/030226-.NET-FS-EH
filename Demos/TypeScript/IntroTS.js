console.log("Hello world!");
function addNum(x, y) {
    return x + y;
}
console.log(addNum(10, 11));
var Dog = /** @class */ (function () {
    function Dog(name, breed, age) {
        this.name = name;
        this.breed = breed;
        this.age = age;
    }
    Dog.prototype.bark = function () {
        return "woof woof";
    };
    return Dog;
}());
var pancake = new Dog("pancake", "maltese", 11);
console.log(pancake.bark);
