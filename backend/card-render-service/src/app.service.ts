import { Injectable } from '@nestjs/common';
import {productsDB} from './dto/productsDB'

@Injectable()
export class AppService {
  getProducts (): object {
    console.log('Request to productsDB');
    return productsDB;
  }
}
