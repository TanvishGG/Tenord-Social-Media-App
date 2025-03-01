import zod from "zod";

const LoginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export default LoginSchema;
