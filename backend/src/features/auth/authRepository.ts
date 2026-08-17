import { prisma } from "../../config/prisma.js";
import type { RegistrationDTO } from "./authSchema.js";

export const authRepository = {
  async create(data: RegistrationDTO) {
    const user = await prisma.user.create({ data });
    return user;
  },

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email }});
    return user;
  },
};
