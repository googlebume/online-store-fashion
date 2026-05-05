import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import 'multer';
import { DATABASE_SERVICE } from '../microservices/tcp.tokens';
import { sendMicroserviceRpc } from '../microservices/tcp-rpc.util';

const DB_DOWN_HINT =
  'database-service недоступний (TCP 5001). Запустіть database-service (мікросервіс).';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@Inject(DATABASE_SERVICE) private readonly databaseClient: ClientProxy) {}

  private async rpc<TResult>(pattern: string, payload: unknown): Promise<TResult> {
    return sendMicroserviceRpc<TResult>(
      this.databaseClient,
      this.logger,
      'database',
      pattern,
      payload,
      DB_DOWN_HINT,
    );
  }

  async getAll() {
    this.logger.log('[getAll] Запит продуктів');
    try {
      const products = await this.rpc('get_products', {});
      if (!products || !(products as any).data) {
        this.logger.error('[getAll] Невалідна відповідь від БД:', products);
        return [];
      }
      return (products as any).data;
    } catch (error) {
      this.logger.error('[getAll] Помилка:', error);
      throw error;
    }
  }

  async editOneProduct(data, file?: Express.Multer.File) {
    this.logger.log('[editOneProduct] Вхідні дані:', data?.id);
    try {
      const price = typeof data.price === 'string' ? Number(data.price) : data.price;
      const discount = typeof data.discount === 'string' ? Number(data.discount) : data.discount;
      const payload = {
        id: data.id,
        name: data.name,
        description: data.description,
        price,
        discount,
        brand: data.brand || '',
        image: data.image || '',
      };

      const response = await this.rpc('edit_product', payload);

      if (file && (response as any).success) {
        const imageBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
        const imageBase64 = imageBuffer.toString('base64');
        const imageResult = await this.rpc('edit_image', {
          productId: data.id,
          buffer: imageBase64,
          mimetype: file.mimetype,
          originalname: file.originalname,
        });
        if (!imageResult || !(imageResult as any).success) {
          return { success: false, message: 'Failed to update image' };
        }
      }

      return response;
    } catch (error: string | any) {
      this.logger.error('[editOneProduct] Помилка:', error);
      return { success: false, message: error.message };
    }
  }

  async addOneProduct(data, file?: Express.Multer.File) {
    try {
      let attributes = data.attributes;
      if (typeof attributes === 'string') {
        try {
          attributes = JSON.parse(attributes);
        } catch {
          return { success: false, message: 'Некоректний формат attributes' };
        }
      }
      const price = typeof data.price === 'string' ? Number(data.price) : data.price;
      const discount = typeof data.discount === 'string' ? Number(data.discount) : data.discount;
      const payload = {
        name: data.name,
        description: data.description,
        price,
        discount,
        brand: data.brand || '',
        image: '',
        attributes,
      };

      const createResult = await this.rpc('add_product', payload);
      if (!createResult || !(createResult as any).success || !(createResult as any).data) {
        return { success: false, message: 'Не вдалося створити продукт' };
      }
      const productId = (createResult as any).data.id;
      let imageUrl = '';
      if (file) {
        const imageBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
        const imageBase64 = imageBuffer.toString('base64');
        const imageResult = await this.rpc('save_product_image', {
          buffer: imageBase64,
          mimetype: file.mimetype,
          originalname: file.originalname,
          productId,
        });
        const uploadedImageUrl = (imageResult as any)?.imageUrl ?? (imageResult as any)?.url;
        if (imageResult && (imageResult as any).success && uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
          await this.rpc('edit_product', { id: productId, image: imageUrl });
        } else {
          return { success: false, message: 'Не вдалося зберегти зображення' };
        }
      }
      return {
        success: true,
        message: 'Product added successfully',
        data: { ...(createResult as any).data, image: imageUrl },
      };
    } catch (error: string | any) {
      this.logger.error('[addOneProduct] Помилка:', error);
      return { success: false, message: error.message };
    }
  }

  async deleteProductById(id: string) {
    try {
      return await this.rpc('delete_product_by_id', { id });
    } catch (error) {
      this.logger.error('[deleteProductById] Помилка:', error);
      throw error;
    }
  }
}
