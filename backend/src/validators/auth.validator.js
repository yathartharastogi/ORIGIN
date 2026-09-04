import { z } from "zod";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .string()
    .trim()
    .email()
    .transform((value) =>
      value.toLowerCase()
    ),

  password: z
    .string()
    .min(8)
    .max(100),
});


const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) =>
      value.toLowerCase()
    ),

  password: z
    .string()
    .min(1)
    .max(100),
});


export {
  registerSchema,
  loginSchema,
};