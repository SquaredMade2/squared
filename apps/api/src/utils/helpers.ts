export const expirationTimeFormat = (expiration: string) {
    const msInHour = 3600000;
    let expirationInMs: number;

    switch (expiration) {
        case "30m":
            expirationInMs = msInHour/2;
            break;
        case "1h":
            expirationInMs = msInHour;
            break;
        case "6h":
            expirationInMs = msInHour*6;
            break;
        case "12h":
            expirationInMs = msInHour*12;
            break;
        case "1d":
            expirationInMs = msInHour*24;
            break;
        case "7d":
            expirationInMs = (msInHour*24)*7;
            break;
        default:
            expirationInMs = 1
            break;
    }

    return Date.now() + expirationInMs

}