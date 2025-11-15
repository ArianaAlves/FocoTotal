import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};
