/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 12:56:39
 * @desc users model
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const { expect } = require("chai");
const app = require("../src/app");
const config = require("config");

describe("INTEGRATION TEST FOR SERVER ", () => {
  it("should return server port", () => {
    expect(app.port).to.equal(config.get("port"));
  });
});
