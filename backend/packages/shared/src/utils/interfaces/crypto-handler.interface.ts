export interface UtilsHandlerInterface {
    generateSalt(length?: number): Promise<string>;
}

export interface EncryptHandlerInterface {
    encrypt(data: string, salt?: string): Promise<string>;
}

export interface HashHandlerInterface {
    // hash(data: string, salt: string): Promise<string>;
    bcryptHash(data: string, saltLength: number): Promise<string>;
    cryptoHash(data: string, saltLength: number): Promise<string>;
    compare(input: string, hashed: string): Promise<boolean>;
}