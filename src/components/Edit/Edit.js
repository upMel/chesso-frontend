import React, { useState, useEffect } from 'react';
import { Avatar, IconButton, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import useStyles from './styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actionType from '../../constants/actionTypes';
import { deleteUser } from '../../actions/users';
import { FaEdit } from 'react-icons/fa';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '../Auth/Input';
import ToggleButton from '@mui/material/ToggleButton';
import { updateDetails,uploadImage, changePassword } from '../../actions/auth';
import FileBase from 'react-file-base64';

const Edit = () => {
  const [file, setFile] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const initialState = { firstName: user?.result.firstName, lastName: user?.result.lastName, email: user?.result.email, currentPassword: '', newPassword: '', confirmpassword: '' };
  const theme = useTheme(initialState);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [btnDisable, setbtnDisable] = useState(true);
  const [form, setForm] = useState(initialState);
  const [password, setPassword] = useState(false)
  const { firstName, lastName, email, currentPassword, newPassword, confirmpassword, picture } = form
  const PF = "http://localhost:5000/public/"
  const deleteAcc = (id) => {

    dispatch(deleteUser(id))
    dispatch({ type: actionType.LOGOUT });

    navigate('/auth');
    setUser(null);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {

    setPassword(false)
    setForm(initialState)
    setEdit((prevEdit) => !prevEdit)
    console.log(form)

  }
  useEffect(() => {
    console.log(form.firstName)
    console.log(user.result.firstName)
    if (edit) {
      if (form.firstName === user.result.firstName
        && form.lastName === user.result.lastName
        && form.email === user.result.email) {
        setbtnDisable(true)
      } else {
        setbtnDisable(false)
      }
    }
    if (password) {
      if ((form.confirmpassword === form.newPassword) && form.currentPassword) {
        setbtnDisable(false)
      } else {
        setbtnDisable(true)
      }

    }
  }, [form])

  const handleSubmit = (e) => {
    e.preventDefault();
    //kapoio dispatch
    console.log(edit)
    if(file){
      const data = new FormData();
      const filename = Date.now() + file.name;
      console.log(file)
      data.append('name',filename);
      data.append('file',file);
      console.log(data)
      /////prwta to upload 
      dispatch(uploadImage(data,navigate))
      /// kai edw to update
    }
    if (edit) {
      
      const data = { firstName, lastName, email }
      dispatch(updateDetails(data, navigate))
    } else if (password) {
      const data = { currentPassword, newPassword }
      dispatch(changePassword(data, navigate))
    }

  }

  const handlechangePassword = () => {
    setPassword((prev) => !prev)
    setForm(initialState)
    console.log(form)

  }

  const handleChange = (e) => {
    console.log(e.target.value)
    console.log(e.target.name)
    setForm({ ...form, [e.target.name]: e.target.value })

    console.log(form)
    // console.log(user.result.firstName)
    // console.log(user.result.sub)

  };
  //edw mporw na valw na allazei th fotografia tou sto avatarm
  //<div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setForm({ ...form, selectedFile: base64 })} /></div>
  return (
    <Container component="main" className={classes.container} maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <Grid className={classes.grid} container spacing={2}>
        
          <form className={classes.picture} onSubmit={handleSubmit}>
            <IconButton variant='contained' component="label" htmlFor="fileInput">
              <Avatar className={classes.avatar} src={file ? URL.createObjectURL(file) : user?.result.picture} >  
              </Avatar>
            </IconButton>
            <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  name='file'
                  onChange={(e) => setFile(e.target.files[0])}
                ></input>
                <Button type='Submit' className={classes.upload}>Upload</Button>
          </form>
          <Typography variant='h5'>Elo :{user?.result.elo}</Typography>
          <ToggleButton value='edit' selected={edit} className={classes.edit} onClick={handleEdit}><FaEdit /></ToggleButton>
        </Grid>
        {!edit &&
          <>
            <Grid className={classes.grid} container spacing={2}>
              <Typography className={classes.typo} variant="h6">Firstname : {user?.result.firstName} </Typography>
              <Typography className={classes.typo} variant="h6">Lastname : {user?.result.lastName} </Typography>
              <Typography className={classes.typo} gutterBottom variant="h6">Email : {user?.result.email} </Typography>
              {!user.result.sub &&
                <Button variant="contained" className={classes.deleteAcc} color="primary" onClick={handlechangePassword}>Change Password</Button>
              }
              <Button variant="contained" className={classes.deleteAcc} color="secondary" onClick={handleClickOpen}>Delete account</Button>
            </Grid>
          </>
        }
        {edit &&

          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid className={classes.grid} container spacing={2}>
              <Typography className={classes.typo2} component="h1" variant="h5" align='center'>Edit your profile</Typography>
              <Input name="firstName" defaultValue={user.result.firstName} label={user?.result.firstName} handleChange={handleChange} autoFocus />
              <Input name="lastName" defaultValue={user.result.lastName} label="Last Name" handleChange={handleChange} />
              {!user.result.sub &&
                <Input name="email" defaultValue={user.result.email} label="Email Address" handleChange={handleChange} type="email" />
              }
              <Button type="submit" disabled={btnDisable} fullWidth variant="contained" color="primary" className={classes.submit}>
                Submit
              </Button>
            </Grid>
          </form>

        }
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          disableScrollLock={ true }
        >
          <DialogTitle id="responsive-dialog-title">
            {"Delete Account"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your account? This will permanently erase your account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => deleteAcc(user?.result._id)} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {password &&
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid className={classes.grid} container spacing={2}>
              <Typography className={classes.typo2} component="h1" variant="h5" align='center'>Change your password</Typography>
              <Input name="currentPassword" type='password' label='Current Password' handleChange={handleChange} autoFocus />
              <Input name="newPassword" type='password' label="New Password" handleChange={handleChange} />
              <Input name="confirmpassword" type='password' label="Retype new password" handleChange={handleChange} />
              <Button type="submit" disabled={btnDisable} fullWidth variant="contained" color="primary" className={classes.submit}>
                Save Changes
              </Button>
            </Grid>
          </form>
        }
      </Paper>
    </Container>
  )
}

export default Edit;


// () => deleteAcc(user?.result._id)