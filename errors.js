//CODE FROM LECTURE
//https://github.com/jensen/crud-notes/tree/master/src

class Error400 extends Error {
  message() {
    "Error 400"
  }
  statusCode() {
    return 400;
  }
}

module.exports = { Error400 }