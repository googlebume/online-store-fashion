type cookiesType<T = object> = {
    data: string | number | T[],
    path?: string
    maxAge?: number
}

class Cookies {
    constructor() { }

    setCookies = (cookies?: cookiesType[]): void => {
        cookies.forEach((cookie) => {
            this.setCookie(cookie)
        })
    }

    setCookie = (cookie?: cookiesType): void => {
        const setParam = this.setUnnecesaryParam(cookie)
        document.cookie = `data=${setParam.data}; path=${setParam.path}; max-age=${setParam.maxAge};`

    }

    private setUnnecesaryParam = (cookie: cookiesType): cookiesType => {
        if (!cookie.path) {
            cookie.path = '/'
        }
        if (!cookie.maxAge) {
            cookie.maxAge = 3600 * 24
        }
        return cookie
    }
}




