var myname = 'Ram';
var age = 21;
var hasHobbies = true;

function summarizeUser(userName, userAge, userHasHobbies){
    return ('Name is ' + userName + ', age is ' + userAge + ' and has hobbies: ' + userHasHobbies);
}

console.log(summarizeUser(myname, age, hasHobbies));