import "dotenv/config";
const mongoose = require("mongoose");
import chai from "chai";
import chaiHttp from "chai-http";
import Workspace from "../models/workspace";
import User from "../models/user";
import Task from "../models/task";
import Team from "../models/team";
import PageFilter from "../models/pageFilter";
import { CommentModel as Comment } from "../models/events";
import { hashPassword } from "../helpers/auth";
import { after, before, describe, it } from "node:test";
import server from "../index";

process.env.NODE_ENV = "test";
chai.use(chaiHttp);
const { expect } = chai;
const MONGO_URL = process.env.MONGO_URL;

const setTestingInfo = async () => {
  const user = await User.create({
    name: "test User",
    username: "testUser",
    email: "test@email.com",
    password: await hashPassword("test123"),
    date: Date.now(),
    verified: true,
    on_boarding: true,
    _id: "659efc7faa55abcd43812566",
  });

  const workspace = await Workspace.create({
    name: "testWorkspace",
    url: "testWorkspace",
    companySize: 100,
    users: [user],
    _id: "659efc7faa55abcd4381256d",
  });

  const team = await Team.create({
    name: "testTeam",
    identifier: "TT",
    workspace,
    users: [user],
    _id: "65a053666de690077195c018",
  });

  await Workspace.findByIdAndUpdate(workspace._id, {
    $push: { teams: team._id },
  });
  await User.findByIdAndUpdate(user._id, {
    $push: { teams: team._id },
  });

  const task = await Task.create({
    title: "testTask",
    status: "In Progress",
    description: "test task",
    priority: "High",
    identifier: "TT-1",
    labels: "Test",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    effortEstimate: "1",
    team,
    _id: "65a053d2a99e9497371d77cc",
  });
  await Team.findByIdAndUpdate(team._id, {
    $push: { tasks: task._id },
  });

  const comment = await Comment.create({
    comment: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Comment","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    author: user,
    date: Date.now(),
    task: task,
    _id: "65a053d2a99e9497371d77d3",
  });

  await PageFilter.create({
    filterTitle: "test filter",
    filterOption: {
      status: ["Todo"],
      priority: ["Urgent"],
    },
    filterDescription: "",
    teamId: "65a053666de690077195c018",
    _id: "65a411380ed4475ce1ddeb81",
  });
};

const clearDB = async () => {
  await mongoose.connect(MONGO_URL, { dbName: "testing" });
  await mongoose.connection.db.dropDatabase();
};

before(async () => {
  await clearDB();
  await setTestingInfo();
});

after(async () => {
  await clearDB();
});

