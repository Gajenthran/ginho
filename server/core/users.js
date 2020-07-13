const hasUser = (users, name, room) => {
  // TODO: change username to email !!
  return users.find(
    (user) =>
      user.room == room &&
      user.name == name
  );
};

const getUserIndex = (users, id) => {
  for (let i = 0; i < users.length; i++)
    if (users[i].id === id)
      return i;
  return -1;
};

const getUsersInRoom = (users, room) => {
  return users.filter(
    (user) => user.room === room
  );
};

const getUser = (users, id) => {
  return users.find(
    (user) =>
      user.id === id
  );
};

module.exports = { hasUser, getUserIndex, getUsersInRoom, getUser };