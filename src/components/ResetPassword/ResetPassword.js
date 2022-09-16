import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import Input from '../Auth/Input';
import useStyles from './styles'
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../actions/auth';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = { password: '', confirmPassword: '' };

const ResetPassword = () => {
    const [form, setForm] = useState(initialState);
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const resetToken = params.resetToken;

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password === form.confirmPassword) {
            dispatch(resetPassword(form, resetToken, navigate));
        }else{
            console.log('Passwords do not match')
        }
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const classes = useStyles();

    return (

        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h5">Reset Password</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Input name="password" label="Enter new Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />
                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Submit
                        </Button>
                    </Grid>
                </form>
            </Paper>
        </Container>

    )
}

export default ResetPassword