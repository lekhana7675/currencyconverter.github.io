/** YYYY-MM-DD in UTC, the format the rate API expects. */
export function toISODate(date) {
    return date.toISOString().slice(0, 10);
}
export function subtractDays(date, days) {
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() - days);
    return copy;
}
