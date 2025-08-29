import { UserRepository } from '../repositories/user.repository';
export declare class DatabaseUsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getAllUsers(): Promise<any>;
    getUserByID(id: string): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    addNewUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<boolean>;
    loginUser(email: string, password: string): Promise<any>;
}
