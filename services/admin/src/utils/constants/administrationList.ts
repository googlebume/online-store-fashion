import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type'

import analyticsIcon from '../../../../../packages/shared/src/assets/images/icons/analyticsIcon.svg?url' //'@packages/shared/src/assets/icons/file-document.png'
import tag from '../../../../../packages/shared/src/assets/images/icons/tagIcon.svg?url'
import userIcon from '../../../../../packages/shared/src/assets/images/icons/userIcon.png'

export const administrationListItems: AsideSectionType = {
    title: 'administration',
    links: [
        { href: "users", text: "Користувачі", icon: userIcon },
        { href: "products", text: "Товари", icon: tag },
        { href: "anal", text: "Аналітика", icon: analyticsIcon },
    ]
}