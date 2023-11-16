import { Module } from '@nestjs/common';
import { LoginsService } from './logins.service';
import { LoginsController } from './logins.controller';
import { Login } from './entities/login.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LoginsController],
  providers: [LoginsService],
  exports: [LoginsService],
  imports: [TypeOrmModule.forFeature([Login])],
})
export class LoginsModule {}
