import React, { useEffect, useState } from 'react'
import { Button, Paper,  Typography, Container } from '@material-ui/core';
import useStyles from './styles'
import chess from '../../images/chess.png'
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import io from 'socket.io-client'
import { Link,  useNavigate } from 'react-router-dom';
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
let socket



const ENDPOINT = 'http://localhost:5000'
const Play = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [activeTournament, setActiveTournament] = useState(JSON.parse(localStorage.getItem('tournament')));
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState([]);
    const [waitingToggle, setWaitingToggle]= useState(false)
    const [code , setCode] = useState(Date.now())
    const [tournament, setTournament]= useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [privacy,setPrivacy]=useState(false)
    const [noPlayers, setNoPlayers] = React.useState(8);
    const [clockTime , setClockTime ]= useState(10);

    useEffect(()=>{
        const connectionOptions ={
            "forceNew": true,
            "reconnectionAttempts":"Infinity",
            "transports":["websocket"]
        }

        socket= io.connect(ENDPOINT, connectionOptions)
       
        //cleanup on component unmount
        return function cleanup() {
            socket.emit('waitingDisconnection')
            //shut down connnection instance
            socket.disconnect()
        }
    },[])
    
    useEffect(() => {
        socket.on('waitingRoomData', ({ waiting }) => {
            waiting && setWaiting(waiting)
            console.log(waiting)
        })
        socket.on('randomCode', ({ code }) =>{
            code && setCode(code)
        })
    }, [])

    useEffect(() => {
        !waitingToggle && socket.emit('waitingDisconnection',( user.result))
        waitingToggle && socket.emit('waiting',( user.result))
    }, [waitingToggle])

    useEffect(()=>{
        socket.on('matchFound',({player1,player2,code})=>{
           console.log(player1)
            if(player1._id === user.result._id){                                
                socket && socket.emit('waitingDisconnection',(player1))
                navigate(`/play/online?roomcode=${code}`, { replace: true })
                socket.disconnect()
            }else if(player2._id === user.result._id){              
                socket && socket.emit('waitingDisconnection',(player2))
                navigate(`/play/online?roomcode=${code}`, { replace: true })
                socket.disconnect()
            }
        })
    })

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setWaitingToggle(true)

    };

    const handleClose = () => {
        setAnchorEl(null);
        setWaitingToggle(false)
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    const playFriend = () => {
        navigate(`/play/friend?roomcode=${code}`, { replace: true })
                socket.disconnect()
    }
    
    const playTournament =()=>{
        navigate('/play/tournament',)
    }

    const switchPlay =()=>{
        setTournament((prevTournament) => !prevTournament);
    }

    const handleCreateTournament =()=>{
        console.log(noPlayers,clockTime,privacy)
        setCode(Date.now())
        let creator = { id: user?.result._id, elo: user?.result.elo, username: user?.result.firstName }
        socket.emit('createTournament',noPlayers,clockTime,privacy,creator,code)
        if(privacy){
            localStorage.setItem('tournament',JSON.stringify({ room:`/tournament/private?roomcode=${code}`}))

            navigate(`/tournament/private?roomcode=${code}`,{state:{clockTime : clockTime ,noPlayers : noPlayers , privacy : privacy,creator : user.result.firstName}},{replace:true})
        }else{
            localStorage.setItem('tournament',JSON.stringify({ room:`/tournament?roomcode=${code}`}))

            navigate(`/tournament?roomcode=${code}`,{state:{clockTime : clockTime ,noPlayers : noPlayers , privacy : privacy,creator : user.result.firstName}},{replace:true})
        }
    }   

    const joinTournament =()=>{
        navigate('/jointournament',{replace:true})
    }

    const handleClickOpen = () => {
        setOpenDialog(true);
      };
    
    const handleClickClose = () => {
        setOpenDialog(false);
        setPrivacy(false)
        setClockTime(10)
        setNoPlayers(8)
    };

    const handlePrivacy = () => {
        setPrivacy((prevPrivacy)=> !prevPrivacy)
    }

    const handleChangeNoPlayers = (event) => {
        setNoPlayers(event.target.value)
      };

    const handleChangeClockTime = (event) =>{
        setClockTime(event.target.value)
    } 

    return (

        <Container component="main" maxWidth="xs">

            {tournament ? (
                <Paper className={classes.paper} elevation={3}>
                    <IconButton
                        edge={'start'}
                        style={{marginRight:'auto'}}
                        onClick={() => {
                            setTournament(false)
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography component="h1" variant="h5">Tournament</Typography>
                    <img className={classes.image} src={chess} alt="icon" height="60" />
                    <Stack
                        style={{ width: '100%' }}
                        direction='column'
                        spacing={4}
                    >
                        <Button variant="contained" disabled={activeTournament ? true:false} className={classes.play} onClick={handleClickOpen} startIcon={<PlayArrowIcon />}>
                            Create tournament
                        </Button>
                        <Dialog
                            fullWidth={true}
                            // maxWidth={maxWidth}
                            open={openDialog}
                            onClose={handleClickClose}
                            disableScrollLock={true}

                        >
                            <DialogTitle>Tournament specifications</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You can set the number of players, the privacy and the time of your liking.
                                </DialogContentText>
                                <Box
                                    noValidate
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        m: 'auto',
                                        width: 'fit-content',
                                    }}
                                >
                                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                                        <InputLabel htmlFor="#-players"># of players</InputLabel>
                                        <Select
                                            autoFocus
                                            value={noPlayers}
                                            onChange={handleChangeNoPlayers}
                                            label="noPlayers"
                                            inputProps={{
                                                name: '#-players',
                                                id: '#-players',
                                            }}
                                        >
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={8}>8</MenuItem>
                                            <MenuItem value={16}>16</MenuItem>
                                            <MenuItem value={32}>32</MenuItem>
                                        </Select>
                                        
                                    </FormControl>
                                    <FormControl sx={{ mt: 2, minWidth: 120 }}>
                                        <InputLabel htmlFor="clockTime">time per match</InputLabel>
                                        <Select
                                            
                                            value={clockTime}
                                            onChange={handleChangeClockTime}
                                            label="clockTime"
                                            inputProps={{
                                                name: 'clocktime',
                                                id: 'clocktime',
                                            }}
                                        >
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={15}>15</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                        </Select>
                                        
                                    </FormControl>

                                    <FormControlLabel
                                        sx={{ mt: 1 }}
                                        control={
                                            <Switch checked={privacy} onChange={handlePrivacy} />
                                        }
                                        label="Private"
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions style={{justifyContent:'space-between'}}>
                                <Button size={'large'} color='primary' variant='contained' onClick={handleCreateTournament}>Create</Button>
                                <Button size={'large'} onClick={handleClickClose}>Close</Button>
                            </DialogActions>
                        </Dialog>
                        <Button variant="contained" disabled={activeTournament ? true:false} className={classes.play} onClick={joinTournament} startIcon={<PlayArrowIcon />}>
                           Join tournament
                        </Button>

                    </Stack>
                </Paper>
            ) : (
                <Paper className={classes.paper} elevation={3}>
                    <Typography component="h1" variant="h5">Play Chess</Typography>
                    <img className={classes.image} src={chess} alt="icon" height="60" />

                    <Stack
                        style={{ width: '100%' }}
                        direction='column'
                        spacing={4}
                    >
                        < Button aria-describedby={id} title="Queue online and compete against players with similar skill" variant="contained" className={classes.play} onClick={handleClick} startIcon={<PlayArrowIcon />}>
                            Play Online
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            // disableScrollLock={ true }
                            anchorOrigin={{
                                vertical: "center",
                                horizontal: "right"
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                            }}
                            PaperProps={{
                                style: {
                                    backgroundColor: "transparent",
                                    boxShadow: "none",
                                    borderRadius: 0
                                }
                            }}
                        >
                            <Box className={classes.arrow} />
                            <Box className={classes.queue}>
                                <CircularProgress size={30} sx={{ color: 'black', ml: '8px' }} />
                                <Typography className={classes.text} >{`Finding Match , ${waiting.length} people in queue.`}</Typography>
                                <IconButton
                                    style={{ position: "absolute", top: "", right: "0" }}
                                    onClick={handleClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Popover>
                        <Button variant="contained" className={classes.play} onClick={playFriend} startIcon={<PlayArrowIcon />}>
                            Play with a friend
                        </Button>
                        <Button variant="outlined" startIcon={<PlayArrowIcon />}>
                            Versus Computer
                        </Button>
                        <Button variant="contained" onClick={() => {
                            setTournament(true)
                        }}
                            startIcon={<PlayArrowIcon />}>
                            Tournament
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Container>
    )
}

export default Play