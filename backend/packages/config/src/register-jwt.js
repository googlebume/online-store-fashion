"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePipline = exports.registerJwt = void 0;
const registerJwt = (options) => {
    return {
        global: options.global,
        secret: process.env.SECRET ?? 'SECRET',
        signOptions: {
            expiresIn: options.signOptions?.expiresIn || '24h'
        }
    };
};
exports.registerJwt = registerJwt;
exports.basePipline = {
    global: true,
    secret: process.env.SECRET,
    signOptions: {
        expiresIn: '24h'
    }
};
//# sourceMappingURL=register-jwt.js.map