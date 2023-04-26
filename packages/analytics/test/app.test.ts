import { it, before, after, describe } from "node:test";
import supertest from "supertest";
import { init } from "../src/app";

const app = init();

let server: any = null;
before(() => {
  server = app.listen(3000);
});

after((done) => {
  server.close(done);
});

describe("search events", () => {
  it("should return a 200 when all fields are present", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "search", user: "test", query: "test" })
      .expect(200);
  });

  it("should return a 400 when no query is present", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "search", user: "test" })
      .expect(400);
  });

  it("should return a 400 when user is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "search", query: "test" })
      .expect(400);
  });
});

describe("view events", () => {
  it("should return a 200 when all fields are present", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "view", user: "test", item_id: "1" })
      .expect(200);
  });

  it("should return a 400 when item id is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "view", user: "test" })
      .expect(400);
  });

  it("should return a 400 when user is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "view", item_id: "1" })
      .expect(400);
  });
});

describe("add to cart events", () => {
  it("should return a 200 when all fields are present", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "add_to_cart", user: "test", item_id: "1" })
      .expect(200);
  });

  it("should return a 400 when item id is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "add_to_cart", user: "test" })
      .expect(400);
  });

  it("should return a 400 when user is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "add_to_cart", item_id: "1" })
      .expect(400);
  });
});

describe("conversion events", () => {
  it("should return a 200 when all fields are present", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "conversion", user: "test", item_id: "1" })
      .expect(200);
  });

  it("should return a 400 when item id is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "conversion", user: "test" })
      .expect(400);
  });

  it("should return a 400 when user is missing", async () => {
    await supertest(app)
      .post("/event")
      .send({ type: "conversion", item_id: "1" })
      .expect(400);
  });
});
