export function checkOverdueDate(date: Date | null | undefined): boolean {
	if (!date) {
		return false;
	}
	return date && date < new Date();
}
