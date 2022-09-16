import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getUsers = () => async (dispatch) => {
  try {
    
    const   {data}   = await api.fetchUsers();
    console.log(data)
    dispatch({ type: FETCH_ALL, payload: data });
    return {data} ;
  } catch (error) {
    console.log(error);
  }
};

// export const getUser = (id) => async (dispatch) => {
//   try {
    
//     const  { data }  = await api.fetchUser(id);
//     console.log(data)
//     dispatch({ type: FETCH_ALL, payload: data });
    
//   } catch (error) {
//     console.log(error);
//   }
// };

export const deleteUser = (id) => async (dispatch) => {
  try {
    await api.deleteUser(id);
    
    dispatch({ type: DELETE, payload: id });
    
  } catch (error) {
    console.log(error.message);
  }
};