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
    
    if (!config.public) config.public = {};
    config.public.environmentType = "stable";
    config.public.apiUrl = url.origin + "/api";
    config.public.baseUrl = url.origin;
    config.public.cdnEdge = url.origin;
    config.public.cdnOrigin = url.origin + "/uploads";
    config.public.embedUrl = "https://e-embed.mangadex.org";
    config.public.kcUrl = url.origin + "/keycloak";
    config.public.kcClientId = "mangadex-frontend-stable";
    config.public.forumsUrl = "https://forums.mangadex.org";
    config.public.paymentsUrl = "https://payment.mangadex.org";
    config.public.gtmId = "";
    config.public.recaptchaSiteKey = "6LflOrIaAAAAACcpRSiKQlt_X6bq-QcVjHTG1diJ";
    config.public.stripeManageUrl = "https://billing.stripe.com/p/login/14A4gz6uFeba8Z77u68so00";
    
    if (!config.app) config.app = {};
    config.app.baseURL = "/";
    config.app.buildAssetsDir = "/_nuxt/";
    config.app.cdnURL = "";
    
    return config;
}
