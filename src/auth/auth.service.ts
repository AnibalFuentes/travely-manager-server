import {
  BadRequestException,
  Body,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginAuthDto) {
    const existingUser =
      await this.usersService.findByUsernameWithPassword(email);

    if (!existingUser) {
      throw new BadRequestException(
        `El correo electrónico '${email}' no está registrado`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña no válida');
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: email,
    };
  }

  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.usersService.findOneByEmail(
      registerAuthDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(
        `El usuario con el correo '${registerAuthDto.email}' ya existe.`,
      );
    }

    if (!(registerAuthDto.role in Role)) {
      throw new BadRequestException(`Rol invalido: '${registerAuthDto.role}'`);
    }

    if (!registerAuthDto.isActive) {
      throw new BadRequestException(
        `El usuario con el correo electrónico '${registerAuthDto.email}' no está activo.`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerAuthDto.password,
      saltRounds,
    );

    registerAuthDto.password = hashedPassword;

    return await this.usersService.create(registerAuthDto);
  }

  async profile({ email: email }: { email: string }) {
    return await this.usersService.findOneByEmail(email);
  }
  move(id: number) {
    return `This action removes a #${id} auth`;
  }
}
