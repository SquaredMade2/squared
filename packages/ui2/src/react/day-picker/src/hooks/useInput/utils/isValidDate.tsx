/** @private */
export function isValidDate(day: Date): boolean {
	return !Number.isNaN(day.getTime());
}
