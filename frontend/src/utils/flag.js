export const getFlagImage = (countryCode) => {
    if (!countryCode) return null;
    try {
        return new URL(`/src/utils/flags/${countryCode.toLowerCase()}.png`, import.meta.url).href;
    } catch (error) {
        console.warn(`Flag image not found for country code: ${countryCode}`, error);
        return null;
    }
};

export const getFlagEmoji = (countryCode) => {
    if (!countryCode) return null;
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};
