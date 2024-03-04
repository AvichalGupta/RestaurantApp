import * as Joi from 'joi';

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignUpPayload {
  email: string;
  password: string;
  role: Roles;
}

export interface userSchema {
  password: string;
  role: Roles;
  authToken: string;
}

export enum Roles {
  admin = 'admin',
  bo = 'business_owner',
  user = 'user',
}

export enum LoginErrorResponse {
  LF1 = 'Please signup first!',
  LF2 = 'Incorrect password, please try again.',
  LF3 = 'Please reset your password.',
  LF4 = 'Invalid ENV data, please upload secret key into env.',
  LF5 = 'Unauthorized, token missing',
  LF6 = 'Auth Token verification failure.',
  LF7 = 'Token Expired, please login to continue.',
  LF8 = 'Account already exists, please login.',
  LF9 = 'Sorry, you cannot access this resource! Please upgrade your role to access this resource.',
  LF10 = 'Malformed Token',
}

export interface JWTPayload {
  email: string;
  userRole: Roles;
}

export const loginAPISchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(false);

export const signupAPISchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(...Object.values(Roles))
    .required(),
}).unknown(false);
