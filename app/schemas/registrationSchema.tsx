import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is mandatory'),

  applied_ca: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  is_verified: z.boolean(),
  password: z.string().optional(), 
  role: z.string(),
  sphinx_id: z.string(),
  _id: z.string(),
  __v: z.number(),

  collegeName: z.string().optional(),
  collegeId: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  eventsRegisteredIn: z.array(z.string()).optional(),
  ticketID: z.string().optional(),
});


export type RegistrationData = z.infer<typeof registrationSchema>;