describe("Auth Routes", () => {
  const userInfo = {
    name: "test User",
    username: "testUser",
    email: "testing@email.com",
    password: "testing123",
  };

  describe("/Post register", () => {
    it("register without name", () => {
      return chai
        .request(server)
        .post("/register")
        .type("json")
        .send({ email: "testing@email.com" })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.error).to.equal("name is required");
        });
    });

    it("register without email", () => {
      return chai
        .request(server)
        .post("/register")
        .type("json")
        .send({ name: "testing" })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.error).to.equal("Email is required");
        });
    });

    it("register without password", () => {
      return chai
        .request(server)
        .post("/register")
        .type("json")
        .send({
          name: "testing",
          email: "testing@email.com",
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body.error).to.equal(
            "Password is required. It should be at least 6 characters long"
          );
        });
    });

    it("testing the register endpoint", () => {
      return chai
        .request(server)
        .post("/register")
        .type("json")
        .send(userInfo)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.equal(true);
          expect(res.body.message).to.equal(
            `Sent a verification email to ${userInfo.email}`
          );
        });
    });
  });

  describe("/Post login", () => {
    it("testing login", () => {
      return chai
        .request(server)
        .post("/login")
        .type("json")
        .send({
          email: "test@email.com",
          password: "test123",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Get User", () => {
    it("testing getUser", () => {
      return chai
        .request(server)
        .get("/user")
        .query({ id: "659efc7faa55abcd43812566" })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Put updateProfile", () => {
    it("testing update Profile", () => {
      return chai
        .request(server)
        .put("/updateProfile")
        .query({ id: "659efc7faa55abcd43812566" })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });
});

describe("Workspace Routes", () => {
  const workspaceInfo = {
    name: "Test Space",
    url: "test-space",
    companySize: "100",
    users: "659efc7faa55abcd43812566",
  };

  describe("/Post /create", () => {
    it("testing the Create workspace endpoint", () => {
      return chai
        .request(server)
        .post("/workspace/create")
        .type("json")
        .send(workspaceInfo)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/get /read", () => {
    it("testing the get single workspace route", () => {
      return chai
        .request(server)
        .get("/workspace/read")
        .query({
          id: "659efc7faa55abcd4381256d",
          user: "659efc7faa55abcd43812566",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Get /read-all", () => {
    it("testing the get all workspaces for a user route", () => {
      return chai
        .request(server)
        .get("/workspace/read-all")
        .query({ id: "659efc7faa55abcd43812566" })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Put /update", () => {
    it("testing the update workspace route", () => {
      return chai
        .request(server)
        .put("/workspace/update")
        .query({
          id: "659efc7faa55abcd4381256d",
          name: "updated",
          url: "updated-url",
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });

  describe("/Delete /delete", () => {
    let deleteId: string;

    it("creating workspace to be deleted", () => {
      return chai
        .request(server)
        .post("/workspace/create")
        .type("json")
        .send({
          name: "toBeDeleted",
          url: "toBeDeleted",
          companySize: "100",
          users: "659efc7faa55abcd43812566",
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a("object");
          deleteId = res.body.workspace._id;
        });
    });

    it("testing delete workspace", () => {
      return chai
        .request(server)
        .delete("/workspace/delete")
        .type("json")
        .send({
          id: deleteId,
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });

  describe("/Get /exists", () => {
    it("testing if workspace exists", () => {
      return chai
        .request(server)
        .get("/workspace/exists")
        .query({
          url: "updated-url",
        })
        .then((res) => {
          expect(res).to.have.status(404);
        });
    });

    it("testing if workspace doesn't exist", () => {
      return chai
        .request(server)
        .get("/workspace/exists")
        .query({
          url: "doesNotExist",
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });
});

describe("Team Routes", () => {
  const teamInfo = {
    name: "newTeam",
    identifier: "NT",
    workspace: "659efc7faa55abcd4381256d",
  };

  describe("/Post /create", () => {
    it("testing create team", () => {
      return chai
        .request(server)
        .post("/team/create")
        .type("json")
        .send(teamInfo)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/get /read", () => {
    it("testing get team", () => {
      return chai
        .request(server)
        .get("/team/read")
        .query({
          team: "65a053666de690077195c018",
          identifier: teamInfo.identifier,
          workspace: teamInfo.workspace,
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Get /update", () => {
    it("testing update team", () => {
      return chai
        .request(server)
        .put("/team/update")
        .type("json")
        .send({
          name: "updated team",
          identifier: "UT",
          id: "65a053666de690077195c018",
          workspaceId: "659efc7faa55abcd4381256d",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal(
            "Team updated successfully"
          );
        });
    });
  });

  describe("/Get /exists", () => {
    it("testing if team exists", () => {
      return chai
        .request(server)
        .post("/team/exists")
        .type("json")
        .send({
          name: "updated team",
          identifier: "UT",
          workspace: "659efc7faa55abcd4381256d",
        })
        .then((res) => {
          expect(res).to.have.status(409);
        });
    });

    it("testing if team doesn't exist", () => {
      return chai
        .request(server)
        .post("/team/exists")
        .type("json")
        .send({
          name: "does not exist",
          identifier: "DNE",
          workspace: "659efc7faa55abcd4381256d",
        })
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });
  });

  describe("/Delete /delete", () => {
    let deleteId: string;

    it("creating team to be deleted", () => {
      return chai
        .request(server)
        .post("/team/create")
        .type("json")
        .send({
          name: "toBeDeleted",
          identifier: "toBeDeleted",
          workspace: "659efc7faa55abcd4381256d",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          deleteId = res.body._id;
        });
    });

    it("testing delete team", () => {
      return chai
        .request(server)
        .delete("/team/delete")
        .type("json")
        .send({
          id: deleteId,
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });
});

describe("Task Routes", () => {
  const taskInfo = {
    title: "new Task",
    status: "In Progress",
    description: "new task",
    priority: "High",
    identifier: "NT-1",
    labels: "Test",
    team: "65a053666de690077195c018",
  };

  describe("/Post /create", () => {
    it("testing create task", () => {
      return chai
        .request(server)
        .post("/task/create")
        .type("json")
        .send(taskInfo)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/get /read", () => {
    it("testing get all tasks for a team", () => {
      return chai
        .request(server)
        .get("/task/read")
        .query({ team: "65a053666de690077195c018" })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Get /read/:id", () => {
    it("testing get single task", () => {
      return chai
        .request(server)
        .get(`/task/read/${"65a053d2a99e9497371d77cc"}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Put /update/:id", () => {
    it("testing update task", () => {
      return chai
        .request(server)
        .put(`/task/update/${"65a053d2a99e9497371d77cc"}`)
        .type("json")
        .send({ title: "updated task", description: "updated task" })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Delete /delete", () => {
    let deleteId: string;

    it("creating task to be deleted", () => {
      return chai
        .request(server)
        .post("/task/create")
        .type("json")
        .send({
          title: "to be deleted Task",
          status: "In Progress",
          description: "new task",
          priority: "High",
          identifier: "TBD-1",
          labels: "Test",
          team: "65a053666de690077195c018",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          deleteId = res.body._id;
        });
    });

    it("testing delete task", () => {
      return chai
        .request(server)
        .delete("/task/delete")
        .type("json")
        .send({
          id: deleteId,
        })
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });
});

describe("Event Routes", () => {
  const comment = {
    comment: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Comment","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
    author: "659efc7faa55abcd43812566",
    task: "65a053d2a99e9497371d77cc",
  };

  describe("/Post /comment/create", () => {
    it("testing create comment", () => {
      return chai
        .request(server)
        .post("/event/comment/create")
        .type("json")
        .send(comment)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/get /comment/read/:taskId", () => {
    it("testing get comments for task", () => {
      return chai
        .request(server)
        .get(`/event/comment/read/${"65a053d2a99e9497371d77cc"}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Put /comment/update", () => {
    it("testing update comment", () => {
      return chai
        .request(server)
        .put("/event/comment/update")
        .type("json")
        .send({
          _id: "65a053d2a99e9497371d77d3",
          comment: "updated comment",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body.comment).to.equal("updated comment");
        });
    });
  });

  describe("/Delete /comment/delete/:id", () => {
    let deleteId: string;

    it("creating task to be deleted", () => {
      return chai
        .request(server)
        .post("/event/comment/create")
        .type("json")
        .send({
          comment: "to be deleted",
          author: "659efc7faa55abcd43812566",
          task: "65a053d2a99e9497371d77cc",
        })
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a("object");
          deleteId = res.body._id;
        });
    });

    it("testing delete comment", () => {
      return chai
        .request(server)
        .delete(`/event/comment/delete/${deleteId}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });
});

describe("Page Filter Routes", () => {
  const filterInfo = {
    filterTitle: "new filter",
    filterOption: {},
    filterDescription: "new filter",
    teamId: "65a053666de690077195c018",
  };

  describe("/Post /create", () => {
    it("testing create filter", () => {
      return chai
        .request(server)
        .post("/filter/create")
        .type("json")
        .send(filterInfo)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
        });
    });
  });

  describe("/Post /tasks/:teamId/:filterId", () => {
    it("testing get filtered task", () => {
      return chai
        .request(server)
        .post(
          `/filter/tasks/${"65a053666de690077195c018"}/${"65a411380ed4475ce1ddeb81"}`
        )
        .type("json")
        .send({ status: ["Todo"], priority: ["Urgent"] })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Get /read/:teamId", () => {
    it("testing get filters for a team", () => {
      return chai
        .request(server)
        .get(`/filter/read/${"65a053666de690077195c018"}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Get /tasks/:teamId/:filterId", () => {
    it("testing get filtered task", () => {
      return chai
        .request(server)
        .get(
          `/filter/tasks/${"65a053666de690077195c018"}/${"65a411380ed4475ce1ddeb81"}`
        )
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("/Delete /delete/", () => {
    let deleteId: string;

    it("creating filter to be deleted", () => {
      return chai
        .request(server)
        .post("/filter/create")
        .type("json")
        .send(filterInfo)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          deleteId = res.body._id;
        });
    });

    it("testing delete comment", () => {
      return chai
        .request(server)
        .delete("/filter/delete")
        .type("json")
        .send({
          filterId: deleteId,
          teamId: "65a053666de690077195c018",
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
        });
    });
  });
});
