import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
export default makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      padding: theme.spacing(2),
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
      },
    },
    avatar: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
      width : '66px',
      height: '66px',
      
    },
    grid: {
      justifyContent: 'space-between',
      padding: theme.spacing(2),
      alignItems:'center'
    },
    edit :{
      
    },
    container :{
      paddingBottom:'105px',
      
    },
    typo :{
      padding: theme.spacing(1),
      width: '100%'
    },
    typo2 :{
      color: theme.palette.primary.main
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    googleButton: {
      marginBottom: theme.spacing(2),
    },
  }));