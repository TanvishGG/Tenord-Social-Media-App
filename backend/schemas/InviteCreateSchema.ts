import { z } from "zod";

const InviteCreateSchema = z.object({
    channel_id: z.string(),
});

export default InviteCreateSchema;