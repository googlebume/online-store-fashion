import tagIcon from '@packages/shared/src/assets/images/icons/tagIcon.svg?url';
import mapPoint from '@packages/shared/src/assets/images/icons/mapPoint.svg?url';
import aboutIcon from '@packages/shared/src/assets/images/icons/fileDocument.svg?url';
import contactIcon from '@packages/shared/src/assets/images/icons/smartphoneIcon.svg?url';

export const headerMenuItems = [
  {
    title: "Знижки",
    link: "/sale",
    icon: tagIcon,
  },
  {
    title: "Магазини",
    link: "http://surl.li/tkidod",
    icon: mapPoint,
  },
  {
    title: "Покупцям",
    link: "/buyers",
    icon: aboutIcon,
  },
  {
    title: "Зв'язок",
    link: "/contact",
    icon: contactIcon,
  },
];


