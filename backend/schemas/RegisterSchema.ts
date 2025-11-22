import zod from "zod";

const RegisterSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8).max(16),
  username: zod.string().min(3).max(16),
  nickname: zod.string().min(1).max(16).optional(),
});

export default RegisterSchema;
