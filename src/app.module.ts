import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoginServiceModule } from './login-service/login-service.module';
import { RestaurantServiceModule } from './restaurant-service/restaurant-service.module';
import { UtilityModule } from './utility/utility.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginServiceMiddleware } from './login-service/login-service.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoginServiceModule,
    RestaurantServiceModule,
    UtilityModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY || '1h' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginServiceMiddleware)
      .exclude({ path: 'auth', method: RequestMethod.ALL });
  }
}
