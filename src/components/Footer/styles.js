import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    papper: {
        position: 'absolute',
        bottom: '0',
        // left: '0',
        // right: '0',
        width: "100%",
        backgroundColor: 'black',
        marginTop: '2rem',
        marginBottom: '-50px'



    },
    grid: {

    },

    contact: {
        height: "auto",



    },
    social: {
        color: theme.palette.primary.main,
        paddingRight:'rem'
    },
    icons: {
        '&:hover':{
            transform: "translateY(-2px)"
        },
        fontSize:'0.75rem',
        color: "rgb(255 255 255)",
        margin:" 0 0.5rem",
        transition: "transform 250ms",
        display: "inline-block",
    },

    copyright: {
        color: theme.palette.primary.main,
    },
    
    copyright2: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
    },


}));