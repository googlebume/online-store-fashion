declare module '*.module.scss' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module "*.svg" {
    import React from "react";
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare const __PLATFORM__: 'mobile' | 'desktop';
declare const __ENV__: 'production' | 'development';

// declare module '*.module.scss' {
//     interface IClassNames {
//         [className: string]: string
//     }
//     const classNames: IClassNames;
//     export = classNames;
// }

// declare module '*.png' {
//     const src: string;
//     export default src;
// }

// declare module '*.jpg' {
//     const src: string;
//     export default src;
// }

// declare module '*.jpeg' {
//     const src: string;
//     export default src;
// }

// declare module "*.svg" {
//     import React from "react";
//     const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
//     export { ReactComponent };
//     export default ReactComponent;
// }

// declare const __PLATFORM__: 'mobile' | 'desktop';
// declare const __ENV__: 'production' | 'development';