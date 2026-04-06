import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/api-error';

const prisma = new PrismaClient();

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true }
    });
  }

  static async updateUser(id: string, data: { role?: string; isActive?: boolean }) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, 'User not found');

    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}