import "dotenv/config";
export{};
process.env.NODE_ENV = 'test'
const chai = require("chai")
let expect = chai.expect;
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../index")
import mongoose from "mongoose";
import Workspace from "../models/workspace";
import User from "../models/user";
import Task from "../models/task";
import Team from "../models/team";
import PageFilter from "../models/pageFilter";
import { CommentModel as Comment } from "../models/events";
import { hashPassword} from "../helpers/auth";
const MONGO_URL = process.env.MONGO_URL;

const setTestingInfo = async() =>{
       const user = await User.create({
        name: 'test User',
        username: 'testUser',
        email: "test@email.com",
        password: await hashPassword('test123'),
        date: Date.now(),
        verified: true,
        on_boarding: true,
        _id:'659efc7faa55abcd43812566'
       });

      const workspace = await Workspace.create({
        name : 'testWorkspace',
        url : 'testWorkspace',
        companySize: 100,
        users: [user],
        _id:'659efc7faa55abcd4381256d'
      });

    const team = await Team.create({
        name: 'testTeam',
        identifier: "TT",
        workspace,
        users:[user],
        _id:'65a053666de690077195c018'
      });
  
    await Workspace.findByIdAndUpdate(workspace._id, {
        $push: { teams: team._id },
      });
    await User.findByIdAndUpdate(user._id, {
        $push: { teams: team._id },
      });

    const task = await Task.create({
        title: 'testTask',
        status: 'In Progress',
        description: 'test task',
        priority:'High',
        identifier: "TT-1",
        labels:'Test',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        effortEstimate: '1',
        team,
        _id:'65a053d2a99e9497371d77cc'
      });
    await Team.findByIdAndUpdate(team._id, {$push: { tasks: task._id }})

    const comment = await Comment.create({
        comment:`{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Comment","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        author: user,
        date: Date.now(),
        task: task,
        _id:'65a053d2a99e9497371d77d3'
    })

    const filter = await PageFilter.create({
        filterTitle:'test filter',
        filterOption:{
            status:['Todo'],
            priority:['Urgent']
        },
        filterDescription:'',
        teamId:'65a053666de690077195c018',
        _id:'65a411380ed4475ce1ddeb81'
    })
}
const clearDB = () =>{
    return mongoose.connect(MONGO_URL,{ dbName: 'testing' })
    .then((): Promise<Boolean> => mongoose.connection.db.dropDatabase())
}

before( async function () {
        // runs once before the first test
        await clearDB();
        setTestingInfo();
    }); 
after(async function () {
        // runs once after the last test
        
        await clearDB()
    });

    // test cases
describe("Auth Routes", ()=>{
    const userInfo = {
        name:"test User",
        username:"testUser",
        email:"testing@email.com",
        password:"testing123"
    };
    describe("/Post register", ()=>{
        it("register without name",(done)=>{
            chai.request(server)
                .post('/register')
                .type('json')
                .send({email:"testing@email.com"})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(422)
                    expect(res.body.error).to.equal('name is required');
                    done();
                })   
        })
        it("register without email",(done)=>{
            chai.request(server)
                .post('/register')
                .type('json')
                .send({name:"testing"})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(422)
                    expect(res.body.error).to.equal('Email is required');
                    done();
                })   
        })
        it("register without password",(done)=>{
            chai.request(server)
                .post('/register')
                .type('json')
                .send({
                    name:"testing",
                    email:"testing@email.com"})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(422)
                    expect(res.body.error).to.equal('Password is required. It should be at least 6 characters long');
                    done();
                })   
        })
        it("testing the register endpoint",(done)=>{
            chai.request(server)
                .post('/register')
                .type('json')
                .send(userInfo)
                .end((err:any, res:any) => {
                    expect(res).to.have.status(201)
                    expect(res.body.success).to.equal(true);
                    expect(res.body.message).to.equal(`Sent a verification email to ${userInfo.email}`);
                    done();
                })  
        })
    })
    describe("/Post login", ()=>{
        it("testing login", (done)=>{
            chai.request(server)
                .post('/login')
                .type('json')
                .send({
                    email:'test@email.com',
                    password:'test123'
                })
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })
    })
    describe("/Get User", ()=>{
        it("testing getUser", (done)=>{
            chai.request(server)
                .get('/user')
                .query({id: '659efc7faa55abcd43812566'})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })
    })
    describe("/Put updateProfile", ()=>{
        it("testing update Profile", (done)=>{
            chai.request(server)
                .put('/updateProfile')
                .query({id: '659efc7faa55abcd43812566'})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })
    })
})

describe("Workspace Routes",()=>{
    const workspaceInfo = {
        name:"Test Space",
        url:"test-space",
        companySize:"100",
        users:'659efc7faa55abcd43812566'
    }
    describe("/Post /create",()=>{
        it("testing the Create worksace endpoint",(done)=>{
            chai.request(server)
                .post('/workspace/create')
                .type('json')
                .send(workspaceInfo)
                .end((err:any, res:any) => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })
    })
    describe("/get /read",()=>{
        it("testing the get single workspace route",(done)=>{
            chai.request(server)
            .get('/workspace/read')
            .query({id: '659efc7faa55abcd4381256d', user:'659efc7faa55abcd43812566'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })

    })
    describe("/Get /read-all",()=>{
        it("testing the get all workspaces for a user route",(done)=>{
            chai.request(server)
            .get('/workspace/read-all')
            .query({id: '659efc7faa55abcd43812566'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })

    })
    describe("/Put /update",()=>{
        it("testing the update workspace route",(done)=>{
            chai.request(server)
            .put('/workspace/update')
            .query({id:'659efc7faa55abcd4381256d', name:"updated", url:"updated-url"})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                done();
            })
        })
    })
    describe("/Delete /delete",()=>{
        let deleteId:any;
        it("creating workspace to be deleted", (done) =>{   
            chai.request(server)
            .post('/workspace/create')
            .type('json')
            .send({
                name:"toBeDeleted",
                url:"toBeDeleted",
                companySize:"100",
                users:'659efc7faa55abcd43812566'
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(201)
                expect(res.body).to.be.a("object")
                deleteId = res.body.workspace._id
                done();
            })
        })
        it("testing delete workspace", (done) =>{
            chai.request(server)
            .delete('/workspace/delete')
            .type('json')
            .send({
                id:deleteId
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                done();
            })
        })
    })
    describe("/Get /exists",()=>{
        it("testing if workspace exists", (done) =>{
            chai.request(server)
            .get('/workspace/exists')
            .query({
                url: "updated-url"
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(404)
                done();
            })
        })
        it("testing if workspace doesn't exists", (done) =>{
            chai.request(server)
            .get('/workspace/exists')
            .query({
                url: "doesNotExist"
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                done();
            })
        })
    })

})

describe("Team Routes",()=>{
    const teamInfo = {
        name:"newTeam",
        identifier:'NT',
        workspace: "659efc7faa55abcd4381256d"
    }
    describe("/Post /create",()=>{
        it("testing create team", (done)=>{
            chai.request(server)
                .post('/team/create')
                .type('json')
                .send(teamInfo)
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })

    })
    describe("/get /read",()=>{
        it("testing get team", (done)=>{
            chai.request(server)
                .get('/team/read')
                .query({
                    team:'65a053666de690077195c018', 
                    identifier:teamInfo.identifier, 
                    workspace:teamInfo.workspace})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    done();
                })
        })

    })
    describe("/Get /update",()=>{
        it("testing update team", (done)=>{
            chai.request(server)
                .put('/team/update')
                .type('json')
                .send({
                    name:'updated team', 
                    identifier:'UT', 
                    id:'65a053666de690077195c018', 
                    workspaceId:'659efc7faa55abcd4381256d'})
                .end((err:any, res:any) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a("object")
                    expect(res.body.message).to.equal("Team updated successfully")
                    done();
                })
        })

    })
    describe("/Get /exists",()=>{
        it("testing if team exists", (done) =>{
            chai.request(server)
            .post('/team/exists')
            .type('json')
            .send({
                name:'updated team', 
                identifier:'UT',  
                workspace:'659efc7faa55abcd4381256d'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(409)
                done();
            })
        })
        it("testing if team doesn't exists", (done) =>{
            chai.request(server)
            .post('/team/exists')
            .type('json')
            .send({
                name:'does not exist', 
                identifier:'DNE',  
                workspace:'659efc7faa55abcd4381256d'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(204)
                done();
            })
        })
    })
    describe("/Delete /delete",()=>{
        let deleteId:any;
        it("creating team to be deleted", (done) =>{   
            chai.request(server)
            .post('/team/create')
            .type('json')
            .send({
                name:"toBeDeleted",
                identifier:"toBeDeleted",
                workspace: "659efc7faa55abcd4381256d"
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                deleteId = res.body._id
                done();
            })
        })
        it("testing delete team", (done) =>{
            chai.request(server)
            .delete('/team/delete')
            .type('json')
            .send({
                id:deleteId
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                done();
            })
        })

    })
})

describe("Task Routes",()=>{
    const taskInfo = {
        title: 'new Task',
        status: 'In Progress',
        description: 'new task',
        priority:'High',
        identifier: "NT-1",
        labels:'Test',
        team: '65a053666de690077195c018'
    }
    describe("/Post /create",()=>{
        it("testing create task", (done) =>{
            chai.request(server)
            .post('/task/create')
            .type('json')
            .send(taskInfo)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })

    })
    describe("/get /read",()=>{
        it("testing get all tasks for a team", (done) =>{
            chai.request(server)
            .get('/task/read')
            .query({team:'65a053666de690077195c018'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })
    })
    describe("/Get /read/:id",()=>{
        it("testing get single task", (done) =>{
            chai.request(server)
            .get(`/task/read/${'65a053d2a99e9497371d77cc'}`)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })

    })
    describe("/Put /update/:id",()=>{
        it("testing update task", (done) =>{
            chai.request(server)
            .put(`/task/update/${'65a053d2a99e9497371d77cc'}`)
            .type('json')
            .send({title:'updated task',
                description:'updated task'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })

    })
    describe("/Delete /delete",()=>{
        let deleteId:any;
        it("creating task to be deleted", (done) =>{   
            chai.request(server)
            .post('/task/create')
            .type('json')
            .send({
                title: 'to be deleted Task',
                status: 'In Progress',
                description: 'new task',
                priority:'High',
                identifier: "TBD-1",
                labels:'Test',
                team: '65a053666de690077195c018'
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                deleteId = res.body._id
                done();
            })
        })
        it("testing delete task", (done) =>{
            chai.request(server)
            .delete('/task/delete')
            .type('json')
            .send({
                id:deleteId
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                done();
            })
        })

    })
})

describe("Event Routes",()=>{
    const comment = {
        comment:`{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Comment","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        author: '659efc7faa55abcd43812566',
        task: '65a053d2a99e9497371d77cc'
    }
    describe("/Post /comment/create",()=>{
        it("testing create comment", (done) =>{
            chai.request(server)
            .post('/event/comment/create')
            .type('json')
            .send(comment)
            .end((err:any, res:any) => {
                expect(res).to.have.status(201)
                expect(res.body).to.be.a("object")
                done();
            })
        })
    })
    describe("/get /comment/read/:taskId",()=>{
        it("testing get comments for task", (done) =>{
            chai.request(server)
            .get(`/event/comment/read/${'65a053d2a99e9497371d77cc'}`)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })

    })
    describe("/Put /comment/update",()=>{
        it("testing update comment", (done) =>{
            chai.request(server)
            .put('/event/comment/update')
            .type('json')
            .send({
                _id:'65a053d2a99e9497371d77d3',
                comment:'updated comment'
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                expect(res.body.comment).to.equal("updated comment")
                done();
            })
        })

    })
    describe("/Delete /comment/delete/:id",()=>{
        let deleteId:any;
        it("creating task to be deleted", (done) =>{   
            chai.request(server)
            .post('/event/comment/create')
            .type('json')
            .send({
                comment:'to be deleted',
                author: '659efc7faa55abcd43812566',
                task: '65a053d2a99e9497371d77cc'
            })
            .end((err:any, res:any) => {
                expect(res).to.have.status(201)
                expect(res.body).to.be.a("object")
                deleteId = res.body._id
                done();
            })
        })
        it("testing delete comment", (done) =>{
            chai.request(server)
            .delete(`/event/comment/delete/${deleteId}`)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })


    })

})

describe("Page Filter Routes",()=>{
    const filterInfo = {
        filterTitle:'new filter',
        filterOption:{},
        filterDescription:'new filter',
        teamId:'65a053666de690077195c018'
    }
    describe("/Post /create",()=>{
        it("testing create filter", (done) =>{
            chai.request(server)
            .post('/filter/create')
            .type('json')
            .send(filterInfo)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                done();
            })
        })

    })
    describe("/Post /tasks/:teamId/:filterId",()=>{
        it("testing get filtered task", (done) =>{
            chai.request(server)
            .post(`/filter/tasks/${'65a053666de690077195c018'}/${'65a411380ed4475ce1ddeb81'}`)
            .type('json')
            .send({ status: [ 'Todo' ], priority: [ 'Urgent' ] })
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })


    })
    describe("/Get /read/:teamId",()=>{
        it("testing get filters for a team", (done) =>{
            chai.request(server)
            .get(`/filter/read/${'65a053666de690077195c018'}`)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })

    })
    describe("/Get /tasks/:teamId/:filterId",()=>{
        it("testing get filtered task", (done) =>{
            chai.request(server)
            .get(`/filter/tasks/${'65a053666de690077195c018'}/${'65a411380ed4475ce1ddeb81'}`)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })

    })
    describe("/Delete /delete/",()=>{
        let deleteId:any;
        it("creating filter to be deleted", (done) =>{   
            chai.request(server)
            .post('/filter/create')
            .type('json')
            .send(filterInfo)
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("object")
                deleteId = res.body._id
                done();
            })
        })
        it("testing delete comment", (done) =>{
            chai.request(server)
            .delete(`/filter/delete`)
            .type('json')
            .send({
                filterId:deleteId,
                teamId:'65a053666de690077195c018'})
            .end((err:any, res:any) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a("array")
                done();
            })
        })
    })

});

