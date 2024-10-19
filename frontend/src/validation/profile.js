export const validations = {
    full_name: (full_name) => (!full_name.trim() ? "Full name is required." : full_name.length < 5 || full_name.length > 50 ? "Full name must be between 5 and 50 characters." : ""),
    username: (username) => (!username.trim() ? "Username is required." : username.length < 3 || username.length > 50 ? "Username must be between 3 and 50 characters." : ""),
    birthday: (birthdayString) => {
        if (!birthdayString) return "Birthday is required.";
        const [day, month, year] = birthdayString.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        const age = new Date().getFullYear() - date.getFullYear();
        const monthDiff = new Date().getMonth() - date.getMonth();
        const dayDiff = new Date().getDate() - date.getDate();
        return age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))) ? "User must be at least 13 years old." : "";
    },
    location: (location) => (!location ? "Location is required." : ""),
};
