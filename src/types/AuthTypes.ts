import { object, ref, string } from "yup";

export const phoneRegExp = /^\d{10}$/;
export const phoneWithCountryCodeRegExp = /^\+\d{1,3}\d{10}$/;
export const emailRegExp = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const phoneNumberWithDashAndBracketRegExp = RegExp(
  "^\\([0-9]{3}\\)[0-9]{1,3}-[0-9]{1,4}$"
);

export const phoneNumberWithCountryCodeAndDashAndBracketRegExp = RegExp(
  "^\\+[0-9]{1}\\([0-9]{3}\\)[0-9]{1,3}-[0-9]{1,4}$"
);

export const stringOnlyRegExp = /^[a-zA-Z]+$/;

export let LoginFormSchema = object({
  email: string()
    .required("Email is required")
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    }),
  password: string()
    .required("Password is required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
});

export type LoginFormDataType = {
  email: string;
  password: string;
};

export let RegisterFormSchema = object({
  firstName: string(),
  // .required("First name is required")
  // .matches(stringOnlyRegExp, "First name must be alphabetic"),
  lastName: string(),
  // .required("Last name is required")
  // .matches(stringOnlyRegExp, "Last name must be alphabetic"),
  email: string()
    .required("Email is required")
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    }),
  referringEmail: string()
    .nullable()
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    }),
  mobile: string()
    .required("Phone number is required")
    .max(13, "Phone number must be 10 digits")
    .matches(
      phoneNumberWithDashAndBracketRegExp,
      "Please enter a valid phone number"
    ),
  password: string()
    .required("Password is required")
    .test(
      "password",
      "Password must be 8 characters long and contain a number, lowercase letter, uppercase letter, and symbol",
      (value) => {
        if (value) {
          return (
            value.length >= 8 &&
            /[0-9]/.test(value) &&
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /[^\w]/.test(value)
          );
        }
        return true;
      }
    ),
  confirmPassword: string()
    .required("Password is required")
    .oneOf([ref("password")], "Password does not match"),
});

export let EditProfileFormSchema = object({
  firstName: string()
    .required("First name is required")
    .matches(stringOnlyRegExp, "First name must be alphabetic"),
  lastName: string()
    .required("Last name is required")
    .matches(stringOnlyRegExp, "Last name must be alphabetic"),
  email: string()
    .required("Email is required")
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    }),
  referringEmail: string()
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    })
    .nullable(),
  mobile: string()
    .required("Phone number is required")
    .max(10, "Phone number must be 10 digits")
    .test("mobile", "Phone number is not valid", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return phoneRegExp.test(value);
      }
    }),
  password: string()
    .nullable()
    .test(
      "password",
      "Password must be 8 characters long and contain a number, lowercase letter, uppercase letter, and symbol",
      (value) => {
        if (value) {
          return (
            value.length >= 8 &&
            /[0-9]/.test(value) &&
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /[^\w]/.test(value)
          );
        }
        return true;
      }
    ),

  confirmPassword: string()
    .nullable()
    .oneOf([ref("password")], "Password does not match"),
  // address1: string().required("Shipping address is required")
  //   .nullable()
  //   .max(100, "Address must be less than 100 characters")
  //   .test(
  //     "address2",
  //     "Address must be between 5 and 100 characters",
  //     (value) => {
  //       if (value === null || value === undefined || value === "") {
  //         return true;
  //       } else {
  //         return /^[A-Za-z0-9\s\-,.]{5,100}$/.test(value);
  //       }
  //     }
  //   ),
  // address2: string()
  //   .nullable()
  //   .max(100, "Address must be less than 100 characters")
  //   .test(
  //     "address2",
  //     "Address must be between 5 and 100 characters",
  //     (value) => {
  //       if (value === null || value === undefined || value === "") {
  //         return true;
  //       } else {
  //         return /^[A-Za-z0-9\s\-,.]{5,100}$/.test(value);
  //       }
  //     }
  //   ),
  city: string()
    .nullable()
    .test("city", "City must be between 2 and 30 characters", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^[A-Za-z\s]{2,30}$/.test(value);
      }
    }),
  state: string()
    .nullable()
    .test("state", "State should be 2 characters", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^[A-Z]{2}$/.test(value);
      }
    }),
  zip: string()
    .test("zip", "Zip code is not valid", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return /^\d{5}(?:\d{4})?$/.test(value);
      }
    })
    .nullable(),
  gender: string().nullable(),
});
export type GetRegisterOTPDataType = {
  email: string;
  mobile: string;
};

export type RegisterFormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  referringEmail: string | null | undefined;
  password: string;
  confirmPassword: string;
};

export type RegisterFormReqDataType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  referringEmail: string | null;
  password: string;
  confirmPassword: string;
};

export type EditProfileFormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  referringEmail: string | null | undefined;
  password: string | null | undefined;
  confirmPassword: string | null | undefined;
  address1: string | undefined | null;
  address2: string | undefined | null;
  city: string | null | undefined;
  state: string | null | undefined;
  zip: string | null | undefined;
  gender: string | null | undefined;
};

export type EditProfileReqDataType = {
  firstName: string | null;
  lastName: string | null;
  email?: string;
  mobile?: string;
  referringEmail: string | null;
  password: string | null;
  address1: string | null;
  address2: string | null;
  city: any;
  state: any;
  zip: string | null;
  // edit
  Dob?: Date | null;
  Gender?: string | null;
};

export type RegisterVerifyOTPDataType = {
  firstName: string;
  lastName: string;
  email: string;
  referringEmail: string | null;
  password: string;
  mobile: string;
  allowCommunication: boolean;
};

export type ForgotPasswordDataType = {
  email: string;
};

export let ForgotPasswordFormSchema = object({
  email: string()
    .required("Email is required")
    .test("email", "Invalid email", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      } else {
        return emailRegExp.test(value);
      }
    }),
});

export type SetPasswordFormType = {
  password: string;
  confirmPassword: string;
};

export let SetPasswordFormSchema = object({
  password: string()
    .required("Password is required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  confirmPassword: string()
    .required("Password is required")
    .oneOf([ref("password")], `Password doesn't match`),
});

export type ChangePasswordFormType = {
  password: string;
  confirmPassword: string;
};

export type ResetPasswordDataType = {
  emailToken: string;
  password: string;
};

export let ChangePasswordFormSchema = object({
  password: string()
    .required("Password is required")
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
  confirmPassword: string()
    .required("Password is required")
    .oneOf([ref("password")], `Password doesn't match`),
});
