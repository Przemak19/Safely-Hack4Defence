import Joi from 'joi';
import { joiXssValidator } from './xssValidator';

const JoiWithXss = Joi.extend(joiXssValidator);

export const ALLOWED_ROLES = ["Admin", "FireFighter", "Police", "Soldier", "CBZC"] as const;

export type AllowedRole = typeof ALLOWED_ROLES[number];

export const loginSchema = JoiWithXss.object({
  email: JoiWithXss.string().email({ tlds: { allow: false } }).xssSafe().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'string.xssSafe': 'Email contains potentially unsafe characters',
  }),
  password: JoiWithXss.string().min(6).xssSafe().required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.xssSafe': 'Password contains potentially unsafe characters',
  }),
});

export const registerSchema = JoiWithXss.object({
  email: JoiWithXss.string().email({ tlds: { allow: false } }).xssSafe().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'string.xssSafe': 'Email contains potentially unsafe characters',
  }),
  password: JoiWithXss.string().min(6).xssSafe().required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'string.xssSafe': 'Password contains potentially unsafe characters',
  }),
  confirmPassword: JoiWithXss.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',
    'string.empty': 'Password confirmation is required',
  }),
  role: JoiWithXss.string()
      .valid(...ALLOWED_ROLES)
      .required()
      .messages({
        'any.only': 'Invalid role selected',
        'string.empty': 'Role is required',
      }),
});

export type LoginFormData = {
  email?: string;
  password?: string;
};

export type RegisterFormData = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: AllowedRole;
};