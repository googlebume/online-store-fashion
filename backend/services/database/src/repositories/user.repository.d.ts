import { PrismaService } from 'src/prisma.service';
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByID(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findAll(): Promise<any>;
    addNewUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<boolean>;
    loginUser(email: string, password: string): Promise<any>;
}
