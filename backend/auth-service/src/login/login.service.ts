import { Injectable } from '@nestjs/common';


@Injectable()
export class LoginService {
    hello() {
        console.log('Hello from LoginService!');
    }
}
