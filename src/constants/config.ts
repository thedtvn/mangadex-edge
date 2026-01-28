export function getCustomConfig(url: URL) {
    return {
        public: {
            environmentType: "stable",
            version: "git-20260117-1312-9f772127",
            apiUrl: url.origin + "/api",
            baseUrl: url.origin,
            cdnEdge: url.origin,
            cdnOrigin: url.origin + "/uploads",
            embedUrl: "https://e-embed.mangadex.org",
            kcUrl: url.origin + "/keycloak",
            kcClientId: "mangadex-frontend-stable",
            forumsUrl: "https://forums.mangadex.org",
            paymentsUrl: "https://payment.mangadex.org",
            subscription: {
                organizationId: "XiXPVXKm",
                tierT1Id: "ikMUb3xM",
                tierT2Id: "Z3KR42gq",
                tierT3Id: "eFT9F7qn"
            },
            gtmId: "",
            popularTitlesDeltaDays: "30",
            recaptchaSiteKey: "6LflOrIaAAAAACcpRSiKQlt_X6bq-QcVjHTG1diJ",
            siteUpdatesCheckIntervalSeconds: 3600,
            stripeManageUrl: "https://billing.stripe.com/p/login/14A4gz6uFeba8Z77u68so00"
        },
        app: {
            baseURL: "/",
            buildId: "5bbd8219-957e-4baf-be8a-9ba2a68209be",
            buildAssetsDir: "/_nuxt/",
            cdnURL: "",
        }
    };
}
