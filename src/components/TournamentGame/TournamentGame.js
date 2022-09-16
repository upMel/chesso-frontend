import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Divider, Button, Paper, Box, Grid, Typography, Container } from '@material-ui/core';
import WithMoveValidation from '../Chessboard/WithMoveValidation';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import io from 'socket.io-client'
import Timer from '../Game/Timer'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useStyles from './styles';
// import { useRef, useState } from 'react';
//////////////////////
// import MoveItem from './MoveItem'
//////////////////////
import { Chess } from 'chess.js';

import { Chessboard } from 'react-chessboard';
import { width } from '@mui/system';
let socket
const ENDPOINT = 'http://localhost:5000'

let timerId
const TournamentGame = ({time,code,priv}) => {
  const theme = useTheme('');
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [opponent, setOpponent] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  let roomcode = searchParams.get("roomcode")
  let tournamentroom =searchParams.get("tournamentroom")
  const [roomFull, setRoomFull] = useState(false)
  const [playerColor, setPlayerColor] = useState('')
  const player = { id: user?.result._id, elo: user?.result.elo, username: user?.result.firstName }
  const [gameOver, setGameOver] = useState(false)
  const [privacy, setPrivacy] = useState()
  // const [disable, setDisable] = React.useState(false);
  
  //Timer
  
  const [turn, setTurn] = useState(0)
  const [playerMin, setPlayerMin] = useState(time)
  const [playerSec, setPlayerSec] = useState(60)
  const [opponentMin, setOpponentMin] = useState(time)
  const [opponentSec, setOpponentSec] = useState(60)
  //////////////////////
  const [moveHistory, setMoveHistory] = useState(JSON.parse(localStorage.getItem('movehistory')) || [])
  /////////////////////////

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if(privacy){
        // setRound(round => round +1)
        navigate(`/tournament/private?roomcode=${tournamentroom}`)
    }else if(!privacy){
        // setRound(round => round +1)
        navigate(`/tournament?roomcode=${tournamentroom}`)
    }

  };

  

  //
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [optionSquares, setOptionSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  //
  const [outcome, setOutcome] = useState()
  const [ draw , setDraw ] = useState(false)


  useEffect(() => {
    const connectionOptions = {
      "forceNew": true,
      "reconnectionAttempts": "Infinity",
      "transports": ["websocket"]
    }

    socket = io.connect(ENDPOINT, connectionOptions)

    //cleanup on component unmount
    return function cleanup() {
      localStorage.removeItem("movehistory");
      socket.emit('playerDisconnected', (user?.result.id))
      //shut down connnection instance
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    if (turn >= 1) {
      timerId = window.setInterval(startTimer, 1000)
      if (game.game_over() || gameOver) {
        clearInterval(timerId)
      }
      return () => clearInterval(timerId)
    }

  }, [playerSec, opponentSec, game.turn(), opponentMin, playerMin])

  useEffect(() => {
    if (game.game_over()) {
      localStorage.removeItem("movehistory");
      if (!game.in_draw()) {
        setGameOver(true)
        setOpen(true)
        if (game.turn() === playerColor.slice(0, 1)) {
          setOutcome(false)
          let outcome1 = 0
          socket.emit('statusChange','Pending',tournamentroom,user.result._id)
          socket.emit('roundOver', playerColor, roomcode, outcome1,tournamentroom)
          // socket.on('elo', elo => {
          //   user.result.elo = elo
          //   localStorage.setItem('profile', JSON.stringify(user))
          // })
        } else {
          setOutcome(true)
          let outcome2 = 1
          socket.emit('statusChange','Pending',tournamentroom,user.result._id)
          socket.emit('roundOver', playerColor, roomcode, outcome2,tournamentroom)
          // socket.on('elo', elo => {
          //   user.result.elo = elo
          //   localStorage.setItem('profile', JSON.stringify(user))
          // })
        }
      } else {
        setGameOver(true)
        setOpen(true)
        setDraw(true)
        let outcome2 = 0.5;
        socket.emit('statusChange','Pending',tournamentroom,user.result._id)
        socket.emit('roundOver', playerColor, roomcode, outcome2,tournamentroom)
      }
    }

    setTurn(prevTurn => prevTurn + 1)
    if (turn > 1) {
      setMoveHistory(prev => [...prev, game.history()[game.history().length - 1]])
      localStorage.setItem('movehistory', JSON.stringify([...moveHistory]));
    } else {
      setMoveHistory(game.history())
      localStorage.setItem('movehistory', JSON.stringify([...moveHistory]));
    }
  }, [game.turn()])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinedGame', (player), { room: roomcode }, (error) => {
        if (error) {
          setRoomFull(true)
        }
      })
      socket.emit('getInfo',tournamentroom)
    });
  }, [])


  useEffect(() => {
    socket.on('Roundinfo',(time,password)=>{
        console.log(time,password)
        setPlayerMin(time)
        setOpponentMin(time)
        setPrivacy(password)
        
        
    })

    socket.on('opponentMove', (from, to) => {
      // attempt to make move
      const gameCopy = { ...game };
      gameCopy.move({
        from: from,
        to: to,
        promotion: 'q' // always promote to a queen for example simplicity
      });
      setGame(gameCopy);
    })
    socket.on('color', (color) => {
      setPlayerColor(color)
    })
    socket.on('opponentJoined', (roomCode) => {
      let fen = game.fen()
      let history = game.history()
      let pgn = game.pgn()

      socket.emit('loadfen', fen, pgn)

    })
    socket.on('fen', (fen, pgn) => {
      game.load_pgn(pgn)
      game.load(fen)

      const gameCopy = { ...game };
      setGame(gameCopy)
    })
    socket.on('roomData', ({ users }) => {
      setUsers(users)
      if (users[1]) {
        if (user?.result._id !== users[0].id) {
          setOpponent(users[0])
          setLoaded(true)
        } else {
          setOpponent(users[1])
          setLoaded(true)
        }
      }

    })
    socket.on('elo', elo => {
      user.result.elo = elo
      localStorage.setItem('profile', JSON.stringify(user))
    })
  }, [])

  useEffect(() => {
    socket.on('opponentConcede', (color) => {
      console.log(color)
      let color1
      if(color === 'white'){
        color1='black'
      }else{
        color1='white'
      }
      setGameOver(true)
      setOpen(true)
      setOutcome(true)
      let outcome1 = 1
      console.log(playerColor)
      console.log(color1)
      socket.emit('statusChange','Pending',tournamentroom,user.result._id)
      socket.emit('roundOver', color1, roomcode, outcome1,tournamentroom)
     
      clearInterval(timerId)
    })
  }, [])

  const startTimer = () => {
    let pColor = playerColor.slice(0, 1)
    if (pColor === game.turn()) {
      if (playerSec === 60) {
        setPlayerMin(playerMin => playerMin - 1)
      }
      setPlayerSec(playerSec => playerSec - 1)
      if (playerSec === 0) {
        if (playerSec === 0 && playerMin === 0) {
          setGameOver(true)
          setOpen(true)
          setOutcome(false)
          let outcome1 = 0
          socket.emit('statusChange','Pending',tournamentroom,user.result._id)
          socket.emit('roundOver', playerColor, roomcode, outcome1,tournamentroom)
          // socket.on('elo', elo => {
          //   user.result.elo = elo
          //   localStorage.setItem('profile', JSON.stringify(user))
          // })
          clearInterval(timerId)
        }
        setPlayerSec(60)
      }
    } else {
      if (opponentSec === 60) {
        setOpponentMin(opponentMin => opponentMin - 1)
      }
      setOpponentSec(opponentSec => opponentSec - 1)
      if (opponentSec === 0) {
        if (opponentSec === 0 && opponentMin === 0) {
          setGameOver(true)
          setOpen(true)
          setOutcome(true)
          let outcome2 = 1
          socket.emit('statusChange','Pending',tournamentroom,user.result._id)
          socket.emit('roundOver', playerColor, roomcode, outcome2,tournamentroom)
          // socket.on('elo', elo => {
          //   user.result.elo = elo
          //   localStorage.setItem('profile', JSON.stringify(user))
          // })
          clearInterval(timerId)
        }
        setOpponentSec(60)
      }
    }
  }

  const concede = () => {
    // setDisable(true)
    setGameOver(true)
    setOpen(true)
    setOutcome(false)
    let outcome = 0
    let concede = true
    console.log(playerColor)
    socket.emit('statusChange','Pending',tournamentroom,user.result._id)
    socket.emit('roundOver', playerColor, roomcode, outcome, tournamentroom,concede,)
    // socket.on('elo', elo => {
    //   user.result.elo = elo
    //   localStorage.setItem('profile', JSON.stringify(user))
    // })
    clearInterval(timerId)
  }

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    if (!gameOver) {
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
      setGame(gameCopy);
      if (move === null) return false;
      setMoveSquares({
        [sourceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
        [targetSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
      });
      socket.emit('move', (sourceSquare), (targetSquare), (roomcode))

      return move;
    }
  }

  function onMouseOverSquare(square) {
    if (playerColor[0] === game.turn()) {

      getMoveOptions(square);
    }
  }
  // axreiasto
  function onPieceClick(square) {
    console.log(playerColor[0])
    // if(game.turn)

    //getMoveOptions(square);
  }

  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
  }


  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
  }

  function onSquareRightClick(square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  function onSquareClick(square) {
    if (!gameOver) {
      setRightClickedSquares({});
      setOptionSquares({})
      if (playerColor[0] === game.turn()) {
        function resetFirstMove(square) {
          setMoveFrom(square);
          getMoveOptions(square);
        }

        // from square
        if (!moveFrom) {
          resetFirstMove(square);
          return;
        }

        // attempt to make move
        const gameCopy = { ...game };
        const move = gameCopy.move({
          from: moveFrom,
          to: square,
          promotion: 'q' // always promote to a queen for example simplicity
        });
        setGame(gameCopy);
        socket.emit('move', (moveFrom), (square), (roomcode))
        // if invalid, setMoveFrom and getMoveOptions
        if (move === null) {
          resetFirstMove(square);
          return;
        }
      }
    }
  }
  return (

    <>

      {user?.result && (
        <Grid style={boardsContainer}>
          <Grid>
            <Box style={p1header}>
              {loaded ?
                (
                  <Typography style={opponentHeader}>
                    {opponent.name} ({opponent.elo})
                  </Typography>
                )
                : <Typography style={opponentHeader}>
                  loading...
                </Typography>
              }
              <Timer min={opponentMin} sec={opponentSec} />
            </Box>
            <div style={chessboard}>
              <Chessboard
                id="WithMoveValidation"
                animationDuration={200}
                arePremovesAllowed={true}
                boardOrientation={playerColor}
                boardWidth={(window.innerWidth < 400 ? 350 : 700)}
                isDraggablePiece={({ piece }) => piece[0] === playerColor[0]}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onMouseOverSquare={onMouseOverSquare}
                onMouseOutSquare={onMouseOutSquare}
                // arePiecesDraggable={true}
                position={game.fen()}
                onPieceDrop={onDrop}
                onPieceClick={onPieceClick}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }}
                customSquareStyles={{
                  ...moveSquares,
                  ...optionSquares,
                  ...rightClickedSquares

                }}
                ref={chessboardRef}
              />
              {gameOver && (
                <Dialog
                  fullWidth={true}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                  disableScrollLock={true}
                >
                  <DialogTitle id="responsive-dialog-title">
                    {"Game over"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      The game is over. {draw ? 'The game resulted in draw':outcome ? 'You won the game.' : 'You lost the game.'}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                      Return to tournament dashboard
                    </Button>
                  </DialogActions>
                </Dialog>
              )

              }
            </div>

            <Box style={p1header}>
              <Typography style={userHeader}>
                {user.result.firstName} ({user.result.elo})
              </Typography>
              <Timer min={playerMin} sec={playerSec} />
            </Box>
          </Grid>
          <Paper style={vsv} >
            <Grid style={overflow}>
              <Typography style={gameAnalysis} variant="h5" align='center' component="h2">Game analysis</Typography>
              <Divider style={divider} />
              {game.history().length >= 1 ? (
                <Grid style={grid}>
                  <Typography style={{ width: '200px', height: '30px' }} variant='h6' align='center' component={'div'}>White</Typography>
                  <Typography style={{ width: '200px', height: '30px' }} variant='h6' align='center' component={'div'}>Black</Typography>
                  <Divider style={{ width: '400px', backgroundColor: 'black' }} />

                  {moveHistory.map((move, index) => (
                    <div style={{ width: '200px', height: '30px', textAlign: 'center', border: '0.3px solid black' }} key={index}>{index + 1} {move} </div>
                  ))}
                </Grid>
              )
                : (
                  <Typography variant='h6' align='center'>No moves yet</Typography>
                )
              }
            </Grid>
            <Button style={button} disabled={gameOver} onClick={concede} fullWidth={true}>Concede</Button>
          </Paper>         
        </Grid>
      )
      }


    </>
  );



}

export default TournamentGame;

const chessboard = {
  marginBottom: '0.5rem',
  marginTop: '0.5rem'
}

const grid = {
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  height: 'inherit',
  backgroundColor: 'antiquewhite',
  overflow: "overlay"
}
const divider = {
  backgroundColor: 'antiquewhite'
}
const button = {
  backgroundColor: 'burlywood',
  position: 'absolute',
  bottom: '0'
}
const p1header = {
  display: 'flex',
  width: 'auto',
  justifyContent: 'space-between',
  alignItems: 'baseline',

}

const boardsContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  width: 'auto',
  marginTop: 2,
  marginBottom: 80,
  gridColumnGap: 20,
  gridRowGap: 20
};
const gameAnalysis = {
  color: 'burlywood'
};

const vsv = {
  width: '400px',
  height: '700px',
  backgroundColor: '#181717f5',
  position: 'relative'

}
const overflow = {
  height: '630px',

}
const opponentHeader = {

  fontSize: '1.6rem',


}

const userHeader = {

  fontSize: '1.6rem',



}


