/** Summarises a date-ordered series. Returns null for an empty series. */
export function summarizeRates(points) {
    if (points.length === 0)
        return null;
    const first = points[0];
    const last = points[points.length - 1];
    let high = first;
    let low = first;
    let sum = 0;
    for (const point of points) {
        if (point.value > high.value)
            high = point;
        if (point.value < low.value)
            low = point;
        sum += point.value;
    }
    const change = last.value - first.value;
    return {
        first,
        last,
        high,
        low,
        average: sum / points.length,
        change,
        changePercent: first.value === 0 ? 0 : (change / first.value) * 100,
    };
}
