import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
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
    play:{
      marginTop:"20px",
      width:'300px',
      backgroundColor:'#000000',
      color:'#ffffff',
      '&:hover': {
        backgroundColor: '#282424',
        color: '#ffffff',
    },
    },

}));