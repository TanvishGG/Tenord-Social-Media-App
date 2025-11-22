import { z } from "zod";

const MessageSchema = z.object({
    content: z.string().min(1).max(500).trim(),
});

export default MessageSchema;