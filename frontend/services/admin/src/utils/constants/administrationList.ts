import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type';
import { adminRoutes } from '@packages/shared/src/routes/admin';

import analyticsIcon from '../../../../../packages/shared/src/assets/images/icons/analyticsIcon.svg?url';
import tag from '../../../../../packages/shared/src/assets/images/icons/tagIcon.svg?url';
import userIcon from '../../../../../packages/shared/src/assets/images/icons/userIcon.png';
import shoppingCardIcon from '../../../../../packages/shared/src/assets/images/icons/shoppingCardIcon.svg?url';

export const administrationListItems: AsideSectionType = {
  title: 'administration',
  links: [
    { href: adminRoutes.users, text: 'Користувачі', icon: userIcon },
    { href: adminRoutes.products, text: 'Товари', icon: tag },
    { href: adminRoutes.orders, text: 'Замовлення', icon: shoppingCardIcon },
    { href: adminRoutes.analytics, text: 'Аналітика', icon: analyticsIcon },
  ],
};
