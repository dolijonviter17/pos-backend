import Joi from "joi";

export const schemeValidationRegisterCustomer = (data: any) => {
  const scheme = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    fullname: Joi.string().min(5).required(),
    username: Joi.string().alphanum().min(3).max(30).required().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    password_confirm: Joi.ref("password"),
    phone_number: Joi.string().min(9).required(),
    photo: Joi.string().default("customers.png"),
  });
  return scheme.validate(data, { abortEarly: false });
};
