import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class DatabaseUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserByID(id: string) {
    return this.userRepository.findByID(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async addNewUser(data: { name: string; email: string; password: string }) {
    return this.userRepository.addNewUser(data);
  }

  async loginUser(email: string, password: string) {
    return this.userRepository.loginUser(email, password);
  }
  async deleteUser(id: string) {
    return this.userRepository.deleteUser(id)
  }
}