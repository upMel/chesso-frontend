import { useRef, useState, useEffect } from 'react';
import {Chess} from 'chess.js';

import { Chessboard } from 'react-chessboard';

export default function RandomVsRandom({ boardWidth }) {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [latestTimeout, setLatestTimeout] = useState();

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  useEffect(() => {
    setTimeout(makeRandomMove, 2000);
    return () => {
      clearTimeout(latestTimeout);
    };
  }, []);

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });

    const timeout = setTimeout(makeRandomMove, 2000);
    setLatestTimeout(timeout);
  }

  return (
    <div>
      <Chessboard
        id="RandomVsRandom"
        arePiecesDraggable={false}
        boardWidth={boardWidth}
        position={game.fen()}
        animationDuration={300}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
        ref={chessboardRef}
      />
      <button
        className="rc-button"
        onClick={() => {
          clearTimeout(latestTimeout);
          safeGameMutate((game) => {
            game.reset();
          });
          chessboardRef.current.clearPremoves();
          const timeout = setTimeout(makeRandomMove, 1000);
          setLatestTimeout(timeout);
        }}
      >
        reset
      </button>
    </div>
  );
}