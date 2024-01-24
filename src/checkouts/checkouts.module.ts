import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Checkout,
  CheckoutItem,
  CheckoutProduct,
} from './entities/checkout.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout, CheckoutItem, CheckoutProduct]),
  ], // Creates a repository for the Checkout entity.
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule {}
