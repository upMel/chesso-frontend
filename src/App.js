import React, { useState, useEffect } from 'react';

import Home from './components/Home/Home';

import { useDispatch } from 'react-redux';
import { getUsers } from './actions/users';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@material-ui/core'
import styled from 'styled-components';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import Edit from './components/Edit/Edit';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Footer from './components/Footer/Footer';
import Verify from './components/Verify/Verify';
import Play from './components/Play/Play';
import PlayFriend from './components/PlayFriend/PlayFriend'
import Game from './components/Game/Game'
import Admin from './components/Admin/Admin'
import Tournament from './components/Tournament/Tournament'
import JoinTournament from './components/JoinTournament/JoinTournament';
import TournamentGame from './components/TournamentGame/TournamentGame';
const App = () => {

  
const [time , setTime ] = useState();
const [priv , setPriv ] = useState();
const [code , setCode ] = useState();
// const [round ,setRound ] = useState(1);
  // useEffect(() => {
  //   dispatch(getUser('622b3e05be69e2bafb4dfcad'));s
  // }, [dispatch]);

  return (
    <BrowserRouter>

      <Container maxWidth="lg" >
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/jointournament" exact element={<JoinTournament />} />
          <Route path="/admin" exact element={<Admin />} />
          <Route path='/tournament' exact element={<Tournament setTime={setTime} setCode={setCode} setPriv={setPriv} />}/>
          <Route path='/tournament/private' exact element={<Tournament setTime={setTime} setCode={setCode} setPriv={setPriv}  />}/>
          <Route path="/auth" exact element={<Auth />} />
          <Route path="/edit" exact element={<Edit />} />
          <Route path="/play" exact element={<Play />} />
          <Route path="/play/tournament" exact element={<TournamentGame time={time} code={code} priv={priv} />} />
          <Route path="/play/online" exact element={<Game />} />
          <Route path="/play/friend" exact element={<PlayFriend />} />
          <Route path="/forgotPassword" exact element={<ForgotPassword />} />
          <Route path="/resetPassword/:resetToken" exact element={<ResetPassword />} />
          <Route path="/verify/:validationToken" exact element={<Verify />} />
        </Routes>
        
      </Container >
      <Footer />
    </BrowserRouter>
  );
}
export default App;

// const AppBody = styled.div`
//   display:flex;
//   height:100vh;
// `;
//  <Route path="/auth" exact element={<Auth/>} />
{/* <Route path="/edit" exact element={<Edit/>} /> */ }

