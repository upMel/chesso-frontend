import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  
  play:{
    backgroundColor:'#000000',
    color:'#ffffff',
    '&:hover': {
      backgroundColor: '#282424',
      color: '#ffffff',
  }, 
},

scoreboard:{
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#00ff00'
  },
  "&.MuiToggleButton-root": {
    color: "white",
    backgroundColor: '#000000'
  },
  "&.MuiToggleButton-root.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#000000'
  }
  
}

}));