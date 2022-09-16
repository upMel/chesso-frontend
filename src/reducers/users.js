import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export default (users = [], action) => {
    switch (action.type) {
      case FETCH_ALL:
        return action.payload;
      case CREATE:
        return [...users, action.payload];
      case UPDATE:
        return users.map((user) => (user._id === action.payload._id ? action.payload : user));
      case DELETE:
        // console.log(users)
        //thelei ligh douleia auto gia ton admin
        //Apla lew na valw ena useEffect ston admin gia to state twn users kai
        //otan kati allazei tha kanei apo mono tou ksanafetch ta stoixeia apo to backend
        users.data.filter((user) => user._id !== action.payload)
        return [users];
      default:
        return users;
    }
  };