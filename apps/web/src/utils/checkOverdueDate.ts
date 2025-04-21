export function checkOverdueDate(date: Date | null): boolean {
	if (!date) return false;
	const currentDate = new Date();
	//use Number.isNaN() instead of isNaN() due to latter being type unsafe
	return !Number.isNaN(date.getTime()) && date < currentDate;
}
