import taskDocs from "./task";
import teamDocs from "./team";
import activityDocs from "./activity";
import notificationDocs from "./notification";
import commentDocs from "./comment";
import userDocs from "./user";
import workspaceDocs from "./workspace";
import schemas from "./schemas";

const docs = {
	paths: {
		...taskDocs,
		...teamDocs,
		...activityDocs,
		...notificationDocs,
		...commentDocs,
		...workspaceDocs,
		...userDocs,
	},
	components: {
		schemas: schemas,
	},
};

export default docs;
