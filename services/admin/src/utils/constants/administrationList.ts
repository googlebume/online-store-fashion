import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type'

import analyticsIcon from '../../../../../packages/shared/src/assets/images/icons/analyticsIcon.svg' //'@packages/shared/src/assets/icons/file-document.png'
import tag from '../../../../../packages/shared/src/assets/images/icons/tagIcon.svg'
import userIcon from '../../../../../packages/shared/src/assets/images/icons/userIcon.png'

export const administrationListItems: AsideSectionType = {
    title: 'administration',
    links: [
        { href: "#", text: "Користувачі", icon: userIcon },
        { href: "#", text: "Товари", icon: tag },
        { href: "#", text: "Аналітика", icon: analyticsIcon },
    ]
}