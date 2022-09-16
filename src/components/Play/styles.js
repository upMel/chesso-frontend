import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),

  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  googleButton: {
    marginBottom: theme.spacing(2),
  },
  queue: {
    boxSizing: 'border-box',
    backgroundColor: 'grey',
    width:'364px',
    height:'50px',
    marginLeft:'12px',
    display: 'flex',
    alignItems: 'center',
    
  },
  arrow: {
    position: "relative",
    marginTop: "10px",
    "&::before": {
      backgroundColor: "grey",
      content: '""',
      display: "block",
      position: "absolute",
      width: 12,
      height: 12,
      top: "calc(50% + 16px)",
      transform: "rotate(45deg)",
      left: 6,
    }
  },
 text:{
  marginLeft:'15px'
 },
  choice: {
    display: 'flex'
  },
  play: {
    marginTop: '22px',
    width: '100%',
  }
}));