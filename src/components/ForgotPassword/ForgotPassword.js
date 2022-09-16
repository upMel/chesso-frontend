import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import Input from '../Auth/Input';
import useStyles from './styles'
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';

const initialState = { email: '' };

const ForgotPassword = () => {
    const [form, setForm] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error,setError]= useState('')
    const [forgot,setForgot]=useState('')
    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(forgotPassword(form, navigate))
        .then(res=>{
            console.log(res)
            if(!(res.status === 200)){
              setError(res.error.response.data.message)
              setForgot('')
            }else{
              setError('')
              setForgot(res.data.data)
            }
          })
        
     }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const classes = useStyles();
    return (

        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h5">Forgot Password?</Typography>
                {forgot!=='' && <Grid item style={{color:"blue"}} xs={12} sm={ 12}>{forgot}</Grid>}
                        {error!=='' && <Grid item style={{color:"red"}} xs={12} sm={ 12}>{error}</Grid>}
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Input name="email" label="Enter Email Address" handleChange={handleChange} type="email" />
                     
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        Submit
                    </Button>
                </form>
            </Paper>
        </Container>

    )
}

export default ForgotPassword