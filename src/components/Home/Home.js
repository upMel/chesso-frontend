import React, { useState, useEffect } from 'react';
// import Chessboard from 'react-simple-chessboard';

import { DataGrid } from '@mui/x-data-grid';
// import useChess from 'react-chess.js';
import { Avatar, Badge,Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getUsers } from '../../actions/users';
import { Link} from 'react-router-dom';
import WithMoveValidation from '../Chessboard/WithMoveValidation';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import RandomVsRandom from '../Chessboard/integrations/RandomVsRandom'
// import Demo from '../Chessboard/Demo';
import useStyles from './styles';

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const classes = useStyles();
  const navigate = useNavigate
  const location = useLocation
  const dispatch = useDispatch();
  const [users,setUsers]= useState([]);
  const columns =[
    
    {field : 'elo', headerName:'Elo', width:100},
    {field : 'name',
     headerName:'Username',
      width:200,
      valueGetter: (params) =>
    `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
    { field: 'isOnline', headerName: 'Status', width: 195, valueGetter: (params) =>`${params.row.isOnline ? 'online': 'offline'}`},
    
  ];

  useEffect(() => {
    dispatch(getUsers())
      .then(res => setUsers(res.data.data))
      
  }, [dispatch]);

  

  return (

    <Container>
      
        <Grid style={boardsContainer}>
          <div style={welcome}>

          <Typography variant='h4' align='center'>Welcome to Chesso </Typography>
          <Typography variant='h5' align='center'>Play online chess or invite friends to play with</Typography>
          {!user &&(
            <>
            <Typography variant='h6' style={{marginTop:"20px"}} align='center'>Sign up now and start playing</Typography>
            <Button  size={'large'} variant='contained' style={{backgroundColor:'#283593',width:'200px'}}  href={'http://localhost:3000/auth'}>Sign Up</Button>
            </>

          )}
          {user?.result?.role === 'guest' && (
          <Button   variant='contained' className={classes.play} size={'large'}  component={Link} to="/play">Play now</Button>
          )}
          </div>
          <Container style={newtochess}>
            <Typography variant='h6'  align='center'>New to chess?Don't worry we got you covered. Check <a style={{color:'inherit'}} href="https://www.dicebreaker.com/games/chess/how-to/how-to-play-chess">this article</a> to learn more about chess.</Typography>
          
          </Container>
          <div >
          <Typography variant='h4'  align='center'>Random move chess</Typography>
            <RandomVsRandom boardWidth={400} />
          </div>
          <div>

          <Typography variant='h4' align='center'>Leaderboard</Typography>
          <Paper style={sas}>
            <DataGrid
            initialState={{
              sorting: {
                sortModel: [{ field: 'elo', sort: 'desc' }],
              },
            }}
              getRowId={(row) => row._id}
              rows={users}
              columns={columns}
              disableSelectionOnClick
              pageSize={6}
              rowsPerPageOptions={[6]}
              disableColumnMenu
              disableExtendRowFullWidth={true}  
              loading={!users}
              />
          </Paper>
          </div>

          

        </Grid>
      {/* )
      } */}
    </Container>

  );



}

export default Home;


/* <Container style={{width:'600px',height:'600px'}}>
            <WithMoveValidation />
        </Container> */

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  width: 'auto',
  marginTop: 30,
  marginBottom: 150,
  gridColumnGap: 80,
  gridRowGap: 20,
  alignItems:'flex-end'
};
const vsv = {
  width: '400px',
  height: '700px',
  backgroundColor: 'black'

}
const sas ={
  height : '423px',
  width : '500px',
  opacity : '0.95'
}
const welcome ={
  display:'flex',
  width:'-webkit-fill-available',
  flexDirection :'column',
  alignItems:'center',
 

}
const newtochess={
  display:'flex',
  width:'-webkit-fill-available',
  flexDirection :'column',
  alignItems:'center',
  marginBottom:'2rem'
}