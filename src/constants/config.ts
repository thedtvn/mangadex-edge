export interface NuxtConfig {
    public?: {
        environmentType?: string;
        version?: string;
        apiUrl?: string;
        baseUrl?: string;
        cdnEdge?: string;
        cdnOrigin?: string;
        embedUrl?: string;
        kcUrl?: string;
        kcClientId?: string;
        forumsUrl?: string;
        paymentsUrl?: string;
        subscription?: Record<string, string>;
        gtmId?: string;
        popularTitlesDeltaDays?: string;
        recaptchaSiteKey?: string;
        siteUpdatesCheckIntervalSeconds?: number;
        stripeManageUrl?: string;
        [key: string]: unknown;
    };
    app?: {
        baseURL?: string;
        buildId?: string;
        buildAssetsDir?: string;
        cdnURL?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export function getCustomConfig(url: URL, originalConfig?: NuxtConfig | null): NuxtConfig {
    const config: NuxtConfig = originalConfig ? structuredClone(originalConfig) : {};
    config.public.apiUrl = url.origin + "/api";
    config.public.baseUrl = url.origin;
    config.public.cdnEdge = url.origin;
    config.public.cdnOrigin = url.origin + "/uploads";
    config.public.kcUrl = url.origin + "/keycloak";    
    
    return config;
}
