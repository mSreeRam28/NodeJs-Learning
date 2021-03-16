const myname = 'Ram';
let age = 21;
const hasHobbies = true;

age = 22;

function summarizeUser(userName, userAge, userHasHobbies){
    return ('Name is ' + userName + ', age is ' + userAge + ' and has hobbies: ' + userHasHobbies);
}

console.log(summarizeUser(myname, age, hasHobbies));