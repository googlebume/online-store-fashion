import { PrismaService } from '../prisma.service';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByID(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
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
