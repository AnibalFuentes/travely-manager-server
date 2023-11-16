import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Login } from './entities/login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LoginsService {
  private readonly logger = new Logger('LoginsService');

  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  async create(user: User) {
    const login = new Login();
    login.user = user;
    return await this.loginRepository.save(login);
  }

  async findAll() {
    try {
      return await this.loginRepository.find({ relations: ['user'] });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByDate(date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.loginRepository
        .createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.createdAt >= :startOfDay', { startOfDay })
        .andWhere('login.createdAt <= :endOfDay', { endOfDay })
        .getMany();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findTodayLogins() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return await this.loginRepository
        .createQueryBuilder('login')
        .leftJoinAndSelect('login.user', 'user')
        .where('login.createdAt >= :today', { today })
        .getMany();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findLoginsByUserId(userId: string) {
    try {
      return await this.loginRepository.find({
        relations: ['user'],
        where: {
          user: { id: userId },
        },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado. Por favor, verifica los registros del servidor.',
    );
  }
}
