import { it, before, after, afterEach } from "node:test";
import supertest from "supertest";
import { init } from "../src/app";
import sinon from "sinon";

const TestDB = {
  save: sinon.fake(),
  close: sinon.fake(),
};
const app = init(TestDB);

let server: any = null;
before(() => {
  server = app.listen(3000);
});

afterEach(() => {
  sinon.reset();
});

after((done) => {
  server.close(done);
});

it("should call save on a successful event", async () => {
  await supertest(app)
    .post("/event")
    .send({ type: "search", user: "test", query: "test" })
    .expect(200);

  sinon.assert.calledOnce(TestDB.save);
});

it("should not call save when an event is invalid", async () => {
  await supertest(app).post("/event").send({ type: "not_valid" }).expect(400);

  sinon.assert.notCalled(TestDB.save);
});

it("should have a timestamp and id", async () => {
  await supertest(app)
    .post("/event")
    .send({ type: "search", user: "test", query: "test" })
    .expect(200);

  sinon.assert.calledWith(TestDB.save, sinon.match.has("timestamp"));
  sinon.assert.calledWith(TestDB.save, sinon.match.has("id"));
});
