export const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = password => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password)
}

export const removeWhitespace = text => {
    const regex = /\s/g; //문자열 전체에서 공백을 찾는다.
    return text.replace(regex, '');
};
