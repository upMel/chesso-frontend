import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor:'#CC8327',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  play:{
    backgroundColor:'#000000',
    color:'#ffffff',
    '&:hover': {
      backgroundColor: '#282424',
      color: '#ffffff',
  },
  },
  heading: {
    color:'#000000',
    textDecoration: 'none',
    fontSize: '2em',
    fontWeight: 300,
    paddingRight:'50px',
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginTop: 20,
      justifyContent: 'center',
    },
  },
  logout: {
    marginLeft: '20px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '1em',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'space-between',
    width:"auto"
  },

  badge:{
      '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
        '&::after': {
          position: 'absolute',
         
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          animation: `$ripple 1.4s infinite ease-in-out`,
          border: '1px solid currentColor',
          content:'""',
        },
      },  
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.5)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.0)',
      opacity: 0,
    },
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));