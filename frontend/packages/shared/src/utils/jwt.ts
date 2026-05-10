import Cookies from "./cookies"
const cookies = new Cookies()

class JwtHandler {
    constructor(
        private isAdmin: boolean = false
    ) { }

    getToken(): string | null {
        const token = cookies.getCookie('token');
        if (!token) {
            return null
        }
        return token
    }

    decryptJwt(): Record<string, unknown> | null {
        try {
            const token = this.getToken();
            if (!token) {
                return null;
            }
            const base64Payload = token.split('.')?.[1];
            if (!base64Payload) {
                return null;
            }
            /** JWT використовує base64url без padding — без цього atob часто падає і профіль перекидав на /register */
            let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4 !== 0) {
                base64 += '=';
            }
            const binary = atob(base64);
            const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
            const payload = new TextDecoder('utf-8').decode(bytes);
            return JSON.parse(payload) as Record<string, unknown>;
        } catch {
            return null;
        }
    }

    getIsAdmin() {
        const parsedPayoad = this.decryptJwt();
        if (!parsedPayoad) {
            return null;
        }
        const roles = parsedPayoad.roles as string[] | undefined;
        if (!Array.isArray(roles)) {
            return null;
        }
        this.isAdmin = roles.some((role: string) => role === 'admin');

        return this.isAdmin;
    }
}

export default JwtHandler

