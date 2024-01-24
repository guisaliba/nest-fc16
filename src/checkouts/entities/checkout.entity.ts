import {
  Column,
  CreateDateColumn,
  Entity,
  InsertQueryBuilder,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type CreateCheckoutCommand = {
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      image_url: string;
      product_id: number;
    };
  }[];
};

export enum CheckoutStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: CheckoutStatus = CheckoutStatus.Pending;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'],
  })
  items: CheckoutItem[];

  static create(data: CreateCheckoutCommand) {
    const checkout = new Checkout();
    checkout.items = data.items.map((item) => {
      const checkoutItem = new CheckoutItem();
      checkoutItem.quantity = item.quantity;
      checkoutItem.price = item.price;
      checkoutItem.product = new CheckoutProduct();
      checkoutItem.product.name = item.product.name;
      checkoutItem.product.description = item.product.description;
      checkoutItem.product.image_url = item.product.image_url;
      checkoutItem.product.product_id = item.product.product_id;

      return checkoutItem;
    });

    checkout.total = checkout.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    return checkout;
  }

  pay() {
    if (this.status === CheckoutStatus.Completed) {
      throw new Error('Checkout already paid');
    }

    if (this.status === CheckoutStatus.Cancelled) {
      throw new Error('Checkout cancelled');
    }

    this.status = CheckoutStatus.Completed;
  }

  fail() {
    if (this.status === CheckoutStatus.Cancelled) {
      throw new Error('Checkout cancelled');
    }

    if (this.status === CheckoutStatus.Completed) {
      throw new Error('Checkout already paid');
    }

    this.status = CheckoutStatus.Cancelled;
  }
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  product_id: number;
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  price: number;

  @ManyToOne(() => Checkout)
  checkout: Checkout;

  @ManyToOne(() => CheckoutProduct, { cascade: ['insert'], eager: true })
  product: CheckoutProduct;
}
