import React, { useState, useEffect } from 'react';
import { AppBar, Box, Typography, Toolbar, Avatar, Button, Grid, Paper, Container } from '@material-ui/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import Input from '../Auth/Input';
import { FaGithub } from 'react-icons/fa';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faFacebook,
    faTwitter,
    faInstagram,
    faGithub
} from "@fortawesome/free-brands-svg-icons";
const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Footer = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const classes = useStyles();
    const [form, setForm] = useState(initialState);
    const handleChange = (e) => {
        console.log(e.target.value)
        console.log(e.target.name)
        setForm({ ...form, [e.target.name]: e.target.value })
        console.log(form.email)
    };
    const handleSubmit = (e) => { }
    useEffect(() => {

    }, [location]);

    return (
        //Skata fix it

        <Paper className={classes.papper} variant="outlined" square >
            <Box className={classes.box} sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,
                borderRadius: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'baseline',
                alignContent: 'center'
            }}>

                <Typography variant="h5" className={classes.social} mt={3}>
                    Follow us :
                </Typography>
                <a href="https://github.com/upMel/Chesso"
                    className={classes.icons}>
                    <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
                <a href="https://github.com/upMel/Chesso"
                    className={classes.icons}>
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                </a>
                <a href="https://github.com/upMel/Chesso"
                    className={classes.icons}>
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
                <a href="https://github.com/upMel/Chesso"
                    className={classes.icons}>
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                </a>
                <a href="https://github.com/upMel/Chesso"
                    className={classes.icons}>
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                {/* <Typography mt={2}>Contact us
                    <Paper className={classes.contact} elevation={3}>


                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={1}>

                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} />
                            </Grid>
                        </form>
                    </Paper>
                </Typography> */}
                {/* <Paper className={classes.contact} elevation={3}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        Hey
                    </form>
                </Paper>
                <Paper className={classes.contact} elevation={3}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        Hey
                    </form>
                </Paper> */}
            </Box>
            <Container className={classes.copyright}   >
                <Typography variant="body2" align='center' >
                    Copyright © 
                    <Typography component={Link} to='/' className={classes.copyright2}>
                        Chesso
                    </Typography>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Paper>

    );
};

export default Footer;