import { DatabaseUsersService } from './database-users.service';
export declare class DatabaseUsersController {
    private readonly databaseUsersService;
    constructor(databaseUsersService: DatabaseUsersService);
    getAllUsers(): Promise<any>;
    getUserByID(data: {
        id: string;
    }): Promise<any>;
    getUserByEmail(data: {
        email: string;
    }): Promise<any>;
    addNewUser(data: any): Promise<boolean>;
    loginUser({ email, password }: {
        email: any;
        password: any;
    }): Promise<any>;
}
