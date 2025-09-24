import { JwtModuleOptions } from "@nestjs/jwt";
export declare const registerJwt: (options: JwtModuleOptions) => JwtModuleOptions;
export declare const basePipline: {
    global: boolean;
    secret: string | undefined;
    signOptions: {
        expiresIn: string;
    };
};
