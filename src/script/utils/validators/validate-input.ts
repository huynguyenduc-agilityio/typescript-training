import { VALIDATE_MESSAGE } from '../../constants/message';
import {
  A_CHARACTER_REGEX,
  CHARACTERS_REGEX,
  EMAIL_REGEX,
  LOWERCASE_REGEX,
  UPPERCASE_REGEX,
} from '../../constants/regex';

const validateRequired = (value = '', field: string): string | undefined => {
  return value ? undefined : VALIDATE_MESSAGE.requiredError.replace('{field}', field);
};

export const validateEmail = (email = ''): string | undefined => {
  //if email is blank or undefined
  if (!email) {
    return validateRequired(email, 'Email');
  }

  //if email not match regex email
  if (!email.match(EMAIL_REGEX)) {
    return VALIDATE_MESSAGE.notValidEmail;
  }

  return;
};

export const validatePassword = (password = ''): string | undefined => {
  //if password is blank or undefined
  if (!password) {
    return validateRequired(password, 'Password');
  }

  //if password not match at least 8 characters for password
  if (!password.match(CHARACTERS_REGEX)) {
    return VALIDATE_MESSAGE.charactersPassWordError;
  }

  //if password not match at least 1 uppercase letter
  if (!password.match(UPPERCASE_REGEX)) {
    return VALIDATE_MESSAGE.upperCasePassWordError;
  }

  //if password not match at least 1 lowercase letter
  if (!password.match(LOWERCASE_REGEX)) {
    return VALIDATE_MESSAGE.lowercasePassWordError;
  }

  //if password not match at least 1 number character
  if (!password.match(A_CHARACTER_REGEX)) {
    return VALIDATE_MESSAGE.ANumberCharacterPassWordError;
  }

  return;
};

export const validateConfirmPassword = (
  password = '',
  passwordConfirm = ''
): string | undefined => {
  //if password confirmation is blank or undefined
  if (!passwordConfirm) {
    return validateRequired(passwordConfirm, 'Password confirmation');
  }

  //if password confirmation do not match password
  if (passwordConfirm !== password) {
    return VALIDATE_MESSAGE.confirmPasswordError;
  }

  return;
};
