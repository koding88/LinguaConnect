const getBirthdayForAge = (age) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthday = new Date(birthYear, 0, 1);

    return birthday.toDateString();
};

const createUsername = (familyName) => {
    return familyName + "_" + Math.random().toString(36).slice(-3).toLowerCase();
};

const getFullName = (familyName, givenName) => {
    return familyName + ' ' + givenName;
}

module.exports = {getBirthdayForAge, createUsername, getFullName}