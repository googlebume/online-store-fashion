import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serializers } from '../shared/serializers';
import { CreateProductHandler } from '../../application/product/handlers/create-product.handler';
import { UpdateProductHandler } from '../../application/product/handlers/update-product.handler';
import { DeleteProductHandler } from '../../application/product/handlers/delete-product.handler';
import { SaveProductImageHandler } from '../../application/product/handlers/save-product-image.handler';
import { UpdateProductImageHandler } from '../../application/product/handlers/update-product-image.handler';
import { GetAllProductsHandler } from '../../application/product/handlers/get-all-products.handler';
import { GetProductByIdHandler } from '../../application/product/handlers/get-product-by-id.handler';
import { GetProductByNameHandler } from '../../application/product/handlers/get-product-by-name.handler';
import { GetPaginatedProductsHandler } from '../../application/product/handlers/get-paginated-products.handler';
import { SearchProductsHandler } from '../../application/product/handlers/search-products.handler';
import { GetProductCountHandler } from '../../application/product/handlers/get-product-count.handler';
import { CreateProductCommand } from '../../application/product/commands/create-product.command';
import { UpdateProductCommand } from '../../application/product/commands/update-product.command';
import { DeleteProductCommand } from '../../application/product/commands/delete-product.command';
import { SaveProductImageCommand } from '../../application/product/commands/save-product-image.command';
import { UpdateProductImageCommand } from '../../application/product/commands/update-product-image.command';
import { GetAllProductsQuery } from '../../application/product/queries/get-all-products.query';
import { GetProductByIdQuery } from '../../application/product/queries/get-product-by-id.query';
import { GetProductByNameQuery } from '../../application/product/queries/get-product-by-name.query';
import { GetPaginatedProductsQuery } from '../../application/product/queries/get-paginated-products.query';
import { SearchProductsQuery } from '../../application/product/queries/search-products.query';
import { GetProductCountQuery } from '../../application/product/queries/get-product-count.query';

@Controller()
export class ProductController {
  constructor(
    private readonly createProductHandler: CreateProductHandler,
    private readonly updateProductHandler: UpdateProductHandler,
    private readonly deleteProductHandler: DeleteProductHandler,
    private readonly saveProductImageHandler: SaveProductImageHandler,
    private readonly updateProductImageHandler: UpdateProductImageHandler,
    private readonly getAllProductsHandler: GetAllProductsHandler,
    private readonly getProductByIdHandler: GetProductByIdHandler,
    private readonly getProductByNameHandler: GetProductByNameHandler,
    private readonly getPaginatedProductsHandler: GetPaginatedProductsHandler,
    private readonly searchProductsHandler: SearchProductsHandler,
    private readonly getProductCountHandler: GetProductCountHandler,
  ) {}

  @MessagePattern('get_products')
  async getProducts() {
    const result = await this.getAllProductsHandler.execute(new GetAllProductsQuery(false));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(p => Serializers.productToObject(p)) };
  }

  @MessagePattern('get_products_dynamically')
  async getProductsDynamically(@Payload() data: { take: number; page: number; cursor?: string }) {
    const result = await this.getPaginatedProductsHandler.execute(
      new GetPaginatedProductsQuery(data.take, data.page, data.cursor),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.data.map(p => Serializers.productToObject(p)) };
  }

  @MessagePattern('get_product_by_id')
  async getProductById(@Payload() data: { id: string }) {
    const result = await this.getProductByIdHandler.execute(new GetProductByIdQuery(data.id, true));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: Serializers.productToObject(result.value) };
  }

  @MessagePattern('get_product_by_name')
  async getProductByName(@Payload() data: { name: string }) {
    const result = await this.getProductByNameHandler.execute(new GetProductByNameQuery(data.name));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(p => Serializers.productToObject(p)) };
  }

  @MessagePattern('add_product')
  async addProduct(@Payload() data: any) {
    const result = await this.createProductHandler.execute(
      new CreateProductCommand(
        data.name,
        data.description,
        data.price,
        data.brand,
        data.discount,
        data.image,
        data.attributes,
      ),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Product created successfully', data: result.value };
  }

  @MessagePattern('edit_product')
  async editProduct(@Payload() data: any) {
    const { id, ...updateData } = data;
    const result = await this.updateProductHandler.execute(
      new UpdateProductCommand(
        id,
        updateData.name,
        updateData.description,
        updateData.price,
        updateData.brand,
        updateData.discount,
        updateData.image,
        updateData.attributes,
      ),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Product updated successfully', data: result.value };
  }

  @MessagePattern('delete_product_by_id')
  async deleteProduct(@Payload() data: { id: string }) {
    const result = await this.deleteProductHandler.execute(new DeleteProductCommand(data.id));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Product deleted successfully' };
  }

  @MessagePattern('save_product_image')
  async saveProductImage(@Payload() data: any) {
    const result = await this.saveProductImageHandler.execute(
      new SaveProductImageCommand(data.productId, data.file),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, url: result.value };
  }

  @MessagePattern('edit_image')
  async updateProductImage(@Payload() data: any) {
    const result = await this.updateProductImageHandler.execute(
      new UpdateProductImageCommand(data.productId, data.file),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, url: result.value };
  }

  @MessagePattern('search_products')
  async searchProducts(@Payload() data: { filter: Record<string, any>; options?: any }) {
    const result = await this.searchProductsHandler.execute(new SearchProductsQuery(data.filter, data.options));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(p => Serializers.productToObject(p)) };
  }

  @MessagePattern('get_product_count')
  async getProductCount(@Payload() data: { filter?: Record<string, any> }) {
    const result = await this.getProductCountHandler.execute(new GetProductCountQuery(data.filter));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value };
  }
}
