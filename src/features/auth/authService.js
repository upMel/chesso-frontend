import * as api from '../../api/index.js';


const signin = async (formData) => {
    
        const response = await api.signIn(formData);
        console.log(response.data)
        if (response.data) {
            localStorage.setItem('profile', JSON.stringify(response.data))
          }
        return response.data;


    
        
    
};

const signup = async (formData) => {
    
        const { data } = await api.signUp(formData);
        console.log(data)
        return data;
    
      
    
};

const googlelogin =async  (formData) => {
    
        const { data } = await api.googleLogin(formData);
        console.log(data)

        return data;
      
    
};


const logout = async () => {
    

        await api.logOut();
         localStorage.removeItem('profile')


    
        
        
};

const forgotPassword = async (formData) => {
    

        await api.forgotPassword(formData);





    
       
    
};

const resetPassword =async  (formData, resetToken) => {
    

        await api.resetPassword(formData, resetToken);



    
      
    
};

const updateDetails = async (formData) => {
    

        const { data } = await api.updateDetails(formData);
        console.log(data)
        return data;


    
        
    
};

const changePassword = async (formData) => {
    

        const { data } = await api.changePassword(formData);
        console.log(data)

        return data;

    
        
    
};

const authService = {
    signin,
    signup,
    logout,
    googlelogin,
    changePassword,
    updateDetails,
    resetPassword,
    forgotPassword,

}

export default authService