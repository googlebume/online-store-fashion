import { Request, Response, NextFunction } from 'express';
import { RegisterController } from 'src/register/register.controller';
import { LoginController } from 'src/login/login.controller';

export const authEventMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { event } = req.body;

  if (event === 'register') {
    return RegisterController.handle(req, res, next);
  }

//   if (event === 'login') {
//     return LoginController.handle(req, res, next);
//   }

  return res.status(400).json({ error: 'Invalid event type' });
};
