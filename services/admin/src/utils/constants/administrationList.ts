import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type'

import {adminRoutes} from '@packages/shared/src/routes/admin'

import analyticsIcon from '../../../../../packages/shared/src/assets/images/icons/analyticsIcon.svg?url' //'@packages/shared/src/assets/icons/file-document.png'
import tag from '../../../../../packages/shared/src/assets/images/icons/tagIcon.svg?url'
import userIcon from '../../../../../packages/shared/src/assets/images/icons/userIcon.png'

export const administrationListItems: AsideSectionType = {
    title: 'administration',
    links: [
        { href: adminRoutes.users, text: "Користувачі", icon: userIcon },
        { href: adminRoutes.products, text: "Товари", icon: tag },
        { href: adminRoutes.analytics, text: "Аналітика", icon: analyticsIcon },
    ]
}

