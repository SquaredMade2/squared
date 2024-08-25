import taskDocs from "./task";
import teamDocs from "./team";
import activityDocs from "./activity"
import schemas from "./schemas";

const docs = {
  paths: {
    ...taskDocs,
    ...teamDocs,
    ...activityDocs,
  },
  components: {
    schemas: schemas,
  },
};

export default docs;
