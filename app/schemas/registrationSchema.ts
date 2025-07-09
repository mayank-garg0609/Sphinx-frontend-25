import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1,"Email is mandatory").includes("@"),
  collegeName: z.string().min(1, 'College name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  collegeId: z.string().min(1, 'College ID is required'),
  sphinxId: z.string().min(1, 'Sphinx ID is required'),
  eventsRegisteredIn: z.array(z.string()).min(1, 'At least one event is required'),
  ticketID: z.string().min(1, 'ticketID must be at least 10 characters'),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
