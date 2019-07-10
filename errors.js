//CODE FROM LECTURE
//https://github.com/jensen/crud-notes/tree/master/src

module.exports = class Error400 extends Error {
  message() {
    "Error 400"
  }
  statusCode() {
    return 400;
  }
}