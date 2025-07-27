import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const activeUser = await this.usersRepository.findOne({ where: { email } });
    if (activeUser) {
      throw new ConflictException('User already exists');
    }

    const softDeletedUser = await this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (softDeletedUser) {
      Object.assign(softDeletedUser, {
        name,
        password: hashedPassword,
        isBlocked: false,
        lastLogin: new Date(),
      });

      await this.usersRepository.save(softDeletedUser);
      await this.usersRepository.restore(softDeletedUser.id);

      return {
        name: softDeletedUser.name,
        email: softDeletedUser.email,
      };
    }

    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      lastLogin: new Date(),
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);
      return {
        name: savedUser.name,
        email: savedUser.email,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByResetToken(token: string) {
    return this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  findAll() {
    return this.usersRepository.find({ order: { lastLogin: 'DESC' } });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async deleteMany(ids: number[]) {
    await this.usersRepository.softDelete(ids);
    return { message: 'Users deleted successfully' };
  }

  async updateLastLogin(userId: number) {
    await this.usersRepository.update(userId, { lastLogin: new Date() });
  }

  async updateStatus(ids: number[], isBlocked: boolean) {
    await this.usersRepository.update(ids, { isBlocked });
    return {
      message: isBlocked
        ? 'Users successfully blocked'
        : 'Users successfully unblocked',
      ids,
    };
  }
}
