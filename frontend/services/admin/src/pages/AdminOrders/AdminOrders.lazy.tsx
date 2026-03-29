import React from 'react';

export const LazyAdminOrders = React.lazy(async () => await import('./AdminOrders'));
