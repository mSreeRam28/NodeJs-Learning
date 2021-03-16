const person = {
    name: 'Ram',
    age: 21,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
};

person.dob = '28/04/1999';

const hobbies = ['Sports', 'Cooking'];

hobbies.push('Programming');

console.log(person);
console.log(hobbies);
