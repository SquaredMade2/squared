import taskDocs from "./task";
import teamDocs from "./team";
import schemas from "./schemas";

const docs = {
  paths: {
    ...taskDocs,
    ...teamDocs,
  },
  components: {
    schemas: schemas,
  },
};

export default docs;
