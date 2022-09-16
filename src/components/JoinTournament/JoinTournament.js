import { Container, Snackbar, Paper } from '@material-ui/core'
import Stack from '@mui/material/Stack';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '../Auth/Input';
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:5000'
let socket

const JoinTournament = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();
  const [tournaments, setTournaments] = useState([])
  const [roomIsFull, setRoomIsFull] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword]= useState({password:''})
  const [parameters ,setParameters] =useState()
  const [error ,setError] = useState(false)
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleChange = (e) =>{
    setPassword({ ...password, [e.target.name]: e.target.value })

  }

  const handleClose = () => {
    setPasswordModal(false);
  };

  const columns = [
    { field: 'room', headerName: 'Room Id', flex: 1 },
    {
      field: 'tournament', headerName: 'Tournament', flex: 1,
      valueGetter: (params) =>
        `${params.row.creator.username || ''}(${params.row.creator.elo || ''})`
    },
    {
      field: 'time',
      headerName: 'Clock Time',
      flex: 1,
      //   valueGetter: (params) =>
      // `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'privacy', headerName: 'Privacy', flex: 1,
      valueGetter: (params) =>
        `${params.row.privacy ? 'private' : 'open'}`
    },
    {
      field: 'seats', headerName: 'Seats', flex: 1,
      valueGetter: (params) =>
        `${params.row.players.length || ''}/${params.row.noPlayers || ''}`,
    }
  ];

  useEffect(() => {
    const connectionOptions = {
      "forceNew": true,
      "reconnectionAttempts": "Infinity",
      "transports": ["websocket"]
    }

    socket = io.connect(ENDPOINT, connectionOptions)

    //cleanup on component unmount
    return function cleanup() {
      socket.emit('waitingDisconn')
      //shut down connnection instance
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('getTournaments');

    })
    socket.on('allActiveTournaments', (tournaments) => {
      console.log(tournaments)

      setTournaments(tournaments)
    })
  }, [])

  const enterPassword = () => {
    console.log(parameters.privacy)
    console.log(password.password)
    if(password.password === parameters.privacy ){
      localStorage.setItem('tournament',JSON.stringify({ room:`/tournament/private?roomcode=${parameters.room}`}))

      navigate(`/tournament/private?roomcode=${parameters.room}`, { replace: true })
    }else{
      setError(true)
    }

  }

  const handleRowClick = (params, event) => {
    if (params.row.players.length < params.row.noPlayers) {
      if (params.row.privacy) {
        //h function call pou na kanei auto to state ture kai na pernaei kai ta params
        setParameters(params.row)
        setPasswordModal(true)
        // enterPassword(params)
      } else {
        localStorage.setItem('tournament',JSON.stringify({ room:`/tournament?roomcode=${params.row.room}`}))

        navigate(`/tournament?roomcode=${params.row.room}`, { replace: true })
      }
    } else {
      setRoomIsFull(true)
    }
  };

  console.log(tournaments)

  return (
    <Container>
      <Paper style={sas}>
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: 'seats', sort: 'desc' }],
            },
          }}
          onRowClick={handleRowClick}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No available tournaments right now
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                Local filter returns no result
              </Stack>
            )
          }}
          getRowId={(row) => row.creator.id}
          rows={tournaments}
          columns={columns}
          disableSelectionOnClick
          autoPageSize={true}
          //   pageSize={10}
          //   rowsPerPageOptions={[6]}
          disableColumnMenu
          disableExtendRowFullWidth={true}
          loading={!tournaments}
        />
        <Dialog open={passwordModal} onClose={handleClose}>
          <DialogTitle>Private Tournament</DialogTitle>
          <DialogContent>
            <DialogContentText style={{marginBottom:'5px'}}>
              Please enter the tournament password.
            </DialogContentText>
            <Input
              error={error}
              name="password"
              value={password}
              label="Password"
              handleChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              handleShowPassword={handleShowPassword} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={enterPassword}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Paper>
      {roomIsFull && (
        <Snackbar
          open={roomIsFull}
          onClose={() => setRoomIsFull(false)}
          autoHideDuration={2000}
          message="Room is full"
        />
      )}
    </Container>
  )
}

export default JoinTournament

const sas = {
  height: '600px',
  width: 'auto',
  opacity: '0.87'
}