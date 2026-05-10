export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
    name: { type: 'string', example: 'Olena' },
    email: { type: 'string', example: 'user@example.com' },
    role: {
      oneOf: [
        { type: 'string', example: 'user' },
        { type: 'array', items: { type: 'string' }, example: ['admin'] },
      ],
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const authFlowSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    flowId: { type: 'string', example: 'register-flow-123' },
    expiresIn: { type: 'number', example: 300 },
    message: { type: 'string', example: 'OTP code sent' },
  },
};

export const authSuccessSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Registration successful' },
    userData: userSchema,
    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  },
};

export const profileResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    userData: userSchema,
  },
};

export const googleClientIdSchema = {
  type: 'object',
  properties: {
    clientId: {
      type: 'string',
      example: '1234567890-abc.apps.googleusercontent.com',
      nullable: true,
    },
  },
};

export const googleAuthResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    isNewUser: { type: 'boolean', example: true },
    user: userSchema,
    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  },
};

export const verifyTimerSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        remaining: { type: 'number', example: 297 },
      },
    },
  },
};

export const productAttributeSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'attr-1' },
    productsId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
    type: { type: 'string', example: 'hoodie' },
    category: { type: 'string', example: 'male' },
    color: { type: 'string', example: 'black' },
    size: { type: 'string', example: 'M', nullable: true },
    material: { type: 'string', example: 'cotton', nullable: true },
    countryOfOrigin: { type: 'string', example: 'Ukraine', nullable: true },
    weight: { type: 'number', example: 0.5, nullable: true },
  },
};

export const productSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
    name: { type: 'string', example: 'Classic Hoodie' },
    description: { type: 'string', example: 'Warm cotton hoodie' },
    price: { type: 'number', example: 1999 },
    discount: { type: 'number', example: 10 },
    brand: { type: 'string', example: 'Fashion Brand' },
    image: { type: 'string', example: 'http://localhost:5000/products/hoodie_1_1.webp' },
    attributes: { type: 'array', items: productAttributeSchema },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const productArraySchema = {
  type: 'array',
  items: productSchema,
};

export const dynamicCatalogSchema = {
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 120 },
        page: { type: 'number', example: 0 },
        limit: { type: 'number', example: 12 },
        hasMore: { type: 'boolean', example: true },
      },
    },
    loaded: productArraySchema,
  },
};

export const reviewSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'review-1' },
    userId: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
    userName: { type: 'string', example: 'Olena' },
    reviewTitle: { type: 'string', example: 'Very comfortable hoodie' },
    text: { type: 'string', example: 'Fabric feels premium and the size matches expectations.' },
    stars: { type: 'number', example: 5 },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

export const reviewListSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: reviewSchema,
    },
    meta: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 24 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        hasMore: { type: 'boolean', example: true },
      },
    },
  },
};

export const reviewStatsSchema = {
  type: 'object',
  properties: {
    totalReviews: { type: 'number', example: 24 },
    averageRating: { type: 'number', example: 4.6 },
    distribution: {
      type: 'object',
      properties: {
        '1': { type: 'number', example: 0 },
        '2': { type: 'number', example: 1 },
        '3': { type: 'number', example: 2 },
        '4': { type: 'number', example: 6 },
        '5': { type: 'number', example: 15 },
      },
    },
  },
};

export const orderItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'item-1' },
    orderId: { type: 'string', example: 'order-1' },
    productId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
    quantity: { type: 'number', example: 2 },
    originalPrice: { type: 'number', example: 1999 },
    discountAmount: { type: 'number', example: 200 },
    price: { type: 'number', example: 1799 },
  },
};

export const orderSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'order-1' },
    userId: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001', nullable: true },
    status: { type: 'string', example: 'pending' },
    deliveryMethod: { type: 'string', example: 'courier' },
    address: { type: 'string', example: 'Kyiv, Khreshchatyk 1' },
    email: { type: 'string', example: 'buyer@example.com' },
    subtotal: { type: 'number', example: 3198 },
    promoDiscountTotal: { type: 'number', example: 320 },
    total: { type: 'number', example: 2878 },
    promoCodeId: { type: 'string', nullable: true, example: 'promo-1' },
    promoCode: { type: 'string', nullable: true, example: 'SPRING10' },
    items: { type: 'array', items: orderItemSchema },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const promoCodeSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'promo-1' },
    code: { type: 'string', example: 'SPRING10' },
    discountType: { type: 'string', example: 'percentage' },
    discountValue: { type: 'number', example: 10 },
    usageLimit: { type: 'number', nullable: true, example: 100 },
    usedCount: { type: 'number', example: 12 },
    isActive: { type: 'boolean', example: true },
    isInfinite: { type: 'boolean', example: false },
    expiresAt: { type: 'string', format: 'date-time', nullable: true },
    applicableProductTypes: { type: 'array', items: { type: 'string' } },
    minProductPrice: { type: 'number', nullable: true, example: 1000 },
    maxProductPrice: { type: 'number', nullable: true, example: 5000 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const promoPricingSchema = {
  type: 'object',
  properties: {
    subtotal: { type: 'number', example: 3198 },
    promoDiscountTotal: { type: 'number', example: 320 },
    total: { type: 'number', example: 2878 },
    promoCodeId: { type: 'string', nullable: true, example: 'promo-1' },
    promoCode: { type: 'string', nullable: true, example: 'SPRING10' },
  },
};

export const successMessageSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Operation completed successfully' },
  },
};

export const analyticsIngestSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    stored: { type: 'number', example: 2 },
    errors: { type: 'array', items: { type: 'string' }, example: [] },
  },
};

export const analyticsDashboardSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'object',
      properties: {
        totals: {
          type: 'object',
          properties: {
            allTime: { type: 'number', example: 1200 },
            last24h: { type: 'number', example: 95 },
            uniqueSessions: { type: 'number', example: 410 },
          },
        },
        eventsByName: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'page_view' },
              count: { type: 'number', example: 320 },
            },
          },
        },
        last7Days: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', example: '2026-05-10' },
              count: { type: 'number', example: 40 },
            },
          },
        },
        recentEvents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'event-1' },
              name: { type: 'string', example: 'view_item' },
              path: { type: 'string', nullable: true, example: '/shop/hoodie_1' },
              sessionId: { type: 'string', nullable: true, example: 'session-123' },
              userId: { type: 'string', nullable: true, example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
              productId: { type: 'string', nullable: true, example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
              durationMs: { type: 'number', nullable: true, example: 1450 },
              payload: { type: 'object', additionalProperties: true, nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        topProductsByViews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
              views: { type: 'number', example: 120 },
              clicks: { type: 'number', example: 48 },
              orders: { type: 'number', example: 9 },
              productName: { type: 'string', nullable: true, example: 'Classic Hoodie' },
              image: { type: 'string', nullable: true, example: 'http://localhost:5000/products/hoodie_1_1.webp' },
            },
          },
        },
      },
    },
  },
};

export const promoRedemptionsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          promoCode: { type: 'string', example: 'SPRING10' },
          orders: { type: 'number', example: 23 },
          distinctUsers: { type: 'number', example: 17 },
        },
      },
    },
  },
};
