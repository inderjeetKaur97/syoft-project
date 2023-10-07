const users = [];

//function to collect userInfo when user joins
function userJoin(id, username, roomname,) {
  const user = { id, username, roomname, };
  users.push(user);
  return user
}

// function when user leaves
function userLeave(id) {
  index = users.findIndex(user => (user.id === id))
  // console.log(index)
  if (index !== -1) {
    // console.log(users.splice(index,1)[0])
    return users.splice(index, 1)[0]
  }
}
//function to get info of user based on its id
function getCurrentUser(id) {

  return users.find(user => (user.id === id));
}
//function to get room of user based on its room name
function getRoomName(roomname) {
  return users.filter(user => user.roomname === roomname)
}

module.exports = {
  userJoin,
  getCurrentUser,
  getRoomName,
  userLeave,
  users
}
