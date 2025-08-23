type cookiesType<T = object> = {
    name: string,
    data: string | number | T[],
    path?: string,
    maxAge?: number,
}

class Cookies {
    setCookies = (cookies?: cookiesType[]): void => {
        cookies?.forEach((cookie) => {
            this.setCookie(cookie)
        })
    }

    setCookie = (cookie: cookiesType): void => {
        const setParam = this.setUnnecesaryParam(cookie)
        document.cookie = `${setParam.name}=${setParam.data}; path=${setParam.path}; max-age=${setParam.maxAge}`
        console.log('cookie  ', JSON.stringify(document.cookie))
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

    getCookie = (name: string): string | null => {
        const cookies = document.cookie.split('; ')
        const found = cookies.find(row => row.startsWith(name + '='))
        return found ? decodeURIComponent(found.split('=')[1]) : null
    }
}

export default Cookies
