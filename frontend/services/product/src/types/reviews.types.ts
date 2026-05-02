export type ProductReviewStats = {
  totalReviews: number;
  averageRating: number;
  distribution: Record<string, number>;
};

export type ProductReviewItem = {
  id: string;
  userId: string;
  userName: string;
  reviewTitle: string;
  text: string;
  stars: number;
  createdAt: string;
};

export type ReviewsListResponse = {
  data: ProductReviewItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore?: boolean;
  };
};
