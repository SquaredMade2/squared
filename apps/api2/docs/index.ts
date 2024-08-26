import taskDocs from "./task";
import teamDocs from "./team";
import activityDocs from "./activity";
import schemas from "./schemas";
import notificationDocs from "./notification";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...activityDocs,
		...notificationDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
