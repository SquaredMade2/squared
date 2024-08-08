class AppError extends Error {
	message: string;
	status: string | number;
	constructor(message: string, status: string | number) {
		super();

		this.message = message;
		this.status = status;
	}
}

export default AppError;
