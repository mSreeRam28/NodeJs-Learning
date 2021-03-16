const person = {
    name: 'Ram',
    age: 21,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
};

const hobbies = ['Sports', 'Cooking'];

const copyPerson = {...person};
console.log(copyPerson);

const copyHobbies = [...hobbies];
console.log(copyHobbies);

const sum = (...args) => args.reduce((a,b) => a+b);
console.log(sum(1,2,3,4));
