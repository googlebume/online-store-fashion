import React, { useState, useCallback } from 'react';
import cl from '@/utils/styles/modules/ReviewAdd.module.scss';
import { useParams } from 'react-router-dom';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import JwtHandler from '@packages/shared/src/utils/jwt';

type Props = {
  onCreated: () => void;
};

const ReviewAdd: React.FC<Props> = ({ onCreated }) => {
  const { name: productName } = useParams<{ name: string }>();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { response, error, isLoading, fetchData } = useFetch<
    {
      userId: string;
      reviewTitle: string;
      text: string;
      stars: number;
    },
    Record<string, unknown>
  >();

  const userId = React.useMemo(() => {
    try {
      const jwt = new JwtHandler();
      if (!jwt.getToken()) {
        return undefined;
      }
      const tokenPayload = jwt.decryptJwt() as {
        id?: string;
        userId?: string;
        sub?: string;
      } | null;
      return tokenPayload?.id ?? tokenPayload?.userId ?? tokenPayload?.sub;
    } catch {
      return undefined;
    }
  }, []);

  const displayStars = hover || stars;

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(null);
      if (!userId) {
        return;
      }
      if (!productName) {
        setLocalError('Некоректна сторінка товару');
        return;
      }
      if (!text.trim()) {
        setLocalError('Напишіть текст відгуку');
        return;
      }
      if (stars < 1 || stars > 5) {
        setLocalError('Оберіть оцінку від 1 до 5 зірок');
        return;
      }

      fetchData({
        method: 'POST',
        port: 5000,
        url: `shop/product/${encodeURIComponent(productName)}/reviews`,
        body: {
          userId: String(userId),
          reviewTitle: 'Відгук',
          text: text.trim(),
          stars,
        },
      });
    },
    [userId, productName, text, stars, fetchData],
  );

  React.useEffect(() => {
    if (!response || 'error' in response) {
      return;
    }
    if (!(response as { id?: string }).id) {
      return;
    }
    setText('');
    setStars(0);
    setHover(0);
    onCreated();
  }, [response, onCreated]);

  const isGuest = !userId;

  return (
    <div className={isGuest ? cl.reviewAddOuterGuest : cl.reviewAddOuter}>
      <form className={`${cl.addReview} ${isGuest ? cl.addReviewGuest : ''}`} onSubmit={onSubmit}>
      <h3 className={cl.addReviewTitle}>Залишити відгук</h3>
      {isGuest && (
        <p className={cl.guestHint} role="status">
          Увійдіть у профіль, щоб надіслати відгук.
        </p>
      )}
      {(localError || error) && (
        <p className={cl.formError}>{localError || error?.message}</p>
      )}
      <div className={cl.ratingInput}>
        <label className={cl.ratingLabel}>Ваша оцінка</label>
        <div className={cl.ratingStarsInput} role="group" aria-label="Оцінка зірками">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={cl.starButton}
              aria-label={`${n} з ${5} зірок`}
              aria-pressed={stars === n}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setStars(n)}
            >
              <span className={`${cl.starSymbol} ${n <= displayStars ? cl.starSymbolFilled : ''}`}>★</span>
            </button>
          ))}
        </div>
      </div>
      <div className={cl.reviewInput}>
        <label className={cl.inputLabel}>Відгук</label>
        <textarea
          className={cl.textareaInput}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
        />
      </div>
      <input
        type="submit"
        className={cl.submitButton}
        value={isLoading ? 'Надсилання…' : 'Надіслати'}
        disabled={isLoading || isGuest}
        title={isGuest ? 'Спочатку увійдіть у профіль' : undefined}
      />
    </form>
    </div>
  );
};

export default ReviewAdd;
