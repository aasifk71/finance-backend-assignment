import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catch-async';

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  });

  static login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.json({ status: 'success', ...result });
  });

  static refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const accessToken = await AuthService.refresh(refreshToken);
    res.json({ status: 'success', accessToken });
  });

  static logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.status(204).send();
  });
}