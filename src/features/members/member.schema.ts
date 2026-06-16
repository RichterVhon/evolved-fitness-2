import { z } from "zod";

export const createMemberSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  emergencyContact: z.string().min(1, { message: "Emergency contact is required" }),
});

export const updateMemberSchema = createMemberSchema
  .omit({ email: true, password: true })
  .partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
