export type UserDataType = {
    id: number | string;
    name: string;
    email: string;
    role: string[];
    avatar?: string | null;
    createdAt?: string;
}

export type UserViewDataType = {
    id: number | string;
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

