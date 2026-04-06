import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/api-error';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(400, 'Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role } };
  }

  static async refresh(token: string) {
    const payload = verifyRefreshToken(token) as any;
    const savedToken = await prisma.refreshToken.findUnique({ where: { token } });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) throw new ApiError(401, 'User not found');

    return generateAccessToken({ id: user.id, role: user.role });
  }

  static async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
}