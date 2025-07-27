import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async deleteMany(ids: number[]) {
    return await this.usersRepository.deleteMany(ids);
  }

  updateLastLogin(userId: number) {
    return this.usersRepository.updateLastLogin(userId);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  updateStatus(ids: number[], isBlocked: boolean) {
    return this.usersRepository.updateStatus(ids, isBlocked);
  }
}
