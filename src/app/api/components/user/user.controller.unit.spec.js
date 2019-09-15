/**
 * @author Kelvin Birikorang
 * @email kelvinbirikorang@mail.com
 * @create date 2019-08-23 18:40:18
 * @modify date 2019-09-11 12:54:47
 * @desc users model
 */

//
// ─── IMPORT ─────────────────────────────────────────────────────────────────────
//

const sinon = require("sinon");
const _sinontest = require("sinon-test");
const sinontest = _sinontest(sinon);
const Controller = require("./user.controller");
const User = require("./user.model");
const Service = require("./user.service");
const expect = require("chai").expect;

describe("Unit Test User Controller", () => {
  let req = {
      body: {
        username: "test user",
        password: "test password"
      },
      params: { role: "parent" },
      query: { role: "parent" }
    },
    error = new Error({ error: "something went wrong" }),
    res = {},
    expectedResult,
    userInfo;

  describe("authenticate user", () => {
    beforeEach(() => {
      expectedResult = req.body;
      userInfo = {
        id: 1,
        username: "test user",
        ref: "uuid"
      };
    });
    it(
      "should authenticate user",
      sinontest(function() {
        let controller = sinon.spy(Controller,'authenticate')
        Controller.authenticate(req,res)
        sinon.assert.calledOnce(controller)
      })
    );

    it(
      "should check if user service generate a token data",
      sinontest(function() {
        this.stub(User, "findOne").yields(null, userInfo);
        Controller.authenticate(req, res);
        sinon.assert.calledWith(User.findOne, req.params.role, req.body);
        const serviceSpy = sinon.spy(Service, "generateToken");
        Service.generateToken(req.params.role, userInfo);
        sinon.assert.calledOnce(serviceSpy);
      })
    );
  });
});
