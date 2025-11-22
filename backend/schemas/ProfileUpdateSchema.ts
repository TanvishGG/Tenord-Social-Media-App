import zod from "zod";

const ProfileUpdateSchema = zod.object({
  password: zod.string().min(8).max(16).optional(),
  username: zod.string().min(3).max(16).optional(),
  nickname: zod.string().min(1).max(16).optional(),
  avatar: zod.string().optional(),
  about: zod.string().optional(),
  email: zod.string().email().optional(),
  banner: zod.string().optional(),
});

export default ProfileUpdateSchema;
