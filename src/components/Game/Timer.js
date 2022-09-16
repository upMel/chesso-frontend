import { Box, Paper, Typography } from "@material-ui/core";
import React from "react";

const Timer = ({min,sec})=>{

   if(sec === 60){
      sec= "00"
   }else if(sec < 10){
      sec = "0" + sec;
   }

   if(min <10 ){
      min = "0" + min
   }
   return(

<Paper style={timeStyles} elevation={5}>
    <span>{min}</span>
      <span>:</span>
      <span>{sec}</span>
</Paper>
    
    )
   };


export default Timer;

const timeStyles ={
   fontSize :'1.6rem',
   width:'70px',
   display:'flex',
   justifyContent:'center'
}