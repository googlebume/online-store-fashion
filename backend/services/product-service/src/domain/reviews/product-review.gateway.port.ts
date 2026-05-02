export const PRODUCT_REVIEW_GATEWAY = Symbol('IProductReviewGateway');

export type ReviewDto = {
  id: string;
  userId: string;
  userName: string;
  reviewTitle: string;
  text: string;
  stars: number;
  createdAt: string;
};

export type ReviewStatsDto = {
  totalReviews: number;
  averageRating: number;
  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
};

export interface ReviewsListMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IProductReviewGateway {
  listReviews(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ success: boolean; data?: ReviewDto[]; meta?: ReviewsListMeta; message?: string }>;

  createReview(payload: {
    userId: string;
    productId: string;
    reviewTitle: string;
    text: string;
    stars: number;
  }): Promise<{ success: boolean; data?: ReviewDto; message?: string }>;

  getStats(productId: string): Promise<{ success: boolean; data?: ReviewStatsDto; message?: string }>;
}
