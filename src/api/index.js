import axios from 'axios';
const API = axios.create({ baseURL: 'https://chesso-backend.herokuapp.com/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

// export const fetchPosts = () => API.get('/posts');
export const fetchUsers = () => API.get('/users');
// export const fetchUser = (id) => API.get(`/user/${id}`);
export const deleteUser = (id) => API.delete(`/users/${id}`);


export const signIn = (formData) => API.post('/auth/login', formData,{withCredentials:true});
export const signUp = (formData) => API.post('/auth/register', formData);
export const logOut = () => API.get('/auth/logout');
export const forgotPassword = (formData) => API.post('/auth/forgotpassword',formData);
export const resetPassword = (formData,resetToken) => API.put(`/auth/resetpassword/${resetToken}`,formData);
export const googleLogin = (formData)=> API.post('/auth/googleauth',formData)
export const updateDetails = (formData)=> API.put('/auth/updatedetails',formData)
export const changePassword = (formData)=> API.put('/auth/updatepassword',formData)
export const uploadImage = (formData)=> API.post('/upload',formData)
export const validateEmail = (validationToken)=> API.get(`/auth/verify/${validationToken}`)
// export const createPost = (newPost) => API.post('/posts', newPost);
// export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
// export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
// export const deletePost = (id) => API.delete(`/posts/${id}`);
