import zod from "zod";

const ForgotPasswordSchema = zod.object({
  email: zod.string().email(),
});

export default ForgotPasswordSchema;
