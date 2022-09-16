import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Icon from './icon';
import { signin, signup, googlelogin } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError]= useState('')
  const [verify , setVerify]= useState('')
  let {email, password, firstName,lastName,confirmPassword}=form
  const handleShowPassword = () => setShowPassword(!showPassword);

  useEffect(()=>{
    console.log(form)
  },[form]);

  const switchMode = (e) => { 
    setForm({...form });
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setError('')
    setVerify('')
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form.email)
    console.log(form.confirmPassword)
    console.log(form.password)

    if (isSignup) {
      if (form.confirmPassword===form.password){
        dispatch(signup(form, navigate))
        .then(res=>{
          console.log(res)
          if(!(res.success)){
            setError(res.error.response.data.message)
            setVerify('')
          }else{
            setError('')
            setVerify(res.data)
          }
        })
      }else{
        setError('Passwords do not match')
      }
    } else if(!isSignup){
      dispatch(signin(form, navigate))
      .then(res=>{
        console.log(res)
        if(res.error){
          console.log(res.error.response.data.message)
          setError(res.error.response.data.message)
        }
      })
    }
  };

  const forgotPass = () => {
    console.log(form)

    navigate('/forgotPassword')
  }

  const googleSuccess = async (res) => {
    // const result = res?.profileObj;
    const token = {token :res?.tokenId}
    console.log(token)

    try {
      dispatch(googlelogin(token,navigate))
      // dispatch({ type: AUTH, data: { result, token } });
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

  const handleChange = (e) =>{
    console.log(e.target.value)
    console.log(e.target.name)
    setForm({ ...form, [e.target.name]: e.target.value })
    console.log(form.email)
  };

  return (
    <Container component="main" className={classes.main} maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2}>
            {isSignup && (
              <>
                <Input name="firstName" value={firstName} label="First Name" handleChange={handleChange} autoFocus half />
                <Input name="lastName" value={lastName} label="Last Name" handleChange={handleChange} half />
              </>
            )}
            <Input name="email" value={email} label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" value={password} label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {error!=='' && <Grid item style={{color:"red"}} xs={12} sm={ 12}>{error}</Grid>}
            {verify!=='' && <Grid item style={{color:"blue"}} xs={12} sm={ 12}>{verify}</Grid>}
            {!isSignup &&
              <Button onClick={forgotPass}>
                Forgot Password?
              </Button>
            }
            {isSignup && <Input name="confirmPassword" value={confirmPassword} label="Repeat Password" handleChange={handleChange} type="password" />}
          </Grid>
          
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <Typography className={classes.google} component="h1" variant="h6">{isSignup ? '' : 'Or continue with google'}</Typography>
          {!isSignup &&
            <GoogleLogin
              clientId="982104515755-ofkcn62aqcidkj43hc0vus487cav9mh6.apps.googleusercontent.com"
              render={(renderProps) => (
                <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                  Google Sign In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleError}
              cookiePolicy="single_host_origin"
            />
          }
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode} >
                {isSignup ? 'Already have an account? Sign in' : <p className={classes.as}>Don't have an account? Sign Up</p>}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
    
  );
};

export default Auth;