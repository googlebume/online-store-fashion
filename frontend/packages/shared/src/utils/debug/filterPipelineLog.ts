/**
 * Діагностика ланцюга фільтрації каталогу (FiltersStickyBar → Redux → ProductShopList).
 *
 * Увімкнути в консолі: localStorage.setItem('FILTER_PIPELINE_DEBUG', '1')
 * Вимкнути: localStorage.setItem('FILTER_PIPELINE_DEBUG', '0') або removeItem
 * За замовчуванням у dev-білді лог увімкнено, якщо не встановлено '0'.
 */

export function isFilterPipelineDebug(): boolean {
    if (typeof window !== "undefined") {
        try {
            const v = window.localStorage?.getItem("FILTER_PIPELINE_DEBUG");
            if (v === "0") return false;
            if (v === "1") return true;
        } catch {
            /* ignore */
        }
    }
    return process.env.NODE_ENV !== "production";
}

/** Однакове зчитування атрибутів, як у фільтрах (масив з API або один об'єкт). */
export function pickProductAttr(item: {
    attributes?: unknown;
}): Record<string, unknown> | null {
    const a = item.attributes;
    if (a == null) return null;
    if (Array.isArray(a)) {
        const first = a[0];
        if (first != null && typeof first === "object") return first as Record<string, unknown>;
        return null;
    }
    if (typeof a === "object") return a as Record<string, unknown>;
    return null;
}

export function logFilterPipeline(tag: string, payload: Record<string, unknown>): void {
    if (!isFilterPipelineDebug()) return;
    // eslint-disable-next-line no-console
    console.info(`[filter-pipeline] ${tag}`, payload);
}
