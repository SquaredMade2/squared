import taskDocs from "./task";
import teamDocs from "./team";
import workspaceDocs from "./workspace"
import schemas from "./schemas";

const docs = {
  paths: {
    ...taskDocs,
    ...teamDocs,
    ...workspaceDocs
  },
  components: {
    schemas: schemas,
  },
};

export default docs;
