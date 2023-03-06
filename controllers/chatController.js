const trimStr = (str) => {
  str.trim().toLowerCase()};
const findUser = (user) => {
  console.log('user', user)
    const userName = trimStr(user.name);
    const userRoom = trimStr(user.room);
  
    return users.find(
      (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
    );
  }

let users = [];

class ChatController {
    findUser = (user) => {

        const userName = trimStr(user.name);
        const userRoom = trimStr(user.room);
      
        return users.find(
          (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
        );
      }

     addUser = (user) => {
        const isExist = findUser(user);
      
        !isExist && users.push(user);
      
        const currentUser = isExist || user;
      
        return { isExist: !!isExist, user: currentUser };
      }
    
       getRoomUsers = (room) => users.filter((u) => u.room === room)
      
       removeUser = (user) => {
        const found = findUser(user);
      
        if (found) {
          users = users.filter(
            ({ room, name }) => room === found.room && name !== found.name
          );
        }
      
        return found;
      }

}

module.exports = new ChatController()
