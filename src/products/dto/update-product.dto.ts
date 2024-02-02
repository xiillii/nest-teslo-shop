// import { PartialType } from '@nestjs/mapped-types';
// we import from swagger to document the dto
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
