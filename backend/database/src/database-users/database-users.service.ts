import { Injectable } from '@nestjs/common';
import {UserRepository} from '../repositories/user.repository'

@Injectable()
export class DatabaseUsersService {
    constructor(private readonly userRepository: UserRepository){}

    async getAllUsers(){
        return this.userRepository.findAll()
    }
    async getUserByID(id:number){
        return this.userRepository.findByID(id)
    }
    async addNewUser(data){
        return this.userRepository.addNewUser(data)
    }
    async loginUser(email, password){
        return this.userRepository.loginUser(email, password)
    }
}
