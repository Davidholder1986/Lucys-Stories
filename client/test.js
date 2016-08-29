function Person (firstname, lastname, age) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.age = age;
}

var david = new Person('david', 'holder', 29);

Person.prototype.hello = function () {
    return this.firstname + " " + this.lastname;
};

console.log(david.hello());