import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Auth } from './decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IActiveUser } from 'src/common/interfaces/active-user.interface';
import { RoleGuard } from './guards/role.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary Iniciar sesión de usuario
   * @description Inicia sesión de un usuario.
   * @param loginAuthDto Datos de autenticación del usuario.
   * @returns Respuesta de éxito al iniciar sesión.
   */
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión de usuario',
    description: 'Inicia sesión de un usuario.',
  })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  /**
   * @summary Registrar usuario
   * @description Registra un nuevo usuario.
   * @param registerAuthDto Datos de registro del usuario.
   * @returns Respuesta de éxito al registrar usuario.
   */
  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Registra un nuevo usuario.',
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta' })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  /**
   * @summary Perfil de usuario
   * @description Obtiene la información del perfil del usuario.
   * @param user Usuario activo autenticado.
   * @returns Perfil del usuario recuperado exitosamente.
   */
  @Get('profile')
  @Auth(Role.User)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({
    summary: 'Perfil de usuario',
    description: 'Obtiene la información del perfil del usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario recuperado exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  profile(@ActiveUser() user: IActiveUser) {
    return this.authService.profile(user);
  }
}
