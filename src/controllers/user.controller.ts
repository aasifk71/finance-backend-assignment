import { Response } from 'express';
import { UserService } from '../services/user.service';
import { catchAsync } from '../utils/catch-async';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  static getAll = catchAsync(async (req: AuthRequest, res: Response) => {
    const users = await UserService.getAllUsers();
    res.json({ status: 'success', data: users });
  });

  static update = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.json({ status: 'success', data: user });
  });

  static delete = catchAsync(async (req: AuthRequest, res: Response) => {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  });
}