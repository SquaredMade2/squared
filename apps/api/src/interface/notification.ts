import { Types } from 'mongoose';

interface INotification {
	user: Types.ObjectId;
	task: Types.ObjectId;
	read: Boolean;
	description: String;
}

export default INotification;
