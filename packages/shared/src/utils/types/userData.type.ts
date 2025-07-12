export type UserDataType = {
    
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