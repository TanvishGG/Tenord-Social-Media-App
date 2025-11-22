import { z } from "zod";

const createChannelSchema = z.object({
    name: z.string().min(3).max(32),
})

export default createChannelSchema;