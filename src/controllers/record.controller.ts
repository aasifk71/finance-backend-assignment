import { Response } from 'express';
import { RecordService } from '../services/record.service';
import { catchAsync } from '../utils/catch-async';
import { AuthRequest } from '../middleware/auth.middleware';

export class RecordController {
  static create = catchAsync(async (req: AuthRequest, res: Response) => {
    const record = await RecordService.createRecord(req.user!.id, req.body);
    res.status(201).json({ status: 'success', data: record });
  });

  static getAll = catchAsync(async (req: AuthRequest, res: Response) => {
    const records = await RecordService.getRecords(req.query);
    res.json({ status: 'success', data: records });
  });

  static update = catchAsync(async (req: AuthRequest, res: Response) => {
    const record = await RecordService.updateRecord(req.params.id, req.user!.id, req.user!.role, req.body);
    res.json({ status: 'success', data: record });
  });

  static delete = catchAsync(async (req: AuthRequest, res: Response) => {
    await RecordService.deleteRecord(req.params.id);
    res.status(204).send();
  });

  static getAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
    const analytics = await RecordService.getAnalytics();
    res.json({ status: 'success', data: analytics });
  });
}