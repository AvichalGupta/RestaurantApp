import { Module } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { RestaurantServiceController } from './restaurant-service.controller';
import { UtilityModule } from 'src/utility/utility.module';

@Module({
  imports: [UtilityModule],
  providers: [RestaurantServiceService],
  controllers: [RestaurantServiceController],
})
export class RestaurantServiceModule {}
