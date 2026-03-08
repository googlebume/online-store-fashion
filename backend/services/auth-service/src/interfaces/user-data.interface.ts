/**
 * User Data Interface
 * Used for storing user data during registration/login process.
 * Some fields are optional as they may not be available at all stages.
 */
export interface UserData {
  id?: string;
  name?: string;
  email: string;
  password: string;
  roles?: string[];
}
