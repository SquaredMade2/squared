import taskDocs from "./task";
import teamDocs from "./team";
import commentDocs from "./comment";
import schemas from "./schemas";

const docs = {
  paths: {
    ...taskDocs,
    ...teamDocs,
    ...commentDocs,
  },
  components: {
    schemas: schemas,
  },
};

export default docs;
