export type UserDataType = {
    id: number;
    name: string;
    email: string;
    role: string[];
    avatar?: string | null;
    createdAt?: string;
}

export type UserViewDataType = {
    id: number;
    name: string;
    role: Role;
}

enum Role {
    admin,
    user,
    manager,
    support,
    system,
  }

