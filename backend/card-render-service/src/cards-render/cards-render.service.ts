import { Injectable } from '@nestjs/common';
import {productsDB} from './../dto/productsDB'

@Injectable()
export class CardsRenderService {
  getProducts (): object {
    console.log('Request to productsDB');
    return productsDB;
  }
}