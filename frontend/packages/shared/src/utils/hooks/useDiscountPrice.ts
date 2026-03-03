import { useMemo } from 'react';

type UseDiscountPriceProps = {
  price: number;
  discount: number;
};

type UseDiscountPriceReturn = {
  finalPrice: number;
  discountAmount: number;
  discountPercent: number;
};

export const useDiscountPrice = ({ price, discount }: UseDiscountPriceProps): UseDiscountPriceReturn => {
  const { finalPrice, discountAmount } = useMemo(() => {
    const discountAmount = (discount * price) / 100;
    const finalPrice = Math.round(price - discountAmount);

    return { finalPrice, discountAmount };
  }, [price, discount]);

  return {
    finalPrice,
    discountAmount,
    discountPercent: discount,
  };
};

