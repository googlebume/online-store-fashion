import hoodIcon from '../../assets/images/clothesIcons/hoodIcon.png'
import trousersIcon from '../../assets/images/clothesIcons/trousersIcon.png'
import tshirtIcon from '../../assets/images/clothesIcons/tshirtIcon.png'
import shirtIcon from '../../assets/images/clothesIcons/shirtIcon.png'
import sweatshirtIcon from '../../assets/images/clothesIcons/sweatshirtIcon.png'
import tagIcon from '@packages/shared/src/assets/images/icons/tagIcon.svg?url';

import { AsideSectionType } from '@packages/shared/src/utils/types/renderComponents.type'

export const catalogListItems: AsideSectionType = {
    title: 'clothes',
    links: [
        { href: "#", text: "Розпродаж", icon: tagIcon },
        { href: "#", text: "Футболки", icon: tshirtIcon },
        { href: "#", text: "Худі", icon: hoodIcon },
        { href: "#", text: "Світшоти", icon: sweatshirtIcon },
        { href: "#", text: "Штани", icon: trousersIcon },
        { href: "#", text: "Сорочки", icon: shirtIcon },
    ]
}