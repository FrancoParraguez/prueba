export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  static async create(userData: Omit<IUser, 'id'>): Promise<IUser> {
    // Implementación para crear usuario
    return userData as IUser;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    // Implementación para buscar por email
    return null;
  }

  static async findById(id: number): Promise<IUser | null> {
    // Implementación para buscar por ID
    return null;
  }
}