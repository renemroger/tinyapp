const { assert } = require('chai');
const expect = require('chai').expect;
const { validateEmail } = require('../validations');
const sinon = require('sinon');





const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('validateEmail()', function() {
  const fakeRequest = {
    body: {
      email: 'fakeEmail123@fake.com'
    }
  }

  it('check if next was called', function() {
    const nextSpy = sinon.spy();
    validateEmail(fakeRequest, {}, nextSpy);
    expect(nextSpy.calledOnce).to.be.true;
  });

  it('throw error if email is empty', function() {
    const fakeRequest = {
      body: {
        email: ''
      }
    }
    const nextSpy = sinon.spy();
    validateEmail(fakeRequest, {}, nextSpy);
    const errArg = nextSpy.firstCall.args[0];
    expect(errArg).to.be.instanceof(Error);
  });

  it('throw error if email exists', function() {
    const fakeRequest = {
      body: {
        email: 'user2@example.com'
      }
    }
    const nextSpy = sinon.spy();
    validateEmail(fakeRequest, {}, nextSpy);
    const errArg = nextSpy.firstCall.args[0];
    expect(errArg).to.be.instanceof(Error);
  });
});