import { Injectable } from '@nestjs/common';
import { productsDB } from "../dto/productsDB";

@Injectable()
export class FiltersHandlerService {
    filterCategorys(filters: { [key: string]: string }) {
        return productsDB.filter(product => {
            return Object.entries(filters).every(([key, value]) => product[key] === value);
        });
    }
}
