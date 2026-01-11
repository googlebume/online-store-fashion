// Core exports
export * from './core';

// Repository exports
export { UserRepository, type ICreateUserInput, type IUpdateUserInput } from './user.repository';
export {
  ProductRepository,
  type IProductWithAttributes,
  type ICreateProductInput,
  type IUpdateProductInput,
} from './product.repository';
export {
  OrderBaseHandler,
  type IOrderItem,
  type ICreateOrderInput,
  type IUpdateOrderInput,
} from './order/order-base.repository';
export {
  ProductsAnalyticsRepository,
  type IEngagementMetrics,
  type IRatingMetrics,
  type ICreateAnalyticsInput,
  type IUpdateAnalyticsInput,
} from './products-analytics/baseProductsAnalytics.handler';
