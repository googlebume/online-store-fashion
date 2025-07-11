import TagIcon from '@packages/shared/src/assets/images/icons/tagIcon.svg';
import MapPoint from '@packages/shared/src/assets/images/icons/mapPoint.svg';
import AboutIcon from '@packages/shared/src/assets/images/icons/fileDocument.svg';
import ContactIcon from '@packages/shared/src/assets/images/icons/smartphoneIcon.svg';
import variables from '@packages/shared/src/utils/styles/colorScheme'

export const headerMenuItems = [
  {
    title: "Знижки",
    link: "/sale",
    icon: <TagIcon height='24px' width='24px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>,
  },
  {
    title: "Магазини",
    link: "http://surl.li/tkidod",
    icon: <MapPoint height='24px' width='24px' color={`${variables.yellow}`}/>,
  },
  {
    title: "Покупцям",
    link: "/buyers",
    icon: <AboutIcon height='24px' width='24px' color={`${variables.yellow}`}/>,
  },
  {
    title: "Зв'язок",
    link: "/contact",
    icon: <ContactIcon height='24px' width='24px' color={`${variables.yellow}`}/>,
  },
];


