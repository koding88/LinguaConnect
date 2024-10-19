export const validations = {
    full_name: (full_name) => (!full_name.trim() ? "Full name is required." : full_name.length < 5 || full_name.length > 50 ? "Full name must be between 5 and 50 characters." : ""),
    username: (username) => (!username.trim() ? "Username is required." : username.length < 3 || username.length > 50 ? "Username must be between 3 and 50 characters." : ""),
    email: (email) => (!email.trim() ? "Email is required." : !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email) ? "Enter a valid email address." : ""),
    password: (password) => (!password.trim() ? "Password is required." : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password) ? "Password must be at least 8 characters and include a mix of letters and numbers." : ""),
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
