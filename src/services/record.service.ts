import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/api-error';

const prisma = new PrismaClient();

export class RecordService {
  static async createRecord(userId: string, data: any) {
    return prisma.financialRecord.create({
      data: { ...data, userId },
    });
  }

  static async getRecords(filters: any) {
    const { page = 1, limit = 10, type, category, search, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: any = { 
        isDeleted: false,
        ...(type && { type }),
        ...(category && { category: { contains: category, mode: 'insensitive' } }),
        ...(search && { notes: { contains: search, mode: 'insensitive' } }),
        ...(startDate && endDate && { date: { gte: new Date(startDate), lte: new Date(endDate) } })
    };

    const [items, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { date: 'desc' },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return { items, total, page: Number(page), pages: Math.ceil(total / limit) };
  }

  static async updateRecord(id: string, userId: string, role: string, data: any) {
    const record = await prisma.financialRecord.findUnique({ where: { id } });
    if (!record) throw new ApiError(404, 'Record not found');
    
    // Authorization: Only owner or admin can update
    if (record.userId !== userId && role !== 'ADMIN') {
        throw new ApiError(403, 'Unauthorized to update this record');
    }

    return prisma.financialRecord.update({ where: { id }, data });
  }

  static async deleteRecord(id: string) {
    return prisma.financialRecord.update({ where: { id }, data: { isDeleted: true } });
  }

  static async getAnalytics() {
    const records = await prisma.financialRecord.findMany({ where: { isDeleted: false } });
    
    const income = records.filter(r => r.type === 'INCOME').reduce((sum, r) => sum + r.amount, 0);
    const expenses = records.filter(r => r.type === 'EXPENSE').reduce((sum, r) => sum + r.amount, 0);
    
    // Category totals
    const categories = records.reduce((acc: any, r) => {
        acc[r.category] = (acc[r.category] || 0) + r.amount;
        return acc;
    }, {});

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      categoryBreakdown: categories,
      recentTransactions: records.slice(0, 5)
    };
  }
}