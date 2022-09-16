import React, { useEffect,useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Link,  useNavigate } from 'react-router-dom';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Button, Container, Box } from '@material-ui/core';
import io from 'socket.io-client'
import { useSearchParams } from 'react-router-dom';
import { ToggleButton } from '@mui/material';
import useStyles from './styles';
const ENDPOINT = 'http://localhost:5000'
let socket



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgb(0 0 0 / 23%)',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
//////////////////////////////
// function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein };
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];
/////////////////////////////////////////////



const Tournament = ({setTime,setCode,setPriv}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const location = useLocation()
    const classes = useStyles();
    const [privacy, setPrivacy] = useState(location.state?.privacy || '')
    const [noPlayers, setNoPlayers] = React.useState(location.state?.noPlayers || 0);
    const [clockTime, setClockTime] = useState(location.state?.clockTime || '');
    const [creator, setCreator] =useState( location.state?.creator || '') 
    const [players , setPlayers] = useState([])
    const [ready , setReady]= useState(false);
    const [scoreboard, setScoreboard] = useState(false);
    const [disabled,setDisabled]= useState(false)
    const [round,setRound ]= useState(JSON.parse(localStorage.getItem('round')) || 0)
    const [player,setPlayer]  = useState({ id: user?.result._id, elo: user?.result.elo, username: user?.result.firstName ,status :'Pending' })
    const [searchParams, setSearchParams] = useSearchParams();
    const [ tournamentOver ,setTournamentOver ] = useState(false)
    const isMounted = useRef(false);
    const navigate = useNavigate();
    let roomcode = searchParams.get("roomcode")

    useEffect(() => {
        const connectionOptions = {
            "forceNew": true,
            "reconnectionAttempts": "Infinity",
            "transports": ["websocket"]
        }

        socket = io.connect(ENDPOINT, connectionOptions)

        //cleanup on component unmount
        return function cleanup() {
            socket.emit('waitingDisconnTournament')
            //shut down connnection instance
            socket.disconnect()
        }
    }, [])

    

    const handleClickReady = () => {
        let status = player.status
        let id = player.id
        console.log(status)
        console.log(id)
        setReady(!ready)
        socket.emit('statusChange',ready,roomcode,id)
    };

 useEffect(()=>{

     setTime(clockTime)
     setCode(roomcode)
     console.log(roomcode)
     setPriv(privacy)
 },[])

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('joinedTournament', player,roomcode);
        })
    }, [])

    

    useEffect(()=>{
        socket.on('info',(password,time,numberofPlayers,creator,gamers)=>{
            setClockTime(time)
            setNoPlayers(numberofPlayers)
            setCreator(creator)
            setPrivacy(password)
            setPlayers(gamers)
            console.log(gamers)
        })
        socket.on('refreshPlayers', ({password,time,noPlayers,creator,gamers})=>{
            
            setClockTime(time)
            setNoPlayers(noPlayers)
            setCreator(creator)
            setPrivacy(password)
            setPlayers(gamers)
           
        })
        socket.on('statusChanged',({gamers,status}) =>{
            console.log(gamers)
            setPlayers(gamers)
            setPlayer((prevState=>({...prevState,status:status})))
            
        })
        socket.on('roundStart',({player1,player2,code,room})=>{
            if(player1.id === user.result._id){   
                navigate(`/play/tournament?tournamentroom=${room}&roomcode=${code}`, { replace: true })                            
                // socket && socket.emit('waitingDisconnection',(player1))
                // navigate(`/play/online?roomcode=${code}`, { replace: true })
                // socket.disconnect()
            }else if(player2.id === user.result._id){    
                navigate(`/play/tournament?tournamentroom=${room}&roomcode=${code}`, { replace: true })          
                // socket && socket.emit('waitingDisconnection',(player2))
                // navigate(`/play/online?roomcode=${code}`, { replace: true })
                // socket.disconnect()
            }
            
        })
    },[])
    
    useEffect(() => {
        if(players.length>0){

            if(round >= noPlayers -1){
                console.log(round, players.length)
                setDisabled(true)
                setTournamentOver(true)
            }else{
                setDisabled(false)
                if(players.length === noPlayers ){
                    let playersReady = players.every(pl => pl.status === 'Ready')
                    if(playersReady){
                        setRound(round=> round+1)
                       
                    }
                }
            }
        }
     },[players])

    useEffect(()=>{
        if (isMounted.current) {
            console.log(round)
           
            
            localStorage.setItem('round', JSON.stringify(round));
            if(players.length> 0){
                
                if(user.result._id === players[0].id){
                    socket.emit('startRound',players,round,roomcode)
                }
            }
          } else {
            isMounted.current = true;
          }
    },[round])

    const handleScoreboard =()=>{
        setScoreboard((prev) => !prev)
    }

    const handleCloseTournament = ()=>{
        localStorage.removeItem('tournament')
        localStorage.removeItem('round')
        navigate('/',{replace:true})

    }
    return (
        <Container style={{ marginTop: '60px',marginBottom:'150px' }} >
            <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "20px" }}>

                <Typography variant='h5' style={{ marginBottom: '15px' }} align='center'>
                    Welcome to {creator} tournament
                </Typography>


                <Paper style={{ width: '200px' }}>
                    <Typography align='center'style={{ fontSize: '1.3rem' }}>Tournament info</Typography>
                    <Typography align='center'>Number of players: {noPlayers}</Typography>
                    <Typography align='center'>Clock time: {clockTime}</Typography>
                    {privacy && (

                    <Typography align='center'>Password &rarr; {privacy }</Typography>
                    )}
                </Paper>
                
                <ToggleButton 
                    value='scoreboard'
                    selected={scoreboard} 
                    className={classes.scoreboard} 
                    // color='primary'
                    onClick={handleScoreboard}>
                        Scoreboard
                </ToggleButton>

                
            </Box>
            {tournamentOver ?( <Typography align='center' variant='h6'>Tournament is over.</Typography>
            ):(
                <Typography align='center' variant='h6'>Tournament Round {round+1}</Typography>

            )}


            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 'auto'}} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell> {scoreboard ? <>&#128100; Username</> : <>&#128100; Username</> }</StyledTableCell>
                            <StyledTableCell align="center">{scoreboard ? 'Ranking' : 'Ranking' }</StyledTableCell>
                            <StyledTableCell align="center">{scoreboard ? 'Wins' : 'ID' }</StyledTableCell>
                            <StyledTableCell align="center">{scoreboard ? 'Total Points' : 'Status' }</StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scoreboard ?
                        (
                        <>
                          {(players.length >= 1 && round>0)?(
                            <>
                           
                            {players.map((row,index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                    &#9830; {row.username}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.elo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.wins}</StyledTableCell>
                                    <StyledTableCell align="center">{row.totalPoints}</StyledTableCell>
                                   
                                </StyledTableRow>
                            ))}
    </>
                        ):(
                            null
                        )}

                        </>
                        ) :(
                        <>
                        {players.length >= 1 ?(
                            <>
                           
                            {players.map((row,index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                    &#9830; {row.username}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.elo}</StyledTableCell>
                                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                                    <StyledTableCell align="center">{row.status}</StyledTableCell>
                                   
                                </StyledTableRow>
                            ))}
    </>
                        ):(
                            null
                        )}

                        </>)}
                        
                    </TableBody>
                </Table>

            </TableContainer>
            <Button variant='contained' disabled={disabled} className={classes.play} onClick={handleClickReady} >{ready ?'Cancel':'Ready'}</Button>
            {tournamentOver ? (<Button variant='contained' className={classes.play} onClick={handleCloseTournament} >Leave tournament</Button>): null}
        </Container>
    )
}

export default Tournament