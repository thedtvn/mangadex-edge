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
    return {
        ...originalConfig,
        public: {
            ...originalConfig?.public,
            environmentType: "stable",
            apiUrl: url.origin + "/api",
            baseUrl: url.origin,
            cdnEdge: url.origin,
            cdnOrigin: url.origin + "/uploads",
            embedUrl: "https://e-embed.mangadex.org",
            kcUrl: url.origin + "/keycloak",
            kcClientId: "mangadex-frontend-stable",
            forumsUrl: "https://forums.mangadex.org",
            paymentsUrl: "https://payment.mangadex.org",
            gtmId: "",
            recaptchaSiteKey: "6LflOrIaAAAAACcpRSiKQlt_X6bq-QcVjHTG1diJ",
            stripeManageUrl: "https://billing.stripe.com/p/login/14A4gz6uFeba8Z77u68so00"
        },
        app: {
            ...originalConfig?.app,
            buildId: originalConfig?.app?.buildId ?? "",
            baseURL: "/",
            buildAssetsDir: "/_nuxt/",
            cdnURL: "",
        }
    };
}
