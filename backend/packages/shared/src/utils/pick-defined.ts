function pickDefined<T extends Record<string, any>>(
    obj: T
): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined)
    )
}

export default pickDefined