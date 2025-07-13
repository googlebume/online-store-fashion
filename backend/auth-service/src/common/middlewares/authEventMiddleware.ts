// import { Request, Response, NextFunction } from 'express';
// import { RegisterController } from 'src/register/register.controller';
// import { LoginController } from 'src/login/login.controller';
// import { VerifyController } from 'src/verify/verify.controller';


// export const AuthEventMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   console.log('authEventMiddleware called with req.body:', req.body);
//   const { event, name, email, password } = req.body;
//   req.body = { name, email, password };
//   console.log('Отриманий event:', event, 'Очищені дані:', req.body);

//   if (event === 'register') {
//     console.log('Направляємо до RegisterController');
//     return RegisterController.handle(req, res, next);
//   }

//   if (event === 'login') {
//     console.log('Направляємо до LoginController');
//     return LoginController.handle(req, res, next);
//   }

//   return res.status(400).json({ error: 'Invalid event type' });
// };