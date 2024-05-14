import { z } from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, {message: 'Too short'}),
    email: z.string().min(2, {message: 'Too short'}),
    password: z.string().min(2, {message: 'Too short'}),
});