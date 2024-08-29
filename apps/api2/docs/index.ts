import taskDocs from "./task";
import teamDocs from "./team";
import userDocs from "./user";
import activityDocs from "./activity";
import notificationDocs from "./notification";
import commentDocs from "./comment";
import workspaceDocs from "./workspace";
import schemas from "./schemas";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...userDocs,
		...activityDocs,
		...notificationDocs,
		...commentDocs,
		...workspaceDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
