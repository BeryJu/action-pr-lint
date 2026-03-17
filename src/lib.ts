export function parseAllowedPrefixes(raw: string): string[] {
    return raw
        .split(/[\n,]+/)
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
}

export function isTitleAllowed(title: string, allowedPrefixes: string[]): boolean {
    return allowedPrefixes.some((prefix) => title.startsWith(prefix));
}
