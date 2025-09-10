import { JwtModuleOptions } from "@nestjs/jwt"

const registerJwt = (options: JwtModuleOptions): JwtModuleOptions => {
    return {
        global: options.global,
        secret: process.env.SECRET ?? 'SECRET',
        signOptions: {
            expiresIn: options.signOptions?.expiresIn || '24h'
        }
    }
}

export default registerJwt