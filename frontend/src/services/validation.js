export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email jest wymagany';
    if (!regex.test(email)) return 'Nieprawidłowy format emaila';
    return null;
};

export const validatePassword = (password) => {
    if (!password) return 'Hasło jest wymagane';
    if (password.length < 10)
        return 'Hasło musi mieć minimum 10 znaków';
    if (!/[A-Z]/.test(password))
        return 'Hasło musi zawierać wielką literę';
    if (!/[a-z]/.test(password))
        return 'Hasło musi zawierać małą literę';
    if (!/[0-9]/.test(password))
        return 'Hasło musi zawierać cyfrę';
    if (!/[!@#$%^&*]/.test(password))
        return 'Hasło musi zawierać znak specjalny (!@#$%^&*)';
    return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Potwierdzenie hasła jest wymagane';
    if (password !== confirmPassword) return 'Hasła nie są identyczne';
    return null;
};

export const validateName = (name, fieldName) => {
    const regex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!name) return `${fieldName} jest wymagane`;
    if (!regex.test(name))
        return `${fieldName} może zawierać tylko litery`;
    if (name.length < 2)
        return `${fieldName} musi mieć minimum 2 znaki`;
    return null;
};

export const validatePhone = (phone) => {
    const regex = /^[0-9]{9}$/;
    if (!phone) return 'Numer telefonu jest wymagany';
    if (!regex.test(phone))
        return 'Numer telefonu musi zawierać dokładnie 9 cyfr';
    return null;
};

export const validateRegisterForm = (formData) => {
    const errors = {};

    const firstNameError = validateName(formData.firstName, 'Imię');
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Nazwisko');
    if (lastNameError) errors.lastName = lastNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    return errors;
};

export const validateLoginForm = (formData) => {
    const errors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    if (!formData.password) errors.password = 'Hasło jest wymagane';

    return errors;
};

export const validateDoctorForm = (formData) => {
    const errors = {};

    const firstNameError = validateName(formData.firstName, 'Imię');
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Nazwisko');
    if (lastNameError) errors.lastName = lastNameError;

    if (!formData.specialization)
        errors.specialization = 'Specjalizacja jest wymagana';

    if (!formData.roomNumber)
        errors.roomNumber = 'Numer gabinetu jest wymagany';

    const phoneError = validatePhone(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    return errors;
};