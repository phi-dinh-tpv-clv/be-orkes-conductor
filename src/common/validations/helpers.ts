export function hasQuestionMarkBeforeEnd(string) {
  return /\?.+/.test(string);
}

export function isPhoneNumber(number) {
  return /\+[0-9]{2} [0-9]{3} [0-9]{3} [0-9]{3}/.test(number);
}

export function containsPatternBeforeEnd(string, pattern) {
  return RegExp(`${pattern}.+`).test(string);
}

export function wereFilesFound(string) {
  return /[1-9][0-9]* files? found/.test(string);
}

export function isAlphanumeric(string) {
  return /\w/.test(string);
}

export function isNotAlphanumeric(string) {
  return /\W/.test(string);
}

export function isItADigit(string) {
  return /\d/.test(string);
}

export function containsWhitespace(string) {
  return /\s/.test(string);
}

export function areAllCharactersDigits(string) {
  return /^[0-9]+$/.test(string);
}
