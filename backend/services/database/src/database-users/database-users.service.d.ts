import { UserRepository } from '../repositories/user.repository';
export declare class DatabaseUsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getAllUsers(): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    getUserByID(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getUserByEmail(email: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addNewUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<boolean>;
    loginUser(email: string, password: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
