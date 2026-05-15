import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import cl from './AdminProductDetail.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { getProductServiceBaseUrl, getProductImageUrl } from '@packages/shared/src/utils/api/productServiceUrl';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';
import { fetchAnalyticsDashboard } from '@packages/shared/src/services/analyticsDashboardApi';
import Cookies from '@packages/shared/src/utils/cookies';
import Button from '@packages/shared/src/components/UI/Button/Button';
import ActionsMenu from '@packages/shared/src/components/UI/ActionsMenu/ActionsMenu';
import PopupEditProduct from '@/components/PopupEditProduct';
import { adminProductsAction } from '@packages/shared/src/utils/constants/actionsMenu';
import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import type { ProductReviewStats, ProductReviewItem, ReviewsListResponse } from '@packages/shared/src/types/reviews.types';
import { api } from '@packages/shared/src/routes/api';

function formatRelativeTimeUk(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 0) return d.toLocaleDateString('uk-UA');
  if (days === 0) return 'сьогодні';
  if (days === 1) return 'вчора';
  if (days < 7) return `${days} дн. тому`;
  if (days < 30) return `${Math.floor(days / 7)} тиж. тому`;
  if (days < 365) return `${Math.floor(days / 30)} міс. тому`;
  return d.toLocaleDateString('uk-UA');
}

function renderStars(rating: number, styles: any) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`${styles.star} ${i < rating ? styles.filled : ''}`}>★</span>
  ));
}

const AdminProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [analyticsStats, setAnalyticsStats] = useState<{ views: number; clicks: number; orders: number } | null>(null);
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [deletedProduct, setDeletedProduct] = useState<ProductType | null>(null);

  const { response: productsResponse, fetchData: fetchProducts } = useFetch<null, ProductType[]>();
  const { response: statsResponse, fetchData: fetchStats } = useFetch<null, ProductReviewStats>();
  const { response: listResponse, isLoading: listLoading, fetchData: fetchList } = useFetch<null, ReviewsListResponse>();

  const loadProducts = useCallback(() => {
    fetchProducts({ method: 'GET', url: 'admin/products', port: 5004 });
  }, [fetchProducts]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!productsResponse || !productId) return;
    const found = (productsResponse as ProductType[]).find((p) => p.id === productId);
    setProduct(found ?? null);
  }, [productsResponse, productId]);

  useEffect(() => {
    if (!product) return;
    setPage(1);
    setReviews([]);
    const name = encodeURIComponent(product.name);
    fetchStats({ method: 'GET', url: `shop/product/${name}/reviews/stats`, baseUrl: getProductServiceBaseUrl() });
    fetchList({ method: 'GET', url: `shop/product/${name}/reviews?page=1&limit=10`, baseUrl: getProductServiceBaseUrl() });
    fetchAnalyticsDashboard().then((dash) => {
      const entry = dash.topProductsByViews.find((p) => p.productId === productId);
      if (entry) setAnalyticsStats({ views: entry.views, clicks: entry.clicks, orders: entry.orders });
    }).catch(() => {});
  }, [product]);

  useEffect(() => {
    if (!product || page === 1) return;
    const name = encodeURIComponent(product.name);
    fetchList({ method: 'GET', url: `shop/product/${name}/reviews?page=${page}&limit=10`, baseUrl: getProductServiceBaseUrl() });
  }, [page]);

  useEffect(() => {
    if (!listResponse || typeof listResponse !== 'object') return;
    const res = listResponse as ReviewsListResponse;
    if (!Array.isArray(res.data)) return;
    const resPage = res.meta?.page ?? 1;
    if (resPage <= 1) setReviews(res.data);
    else setReviews((prev) => [...prev, ...res.data]);
  }, [listResponse]);

  useEffect(() => {
    if (!deletedProduct) return;
    const cookies = new Cookies();
    fetch(`${backendOriginForPort(5004)}/fashion/admin/products/delete/${deletedProduct.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${cookies.getCookie('token')}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success === true) navigate(`/${api}/admin/products`);
      });
  }, [deletedProduct, navigate]);

  const stats =
    statsResponse && !('error' in statsResponse) && typeof (statsResponse as ProductReviewStats).totalReviews === 'number'
      ? (statsResponse as ProductReviewStats)
      : null;

  const listMeta = (listResponse && !('error' in listResponse) ? listResponse : null) as ReviewsListResponse | null;

  if (!product) {
    return <div className={cl.loading}>Завантаження…</div>;
  }

  const attr = Array.isArray((product as any).attributes) ? (product as any).attributes[0] : (product as any).attributes;

  return (
    <div className={cl.layout}>
      <div className={cl.topBar}>
        <Button
          variant="submit-secondary"
          type="button"
          text="Назад до товарів"
          onClick={() => navigate(-1)}
        />
        <ActionsMenu
          actionList={adminProductsAction(product, setSelectedProduct, setDeletedProduct)}
          ref={menuRef}
          data={product}
        />
      </div>

      <div className={cl.header}>
        <img className={cl.productImage} src={getProductImageUrl(product.image)} alt={product.name} />
        <div className={cl.productInfo}>
          <h1 className={cl.productName}>{product.name}</h1>
          <p className={cl.price}>{product.price} ₴</p>
          <div className={cl.productMeta}>
            {product.brand && <span>Бренд: {product.brand}</span>}
            {attr?.category && <span>Категорія: {attr.category}</span>}
            {attr?.type && <span>Тип: {attr.type}</span>}
            {attr?.color && <span>Колір: {attr.color}</span>}
            {product.discount ? <span>Знижка: {product.discount}%</span> : null}
          </div>
        </div>
      </div>

      {analyticsStats && (
        <div className={cl.statsRow}>
          <div className={cl.statCard}>
            <span className={cl.statLabel}>Перегляди</span>
            <span className={cl.statValue}>{analyticsStats.views}</span>
          </div>
          <div className={cl.statCard}>
            <span className={cl.statLabel}>Кліки</span>
            <span className={cl.statValue}>{analyticsStats.clicks}</span>
          </div>
          <div className={cl.statCard}>
            <span className={cl.statLabel}>Замовлення</span>
            <span className={cl.statValue}>{analyticsStats.orders}</span>
          </div>
        </div>
      )}

      <div className={cl.section}>
        <h2 className={cl.sectionTitle}>Відгуки</h2>

        {stats && stats.totalReviews > 0 && (
          <div className={cl.reviewStats}>
            <div className={cl.ratingSummary}>
              <div className={cl.averageRating}>{stats.averageRating.toFixed(1)}</div>
              <div className={cl.ratingDetails}>
                <div className={cl.ratingStars}>{renderStars(Math.round(stats.averageRating), cl)}</div>
                <div className={cl.ratingLabel}>Середня оцінка · {stats.totalReviews} відгуків</div>
              </div>
            </div>
            <div className={cl.ratingBars}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = (stats.distribution as any)[String(star)] ?? (stats.distribution as any)[star] ?? 0;
                const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
                return (
                  <div key={star} className={cl.ratingBar}>
                    <span>{star}</span>
                    <span className={cl.starIcon}>★</span>
                    <div className={cl.barContainer}>
                      <div className={cl.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={cl.reviewList}>
          {reviews.length === 0 && !listLoading && (
            <p className={cl.empty}>Відгуків ще немає.</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className={cl.reviewItem}>
              <div className={cl.reviewHeader}>
                <div className={cl.reviewStars}>{renderStars(r.stars, cl)}</div>
                <Link
                  to={`/${api}/admin/users/${r.userId}`}
                  className={cl.reviewerLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.userName}
                </Link>
                <span className={cl.reviewDate}>{formatRelativeTimeUk(r.createdAt)}</span>
              </div>
              <p className={cl.reviewText}>{r.text}</p>
            </div>
          ))}
        </div>

        {listMeta?.meta?.hasMore && (
          <Button
            variant="submit-secondary"
            type="button"
            text={listLoading ? 'Завантаження…' : 'Показати більше'}
            disabled={listLoading}
            onClick={() => setPage((p) => p + 1)}
            className={cl.loadMoreBtn}
          />
        )}
      </div>

      {selectedProduct && (
        <PopupEditProduct
          data={selectedProduct}
          popupRef={popupRef}
          type="edit"
          onSaved={loadProducts}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default AdminProductDetail;
