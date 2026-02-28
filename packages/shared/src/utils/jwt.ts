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

    decryptJwt() {
        try {
            const token = this.getToken();
            if (token) {
                const base64Payload = token.split('.')?.[1];
                const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
                const parsedPayoad = JSON.parse(payload);
                return parsedPayoad
            }
            return null;

        } catch (error) {
            throw new Error(error)
        }
    }

    getIsAdmin() {
        const parsedPayoad = this.decryptJwt()
        if (!parsedPayoad) {
            return null;
        }
        this.isAdmin = parsedPayoad.roles.some((role: string) => role === 'admin')

        return this.isAdmin
    }
}

export default JwtHandler

