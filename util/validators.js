const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = "Username must not be empty";
    }
    if (email.trim() === '') {
        errors.email = "Email must not be empty";
    } else {
        if (!validateEmail(email)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (password === '') {
        errors.password = "Password must not be empty";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = "username must not be empty";
    }
    if (password.trim() === '') {
        errors.password = 'password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}