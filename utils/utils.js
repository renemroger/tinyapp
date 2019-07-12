//generate a random string with 6 characters containing [z-Z,a-A].
function generateRandomString() {
  randomString = '';
  const A = 97;
  const Z = 122;
  const STRINGLENGTH = 6;
  let capitalOrNot = 0;
  let random = 0;

  for (let i = 0; i < STRINGLENGTH; i++) {
    capitalOrNot = (Math.random() >= 0.5) ? 32 : 0;
    random = Math.floor(Math.random() * (Z - A)) + A;
    randomString += String.fromCharCode(random - capitalOrNot);
  }
  return randomString;
}

const checkIfExistsByID = function(database, id) {
  if (database[id]) {
    return true;
  } else {
    return false;
  }
}

module.exports = { checkIfExistsByID, generateRandomString };