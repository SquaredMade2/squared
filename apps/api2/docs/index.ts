import taskDocs from "./task";
import teamDocs from "./team";
import notificationDocs from "./notification";
import schemas from "./schemas";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...notificationDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
