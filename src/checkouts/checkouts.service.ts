import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { Checkout, CheckoutStatus } from './entities/checkout.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Simulação de uma chamada externa para capturar os produtos do microserviço de produtos.
const PRODUCTS_LIST = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    image_url: 'https://via.placeholder.com/150',
    price: 10,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    image_url: 'https://via.placeholder.com/150',
    price: 20,
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description 3',
    image_url: 'https://via.placeholder.com/150',
    price: 30,
  },
];

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Checkout) private checkoutRepo: Repository<Checkout>,
  ) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const productIds: number[] = createCheckoutDto.items.map(
      (item) => item.product_id,
    );
    // Chamada externa para capturar os produtos do microserviço de produtos.
    const products = PRODUCTS_LIST.filter((product) =>
      productIds.includes(product.id),
    );

    const checkout = Checkout.create({
      items: createCheckoutDto.items.map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );
        return {
          quantity: item.quantity,
          price: product.price,
          product: {
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            product_id: product.id,
          },
        };
      }),
    });

    await this.checkoutRepo.save(checkout);
    return checkout;
  }

  findAll() {
    return this.checkoutRepo.find();
  }

  findOne(id: number) {
    return this.checkoutRepo.findOneByOrFail({ id });
  }

  async pay(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.pay();
    return this.checkoutRepo.save(checkout);
  }

  async fail(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({ id });
    checkout.fail();
    return this.checkoutRepo.save(checkout);
  }
}
