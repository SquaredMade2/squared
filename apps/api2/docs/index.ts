import taskDocs from "./task";
import teamDocs from "./team";
import activityDocs from "./activity";
import notificationDocs from "./notification";
import commentDocs from "./comment";
import schemas from "./schemas";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...activityDocs,
		...notificationDocs,
		...commentDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
