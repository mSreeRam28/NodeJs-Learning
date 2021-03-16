const myname = 'Ram';
let age = 21;
const hasHobbies = true;

age = 22;

const summarizeUser = (userName, userAge, userHasHobbies) => {
    return ('Name is ' + userName + ', age is ' + userAge + ' and has hobbies: ' + userHasHobbies);
};

console.log(summarizeUser(myname, age, hasHobbies));

const add = (a, b) => a + b;

const addOne = a => a + 1;

const addRandom = () => 1 + 2;

console.log(add(1, 2), addOne(1), addRandom());