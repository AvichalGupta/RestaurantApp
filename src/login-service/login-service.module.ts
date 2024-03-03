import { Module } from '@nestjs/common';
import { LoginServiceController } from './login-service.controller';
import { LoginServiceService } from './login-service.service';
import { ConfigModule } from '@nestjs/config';
import { UtilityModule } from 'src/utility/utility.module';

@Module({
  imports: [ConfigModule, UtilityModule],
  controllers: [LoginServiceController],
  providers: [LoginServiceService],
  exports: [LoginServiceService],
})
export class LoginServiceModule {}
