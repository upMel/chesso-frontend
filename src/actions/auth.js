import { AUTH, LOGOUT } from '../constants/actionTypes';
import * as api from '../api/index.js';


export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    console.log(data)
    dispatch({ type: AUTH, data });
    if(data?.result?.role === 'admin'){
      navigate('/admin',{replace:true})
      return data;
    }
    navigate('/', { replace: true })
    return data;
  } catch (error) {
    console.log({error});
    return {error};
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    console.log(data)
    dispatch({ type: AUTH, data });

    // navigate('/', { replace: true })
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    return {error};
  }
};

export const googlelogin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleLogin(formData);
    console.log(data)
    dispatch({ type: AUTH, data });

    navigate('/', { replace: true })
  } catch (error) {
    console.log(error.message);
  }
};


export const logOut = (navigate) => async (dispatch) => {
  try {
    //if user is not google logged in then await api logout
    await api.logOut();
    
    dispatch({ type: LOGOUT });
    

    navigate('/auth', { replace: true })

  } catch (error) {
    console.log(error.message);
  }
};

export const forgotPassword = (formData, navigate) => async (dispatch) => {
  try {

    const res=await api.forgotPassword(formData);
    
    // dispatch({ type: LOGOUT });
    

    // navigate('/auth', { replace: true })
return res;
  } catch (error) {
    console.log(error.message);
    return {error};
  }
};

export const resetPassword = (formData,resetToken,navigate) => async (dispatch) => {
  try {

    await api.resetPassword(formData, resetToken);
    
    // dispatch({ type: LOGOUT });
    

    navigate('/auth', { replace: true })

  } catch (error) {
    console.log(error.message);
  }
};

export const validateEmail = (validationToken,navigate) => async (dispatch) => {
  try {

    const res=await api.validateEmail(validationToken);
    
    // dispatch({ type: LOGOUT });
    

    // navigate('/auth', { replace: true })
    return res;
  } catch (error) {
    // const response
    console.log({error});
    return {error};
  }
};
export const updateDetails = (formData,navigate) => async (dispatch) => {
  try {

    const { data } = await api.updateDetails(formData);
    console.log(data)
    dispatch({ type: AUTH, data });

    navigate('/', { replace: true })
   

  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const changePassword = (formData,navigate) => async (dispatch) => {
  try {

    const { data } = await api.changePassword(formData);
    console.log(data)
    dispatch({ type: AUTH, data });

    navigate('/', { replace: true })
   

  } catch (error) {
    console.log(error.message);
    return error;
  }
};

export const uploadImage = (formData,navigate) => async (dispatch) => {
  try {

    const { data } = await api.uploadImage(formData);
    console.log(data)
    dispatch({ type: AUTH, data });

    navigate('/', { replace: true })
   

  } catch (error) {
    console.log({error});
    return error;
  }
};