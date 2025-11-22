import { User } from "@prisma/client";

export function filterUserData(user: User) {
  const { user_id, email, username, nickname, avatar, banner, about } = user;
  return {
    user_id,
    email,
    username,
    nickname,
    avatar,
    banner,
    about,
  };
}
