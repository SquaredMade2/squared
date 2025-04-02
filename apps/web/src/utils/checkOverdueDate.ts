export function checkOverdueDate(date: Date): boolean {
	return date && date < new Date();
}
