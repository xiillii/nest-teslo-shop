import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'dc200016-ca42-4f68-8bba-780914a751b9',
    description: 'Product Identifier',
    uniqueItems: true,
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
    required: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 2.34,
    description: 'Price',
    uniqueItems: false,
    required: false,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example:
      'Aute eu cupidatat commodo id magna veniam consequat duis laboris id eu.',
    description: 'Product Description',
    default: null,
    uniqueItems: false,
    required: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product Slug',
    uniqueItems: true,
    required: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 2,
    description: 'Stock',
    uniqueItems: false,
    required: false,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({ example: ['M', 'XL', 'XXL'], description: 'Product sizes' })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: `Product Gender. Must be in ['men', 'women', 'kid', 'unisex']`,
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user?: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
