import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {productsDB} from './../dto/productsDB'
import { databaseClient } from '../database.client';
// import {ProductRepository } from '../../../database/src/repositories/product.repository'

@Injectable()
export class CardsRenderService {
  // constructor(private productRepository: ProductRepository) {}
  getProducts (): object {
    console.log('Request to productsDB');
    return productsDB;
  }
  async useDB() {
    const response = await lastValueFrom(databaseClient.send('get_products', {}));
    console.log('Отримано відповідь:', response);
    return response;
  }
}