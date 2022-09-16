import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { validateEmail } from '../../actions/auth'
import Spinner from '../Spinner/Spinner';
import useStyles from './styles'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
const Verify = () => {
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const validationToken = params.validationToken;
    const classes = useStyles();

    useEffect(() => {

        if (loading) {
            dispatch(validateEmail(validationToken, navigate))
                .then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        setVerified(true)    
                    }
                    setLoading(false)
                })
                // .catch(err=>{
                //     console.log(err)
                // })
        }
    }, [])


    if (loading) return (
        <Spinner />
    )
    console.log(verified)
    if (verified) return (
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h5">Verified</Typography>
                <Typography> Return to <Link style={{ color: 'blue', textDecoration: 'underline' }} to='/'>homepage</Link> to sign in</Typography>
            </Paper>
        </Container>
       
    )

    if (!verified) return (
        <Container component="main" maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
            <Typography component="h1" variant="h5">User not found, you may already be verified</Typography>
            <Typography> Return to <Link style={{ color: 'blue', textDecoration: 'underline' }} to='/'>homepage</Link> to sign up again</Typography>
        </Paper>
    </Container>
       
    )
}

export default Verify