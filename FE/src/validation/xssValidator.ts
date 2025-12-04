
const XSS_REGEX = /[<>'"&]|javascript:|vbscript:|data:|on\w+\s*=|expression\s*\(/gi;

export const isXssSafe = (input: string): boolean => {
  if (!input) return true;
  return !XSS_REGEX.test(input);
};

export const sanitizeXss = (input: string): string => {
  if (!input) return input;

  return input.replace(XSS_REGEX, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '&': return '&amp;';
      default: return match;
    }
  });
};

export const joiXssValidator = (joi: any) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.xssSafe': 'Input contains potentially unsafe characters'
  },
  rules: {
    xssSafe: {
      validate(value: string, helpers: any) {
        if (!isXssSafe(value)) {
          return helpers.error('string.xssSafe');
        }
        return value;
      }
    }
  }
});

export const zodXssRefine = (input: string) => isXssSafe(input);
