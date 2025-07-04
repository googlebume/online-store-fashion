import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type'

import fileDocument from '../../../../../packages/shared/src/assets/images/icons/analytics.png' //'@packages/shared/src/assets/icons/file-document.png'
import tag from '../../../../../packages/shared/src/assets/images/icons/tag.png'
import userIcon from '../../../../../packages/shared/src/assets/images/icons/userIcon.png'

export const administrationListItems: AsideSectionType = {
    title: 'administration',
    links: [
        { href: "#", text: "Користувачі", icon: userIcon },
        { href: "#", text: "Товари", icon: tag },
        { href: "#", text: "Аналітика", icon: fileDocument },
    ]
}