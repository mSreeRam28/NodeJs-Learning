const person = {
    name: 'Ram',
    age: 21,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
};

const hobbies = ['Sports', 'Cooking'];

const printName = ({ name }) => {
    console.log(name);
}

printName(person);

const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);