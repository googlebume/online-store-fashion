import { JwtModuleOptions } from "@nestjs/jwt"

export const registerJwt = (options: JwtModuleOptions): JwtModuleOptions => {
    return {
        global: options.global,
        secret: process.env.SECRET ?? 'SECRET',
        signOptions: {
            expiresIn: options.signOptions?.expiresIn || '24h'
        }
    }
}

export const basePipline = {
    global: true,
    secret: process.env.SECRET,
    signOptions: {
        expiresIn: '24h'
    }
}