import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<object[]>;
    deleteUser(id: string): Promise<object>;
}
