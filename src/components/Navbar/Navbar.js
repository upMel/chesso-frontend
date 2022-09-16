import React, { useState, useEffect } from 'react';
import { AppBar, Badge , Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import chess from '../../images/chess.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { logOut } from '../../actions/auth';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const PF = "http://localhost:5000/public/"
  const [activeTournament, setActiveTournament] = useState(JSON.parse(localStorage.getItem('tournament')));
  
  const logout = () => {
    dispatch(logOut(navigate));
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;
    console.log(activeTournament)
    if (token) {
      const decodedToken = decode(token);
      // console.log(decodedToken)
      if (decodedToken.exp * 1000 < new Date().getTime()){
        //edw prin htan logOut alla epeidh sto logOut sto backend xreiazetai na peraseis apo to middleware tou auth kai den uparxei pleon jwt vgazei not authorized 
        // user?.result.picture && user?.result.picture.startsWith('https') ? user?.result.picture  : PF+user?.result.picture
        // logout()
        dispatch({ type: actionType.LOGOUT });
    

        navigate('/auth', { replace: true })
      }
    }
    setActiveTournament(JSON.parse(localStorage.getItem('tournament')))
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location ]);
  
  

  return (
    <AppBar className={classes.appBar} position="sticky" color="inherit">
      <div className={classes.brandContainer}>
        <img className={classes.image} src={chess} alt="icon" height="60" />
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Chesso</Typography>
        {user?.result?.role === 'guest' &&(

          <Button variant="contained" className={classes.play}  component={Link} to="/play">Play</Button>
          
        )}
        {activeTournament && (
          <Button variant="contained" style={{marginLeft:'8px'}} className={classes.play}  component={Link} to={activeTournament.room}>Tournament</Button>

        )}
        {user?.result?.role === 'admin' &&(
          <Button variant="contained" className={classes.play} color="primary"  component={Link} to="/admin">Admin</Button>
        )}
        
      </div>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Badge
              className={classes.badge}
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              >
              <Avatar component={Link} to='/edit' className={classes.purple} alt={user?.result.firstName} referrerPolicy="no-referrer" src={user?.result.picture}  >{user?.result.firstName.charAt(0)}</Avatar>
            </Badge>
            <Typography className={classes.userName} variant="h6">{user?.result.firstName}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;