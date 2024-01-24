import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Checkout,
  CheckoutItem,
  CheckoutProduct,
} from './checkouts/entities/checkout.entity';

// Nest uses kebab-case for filenames and PascalCase for class names
@Module({
  // Decorator (ES7)
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, // Default port for MySQL, will be binded to Docker container that runs the database.
      username: 'root',
      password: 'root',
      database: 'nest',
      entities: [Checkout, CheckoutItem, CheckoutProduct], // checkout.entity.ts
      synchronize: true, // Identify entities and create tables automatically if they don't exist.
      logging: true,
    }),
    CheckoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} // root module
