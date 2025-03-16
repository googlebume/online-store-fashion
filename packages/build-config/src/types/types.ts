export interface BuildPaths {
    entry: string;
    html: string;
    public: string;
    output: string;
    src: string;
}

export type BuildMode = 'production' | 'development';
export type BuildPlatform = 'mobile' | 'desktop';

export interface BuildOptions {
    port: number;
    paths: BuildPaths;
    mode: BuildMode;
    platform: BuildPlatform;
    analyzer?: boolean;
}

declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.png' {
    const value: string;
    export default value;
}
declare module '*.jpg' {
    const value: string;
    export default value;
}
declare module '*.jpeg' {
    const value: string;
    export default value;
}
declare module '*.gif' {
    const value: string;
    export default value;
}
declare module '*.svg' {
    const value: string;
    export default value;
}