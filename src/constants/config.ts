
export function getCustomConfig(url: URL, originalConfig: any) {
    originalConfig.public.apiUrl = url.origin + "/api";
    originalConfig.public.baseUrl = url.origin;
    originalConfig.public.cdnEdge = url.origin;
    originalConfig.public.cdnOrigin = url.origin + "/uploads";
    originalConfig.public.kcUrl = url.origin + "/keycloak";    
    
    return originalConfig;
}
