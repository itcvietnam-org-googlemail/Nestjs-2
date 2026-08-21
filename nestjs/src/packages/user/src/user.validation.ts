import Joi from 'joi';

export const userValidationSchema = {
    USER_REALTIME_URL: Joi.string().uri().required(),
    USER_VALIDATE_URL: Joi.string().optional()
};