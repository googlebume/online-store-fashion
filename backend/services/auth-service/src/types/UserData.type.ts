/**
 * User Data Type
 * Used for storing user data during registration/login process
 * Some fields are optional as they may not be available at all stages
 */
export type UserDataType = {
    id?: string;
    name?: string;
    email: string;
    password: string;
    roles?: string[];
}