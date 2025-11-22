import { z } from "zod";

const EmailChangeSchema = z.object({
    email: z.string().email(),
});

export default EmailChangeSchema;