var assert = require("assert");
var code = require("./pitstop-tests.js");

describe("AccessDoor", function() {
  describe("#validateIsJoeAndNoAccessCode", function() {
    it("should return bool true", function() {
      assert.equal(code._test.validateAccessCodeAndName("wrongCode", "Joe"), true);
    });
  });

  describe("#validateIsNotJoeAndAccessCode", function() {
    it("should return bool true", function() {
      assert.equal(code._test.validateAccessCodeAndName("accessCode", "wrongName"), true);
    });
  });

  describe("#validateIsNotJoeAndNoAccessCode", function() {
    it("should return bool true", function() {
      assert.notEqual(code._test.validateAccessCodeAndName("wrongCode", "wrongName"), true);
    });
  });
});

describe("AccessDoor", function() {
  describe("#createPoolWithDbName", function() {
    it("should return bool true", function() {
      assert.equal(code._test.createPoolWithDbName("local"), true);
    });
  });

  describe("#createPoolWithWrongDbName", function() {
    it("should throw error", function() {
      assert.throws(() => code._test.createPoolWithDbName("aaaa"), Error, "Unrecognized database.");
    });
  });
});
