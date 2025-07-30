process.env.NODE_ENV = "test";

const http = require("http");
const test = require("tape");
const servertest = require("servertest");
const app = require("../lib/app");

const server = http.createServer(app);

test("GET /health should return 200", function (t) {
  servertest(server, "/health", { encoding: "json" }, function (err, res) {
    t.error(err, "No error");
    t.equal(res.statusCode, 200, "Should return 200");
    t.end();
  });
});

test("GET /api/ok should return 200", function (t) {
  servertest(server, "/api/ok", { encoding: "json" }, function (err, res) {
    t.error(err, "No error");
    t.equal(res.statusCode, 200, "Should return 200");
    t.ok(res.body.ok, "Should return a body");
    t.end();
  });
});

test("GET /nonexistent should return 404", function (t) {
  servertest(server, "/nonexistent", { encoding: "json" }, function (err, res) {
    t.error(err, "No error");
    t.equal(res.statusCode, 404, "Should return 404");
    t.end();
  });
});

//  project budget endpoints
test("GET /api/project/budget/:id should return 200", function (t) {
  const projectId = 463;
  servertest(
    server,
    `/api/project/budget/${projectId}`,
    { encoding: "json" },
    function (err, res) {
      console.log(res);
      t.error(err, "No error");
      t.equal(res.statusCode, 200, "Should return 200");
      t.equal(res.body.success, true, "Should return success: true");
      t.ok(res.body.data, "Should return data");
      t.ok(res.body.message, "Should return a message");
      t.end();
    }
  );
});

test("GET /project/budget/undefined should return 404", function (t) {
  servertest(
    server,
    "/project/budget/undefined",
    { encoding: "json" },
    function (err, res) {
      t.error(err, "No error");
      t.equal(res.statusCode, 404, "Should return 404");
      t.equal(res.body.success, false, "Should return success: false");
      t.equal(
        res.body.message,
        "Project not found",
        "Should return appropriate error message"
      );
      t.end();
    }
  );
});
