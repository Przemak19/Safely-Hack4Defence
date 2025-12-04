import Joi from "joi";
import { joiXssValidator } from "./xssValidator.ts";
import { EventCategoryEnum } from "../shared/enums/EventCategory.enum.ts";

const JoiWithXss = Joi.extend(joiXssValidator);

const eventCategoryValues = Object.values(EventCategoryEnum);

export const eventSchema = JoiWithXss.object({
    firstName: JoiWithXss.string()
        .min(2)
        .max(50)
        .xssSafe()
        .required()
        .messages({
            "string.empty": "First name is required",
            "string.min": "First name must be at least 2 characters",
            "string.max": "First name must be less than 50 characters",
        }),
    lastName: JoiWithXss.string()
        .min(2)
        .max(50)
        .xssSafe()
        .required()
        .messages({
            "string.empty": "Last name is required",
            "string.min": "Last name must be at least 2 characters",
            "string.max": "Last name must be less than 50 characters",
        }),
    phoneNumber: JoiWithXss.string()
        .pattern(/^\+?[0-9]{7,15}$/)
        .xssSafe()
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be a valid number with 7-15 digits"
        }),
    streetName: JoiWithXss.string()
        .min(2)
        .max(100)
        .xssSafe()
        .required(),
    city: JoiWithXss.string()
        .min(2)
        .max(50)
        .xssSafe()
        .required(),
    state: JoiWithXss.string()
        .min(2)
        .max(50)
        .xssSafe()
        .required(),
    eventDescription: JoiWithXss.string()
        .min(10)
        .max(500)
        .xssSafe()
        .required(),
    eventCategory: JoiWithXss.string()
        .valid(...eventCategoryValues)
        .xssSafe()
        .required()
        .messages({
            "any.only": `Event category must be one of: ${eventCategoryValues.join(", ")}`
        }),
    coordinates: JoiWithXss.object({
        latitude: JoiWithXss.string()
            .xssSafe()
            .required()
            .messages({
                "string.pattern.base": "Latitude must be a valid coordinate"
            }),
        longitude: JoiWithXss.string()
            .xssSafe()
            .required()
            .messages({
                "string.pattern.base": "Longitude must be a valid coordinate"
            }),
    }).required(),
});

export type EventFormData = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    streetName: string;
    city: string;
    state: string;
    eventDescription: string;
    eventCategory: EventCategoryEnum;
    coordinates: {
        latitude: string;
        longitude: string;
    }
};
