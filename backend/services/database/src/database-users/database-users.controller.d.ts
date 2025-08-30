import { DatabaseUsersService } from './database-users.service';
export declare class DatabaseUsersController {
    private readonly databaseUsersService;
    constructor(databaseUsersService: DatabaseUsersService);
    getAllUsers(): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    getUserByID(data: {
        id: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getUserByEmail(data: {
        email: string;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addNewUser(data: any): Promise<boolean>;
    loginUser({ email, password }: {
        email: any;
        password: any;
    }): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
