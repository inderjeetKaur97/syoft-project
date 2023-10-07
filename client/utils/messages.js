const moment = require("moment")
function messageFormat(name, text, position,) {
  const msgFormat = {
    userName: name,
    text: text,
    position: position,
    time: moment().format("hh:mm a")
  }
  return msgFormat;
}

module.exports = messageFormat;
