import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  async signup(name: string, email: string, passwordHash: string) {
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash }
    });
    return this.generateTokenAndUser(user);
  }

  async login(email: string, passwordInput: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const isValid = await bcrypt.compare(passwordInput, user.password);
    if (!isValid) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    return this.generateTokenAndUser(user);
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw { statusCode: 404, message: 'User not found' };
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateTokenAndUser(user: any) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    });
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}

export const authService = new AuthService();
