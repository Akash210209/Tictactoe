import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings'; // Import Material-UI settings icon
import './Tictactoe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [playerNames, setPlayerNames] = useState(['', '', '', '', '']);
  const [numPlayers, setNumPlayers] = useState(2);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const initializeBoard = (size) => {
    return Array(size * size).fill(null);
  };

  const boardSize = numPlayers === 2 ? 3 : numPlayers + 2; // 3x3 for 2 players, otherwise adjust

  const winCondition = boardSize >= 4 ? 4 : 3; // Winning condition based on board size

  const checkWinner = (board) => {
    const winningCombinations = [];

    // Rows and Columns
    for (let i = 0; i < boardSize; i++) {
      // Rows
      winningCombinations.push(
        Array.from({ length: boardSize }, (_, j) => i * boardSize + j)
      );
      // Columns
      winningCombinations.push(
        Array.from({ length: boardSize }, (_, j) => j * boardSize + i)
      );
    }

    // Diagonals
    winningCombinations.push(
      Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1))
    ); // Main diagonal
    winningCombinations.push(
      Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1))
    ); // Anti diagonal

    for (let combination of winningCombinations) {
      const [a, b, c] = combination.map((index) => board[index]);
      if (a && combination.every((index) => board[index] === a)) {
        return a;
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = players[currentPlayerIndex].symbol;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(players.find(player => player.symbol === gameWinner)); // Find winner object
    } else if (!newBoard.includes(null)) {
      // Check for a draw
      setWinner({ name: 'Draw', color: '#000000' }); // Set draw color to black
    } else {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard(boardSize));
    setWinner(null);
    setCurrentPlayerIndex(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

//   const handleDialogSubmit = () => {
//     const playerSymbols = ['X', 'O', 'A', 'B', 'C'];
//     const playerColors = [
//       '#00FF00', // Green
//       '#FF0000', // Red
//       '#0000FF', // Blue
//       '#FFFF00', // Yellow
//       '#FF00FF', // Magenta
//     ]; // Colors for players

//     // Check for duplicate names
//     const uniqueNames = new Set(playerNames.slice(0, numPlayers));
//     if (uniqueNames.size < numPlayers) {
//       setErrorMessage('Player names must be unique.'); // Set error message
//       return;
//     }

//     const selectedPlayers = playerNames
//       .slice(0, numPlayers)
//       .map((name, index) => ({
//         name: name || `Player ${index + 1}`,
//         symbol: playerSymbols[index],
//         color: playerColors[index],
//       }));

//     setPlayers(selectedPlayers);
//     setBoard(initializeBoard(boardSize));
//     setDialogOpen(false);
//   };

const handleDialogSubmit = () => {
    const playerSymbols = ['X', 'O', 'A', 'B', 'C'];
    const playerColors = [
      '#00FF00', // Green
      '#FF0000', // Red
      '#0000FF', // Blue
      '#FFFF00', // Yellow
      '#FF00FF', // Magenta
    ]; // Colors for players
  
    // Check for empty names
    if (playerNames.slice(0, numPlayers).some(name => name.trim() === '')) {
      setErrorMessage('Player names cannot be empty.'); // Set error message for empty fields
      return;
    }
  
    // Check for duplicate names
    const uniqueNames = new Set(playerNames.slice(0, numPlayers));
    if (uniqueNames.size < numPlayers) {
      setErrorMessage('Player names must be unique.'); // Set error message for duplicates
      return;
    }
  
    const selectedPlayers = playerNames
      .slice(0, numPlayers)
      .map((name, index) => ({
        name: name || `Player ${index + 1}`,
        symbol: playerSymbols[index],
        color: playerColors[index],
      }));
  
    setPlayers(selectedPlayers);
    setBoard(initializeBoard(boardSize));
    setDialogOpen(false);
  };
   

const handleCloseSnackbar = () => {
    setErrorMessage(null); // Close the snackbar
  };

  const renderCell = (index) => {
    const cellValue = board[index];
    const player = players.find((p) => p.symbol === cellValue);
    const cellColor = player ? player.color : '#FFFFFF';

    return (
      <Button
        className={`cell`}
        onClick={() => handleClick(index)}
        sx={{
          width: '80px',
          height: '80px',
          fontSize: '32px',
          color: cellColor,
          backgroundColor: darkMode ? '#333333' : '#f0f0f0',
          border: darkMode ? '1px solid #ffffff' : '1px solid #000000',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        {cellValue}
      </Button>
    );
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={`tic-tac-toe ${darkMode ? 'dark-mode' : ''}`}
    >
      <Typography variant="h4" gutterBottom>
        Tic Tac Toe
      </Typography>
      {winner ? (
        <Typography variant="h6" style={{ color: winner.color }}>
          {winner.name === 'Draw' ? 'It\'s a Draw!' : `${winner.name} wins!`}
        </Typography>
      ) : (
        players.length > 0 && (
          <Typography variant="h6" style={{ color: players[currentPlayerIndex].color }}>
            {`${players[currentPlayerIndex].name}'s Turn`}
          </Typography>
        )
      )}
     <div className="dark-mode-toggle" onClick={toggleDarkMode}>
    <span className="toggle-icon">{darkMode ? '🌜' : '🌞'}</span>
  </div>
  
  <IconButton onClick={() => setDialogOpen(true)} sx={{ marginTop: 2, color: darkMode ? '#FFFFFF' : '#000000' }}>
    <SettingsIcon />
  </IconButton>
      <Grid
        container
        spacing={1}
        justifyContent="center"
        className=""
        sx={{ marginTop: 2 }}
      >
        {Array.from({ length: boardSize }).map((_, row) => (
          <Grid
            container
            item
            xs={12}
            spacing={1}
            key={row}
            justifyContent="center"
          >
            {Array.from({ length: boardSize }).map((_, col) => (
              <Grid item key={col}>
                {renderCell(row * boardSize + col)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      <Button
        className="reset-button"
        onClick={resetGame}
        variant="contained"
        sx={{ marginTop: 3 }}
      >
        Reset
      </Button>

      {/* Player Setup Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Set Up Players</DialogTitle>
        <DialogContent>
          <TextField
            label="Number of Players"
            type="number"
            value={numPlayers}
            onChange={(e) =>
              setNumPlayers(
                Math.min(5, Math.max(2, parseInt(e.target.value, 10)))
              )
            }
            fullWidth
            margin="normal"
          />
          {Array.from({ length: numPlayers }).map((_, i) => (
            <TextField
              key={i}
              label={`Player ${i + 1} Name`}
              value={playerNames[i]}
              onChange={(e) => {
                const newNames = [...playerNames];
                newNames[i] = e.target.value;
                setPlayerNames(newNames);
              }}
              fullWidth
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogSubmit} color="primary">
            Start Game
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default TicTacToe;
