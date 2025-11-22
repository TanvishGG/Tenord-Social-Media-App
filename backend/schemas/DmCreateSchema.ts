import { z } from "zod";

const DmCreateSchema = z.object({
    username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_.]+$/),
});

export default DmCreateSchema;