import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cl from '@/utils/styles/modules/ReviewsSection.module.scss';
import ReviewStats from './ReviewStats';
import ReviewAdd from './ReviewAdd';
import ReviewsList from './ReviewsList';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import type { ProductReviewStats, ProductReviewItem, ReviewsListResponse } from '@/types/reviews.types';

const ReviewsSection = () => {
  const { name } = useParams<{ name: string }>();
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);

  const { response: statsResponse, fetchData: fetchStats } = useFetch<null, ProductReviewStats>();
  const {
    response: listResponse,
    isLoading: listLoading,
    fetchData: fetchList,
  } = useFetch<null, ReviewsListResponse>();

  useEffect(() => {
    setPage(1);
    setReviews([]);
  }, [name]);

  useEffect(() => {
    if (!name) {
      return;
    }
    fetchStats({
      method: 'GET',
      url: `shop/product/${encodeURIComponent(name)}/reviews/stats`,
      port: 5000,
    });
  }, [name, fetchStats]);

  useEffect(() => {
    if (!name) {
      return;
    }
    fetchList({
      method: 'GET',
      url: `shop/product/${encodeURIComponent(name)}/reviews?page=${page}&limit=10`,
      port: 5000,
    });
  }, [name, page, fetchList]);

  useEffect(() => {
    if (!listResponse || typeof listResponse !== 'object') {
      return;
    }
    if ('error' in listResponse && (listResponse as { error?: string }).error) {
      return;
    }
    const res = listResponse as ReviewsListResponse;
    if (!Array.isArray(res.data)) {
      return;
    }
    const next = res.data;
    const resPage = res.meta?.page ?? 1;
    if (resPage <= 1) {
      setReviews(next);
    } else {
      setReviews((prev) => [...prev, ...next]);
    }
  }, [listResponse]);

  const stats =
    statsResponse && !('error' in statsResponse) && typeof (statsResponse as ProductReviewStats).totalReviews === 'number'
      ? (statsResponse as ProductReviewStats)
      : null;

  const listMeta = (listResponse && !('error' in listResponse) ? listResponse : null) as ReviewsListResponse | null;

  const refetchAfterCreate = useCallback(() => {
    if (!name) {
      return;
    }
    setPage(1);
    setReviews([]);
    fetchStats({
      method: 'GET',
      url: `shop/product/${encodeURIComponent(name)}/reviews/stats`,
      port: 5000,
    });
    fetchList({
      method: 'GET',
      url: `shop/product/${encodeURIComponent(name)}/reviews?page=1&limit=10`,
      port: 5000,
    });
  }, [name, fetchStats, fetchList]);

  return (
    <section className={cl.reviewsSection}>
      <h2 className={cl.sectionTitle}>Відгуки</h2>
      <div className={cl.reviewsLayout}>
        {stats && stats.totalReviews > 0 ? <ReviewStats stats={stats} /> : null}

        <ReviewAdd onCreated={refetchAfterCreate} />
      </div>

      <ReviewsList
        reviews={reviews}
        isLoading={listLoading}
        hasMore={Boolean(listMeta?.meta?.hasMore)}
        onLoadMore={() => setPage((p) => p + 1)}
      />
    </section>
  );
};

export default ReviewsSection;
