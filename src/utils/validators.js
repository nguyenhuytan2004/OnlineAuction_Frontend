// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Phone validation
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{9,}$/;
    return phoneRegex.test(phone);
};

// Required field validation
export const isRequired = (value) => {
    return value && value.trim().length > 0;
};

// Validate form
export const validateForm = (formData, rules) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const value = formData[field];
        const fieldRules = rules[field];

        if (fieldRules.required && !isRequired(value)) {
            errors[field] = `${field} is required`;
        }

        if (fieldRules.type === "email" && value && !isValidEmail(value)) {
            errors[field] = "Invalid email";
        }

        if (
            fieldRules.type === "password" &&
            value &&
            !isValidPassword(value)
        ) {
            errors[field] = "Password must be at least 6 characters";
        }

        if (
            fieldRules.minLength &&
            value &&
            value.length < fieldRules.minLength
        ) {
            errors[field] = `Minimum ${fieldRules.minLength} characters`;
        }

        if (
            fieldRules.maxLength &&
            value &&
            value.length > fieldRules.maxLength
        ) {
            errors[field] = `Maximum ${fieldRules.maxLength} characters`;
        }
    });

    return errors;
};
