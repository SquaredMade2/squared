import taskDocs from "./task";
import teamDocs from "./team";
import notificationDocs from "./notification";
import commentDocs from "./comment";
import schemas from "./schemas";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...notificationDocs,
		...commentDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
