var assert = require("assert");
var code = require("./pitstop-tests.js");

describe("AccessDoor", function() {
  describe("#validateIsNotJoeAndNoAccessCode", function() {
    it("should return bool true", function() {
      assert.notEqual(code._test.validateIsNotJoeAndNoAccessCode(), true);
    });
  });
});

describe("AccessDoor", function() {
  describe("#validateIsJoeAndNoAccessCode", function() {
    it("should return bool true", function() {
      assert.equal(code._test.validateIsJoeAndNoAccessCode(), true);
    });
  });
});

describe("AccessDoor", function() {
  describe("#validateIsNotJoeAndAccessCode", function() {
    it("should return bool true", function() {
      assert.equal(code._test.validateIsNotJoeAndAccessCode(), true);
    });
  });
});

describe("AccessDoor", function() {
  describe("#createDbClientWithCorrectDbName", function() {
    it("should return bool true", function() {
      assert.equal(code._test.createDbClientWithDbName("local"), true);
    });
  });
});

describe("AccessDoor", function() {
  describe("#createDbClientWithInCorrectDbName", function() {
    it("should throw error and return bool false", function() {
      assert.equal(code._test.createDbClientWithDbName("incorrectDb"), false);
    });
  });
});
