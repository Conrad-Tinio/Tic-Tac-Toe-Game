import React, { useState, useRef, useEffect } from "react";
import './TicTacToe.css';
import shell_icon from '../Assets/shell.png'; 
import starfish_icon from '../Assets/starfish.png';

const TicTacToe = () => {
    const [count, setCount] = useState(0);
    const [lock, setLock] = useState(false);
    const [starfishWins, setStarfishWins] = useState(0);
    const [shellWins, setShellWins] = useState(0);
    const [gameMode, setGameMode] = useState(null); 
    const [gameData, setGameData] = useState(Array(9).fill(""));
    
    const titleRef = useRef(null);
    const scoreboardRef = useRef(null);
    const nextPlayerRef = useRef(null);
    const boxRefs = useRef([]);

    if(boxRefs.current.length === 0) {
        boxRefs.current = Array(9).fill().map(() => React.createRef());
    }

    useEffect(() => {
        if (gameMode) {
            updateNextPlayerDisplay();
        }
    }, [count, gameMode]);

    // Winning patterns
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [2, 4, 6], [0, 4, 8]
    ];

    const updateNextPlayerDisplay = () => {
        if (!nextPlayerRef.current) return;
        
        if(lock) {
            nextPlayerRef.current.innerHTML = "Game Over!";
            return;
        }

        const nextPlayerIcon = count % 2 === 0 ? starfish_icon : shell_icon;
        nextPlayerRef.current.innerHTML = `Player <img src='${nextPlayerIcon}' style="width: 25px; height: 25px; vertical-align: middle;"> next`;
    };

    const updateScoreboard = () => {
        if (!scoreboardRef.current) return;
        
        scoreboardRef.current.innerHTML = `
            <div class="score-item">
                <img src='${starfish_icon}' style="width: 25px; height: 25px; vertical-align: middle;"> 
                <span>${starfishWins} wins</span>
            </div>
            <div class="score-item">
                <img src='${shell_icon}' style="width: 25px; height: 25px; vertical-align: middle;"> 
                <span>${shellWins} wins</span>
            </div>
        `;
    };

    const handlePlayerMove = (e, num) => {
        if(lock || gameData[num] !== "") {
            return;
        }

        const isPlayerTurn = gameMode === "multi" ? count % 2 === 0 : true;
        const playerSymbol = gameMode === "multi" ? "x" : "x"; 
        const playerIcon = starfish_icon;

        if (isPlayerTurn) {
            e.target.innerHTML = `<img src='${playerIcon}'>`;
            const newGameData = [...gameData];
            newGameData[num] = playerSymbol;
            setGameData(newGameData);
            setCount(count + 1);

            if (checkWinForData(newGameData)) {
                return;
            }

            if (gameMode === "single" && !lock && !newGameData.every(cell => cell !== "")) {
                setTimeout(() => makeBotMove(newGameData), 500);
            }
        } else {
            e.target.innerHTML = `<img src='${shell_icon}'>`;
            const newGameData = [...gameData];
            newGameData[num] = "o";
            setGameData(newGameData);
            setCount(count + 1);
            checkWinForData(newGameData);
        }
    };

    const makeBotMove = (currentData) => {
        if (lock) return;

        const emptyCells = currentData.map((value, index) => 
            value === "" ? index : -1).filter(index => index !== -1);
        
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const botMoveIndex = emptyCells[randomIndex];
            
            if (boxRefs.current[botMoveIndex].current) {
                boxRefs.current[botMoveIndex].current.innerHTML = `<img src='${shell_icon}'>`;
                const newGameData = [...currentData];
                newGameData[botMoveIndex] = "o";
                setGameData(newGameData);
                setCount(count + 1);
                checkWinForData(newGameData);
            }
        }
    };

    const checkWinForData = (data) => {
        for(let i = 0; i < winningPatterns.length; i++) {
            const [a, b, c] = winningPatterns[i];
            if(data[a] !== "" && data[a] === data[b] && data[a] === data[c]) {
                highlightWinningPattern(winningPatterns[i]);
                won(data[a]);
                return true;
            }
        }

        if(!data.includes("") && !lock) {
            setLock(true);
            if (titleRef.current) {
                titleRef.current.innerHTML = "It's a draw!";
            }
            updateNextPlayerDisplay();
        }
        
        return false;
    };

    const highlightWinningPattern = (pattern) => {
        pattern.forEach(index => {
            if (boxRefs.current[index] && boxRefs.current[index].current) {
                boxRefs.current[index].current.classList.add('winning-box'); 
            }
        });
    };

    const won = (winner) => {
        setLock(true);
        if (winner === "x") {
            setStarfishWins(starfishWins + 1);
            if (titleRef.current) {
                titleRef.current.innerHTML = `Congratulations! Player <img src='${starfish_icon}' style="width: 30px; height: 30px; vertical-align: middle;"> won.`;
            }
        } else {
            setShellWins(shellWins + 1);
            if (titleRef.current) {
                titleRef.current.innerHTML = `Congratulations! Player <img src='${shell_icon}' style="width: 30px; height: 30px; vertical-align: middle;"> won.`;
            }
        }
        updateScoreboard();
        updateNextPlayerDisplay();
    };

    const resetGame = () => {
        setLock(false);
        setCount(0);
        setGameData(Array(9).fill(""));
        
        if (titleRef.current) {
            titleRef.current.innerHTML = 'Tic-Tac-Toe <span>Beach Edition!</span>';
        }
        
        boxRefs.current.forEach(boxRef => {
            if (boxRef.current) {
                boxRef.current.innerHTML = "";
                boxRef.current.classList.remove('winning-box');
            }
        });

        updateScoreboard();
        updateNextPlayerDisplay();
    };

    const newGame = () => {
        resetGame();
        setStarfishWins(0);
        setShellWins(0);
        updateScoreboard();

        if (scoreboardRef.current) {
            scoreboardRef.current.innerHTML = `
                <div class="score-item">
                    <img src='${starfish_icon}' style="width: 25px; height: 25px; vertical-align: middle;">
                    <span>0 wins</span>
                </div>
                <div class="score-item">
                    <img src='${shell_icon}' style="width: 25px; height: 25px; vertical-align: middle;">
                    <span>0 wins</span>
                </div>
            `;
        }

    };

    const selectGameMode = (mode) => {
        setGameMode(mode);
        resetGame();
        setStarfishWins(0);
        setShellWins(0);
        updateScoreboard();
    };

    return (
        <div>
            <div className="container">
                <h1 className="title" ref={titleRef}>Tic-Tac-Toe<span>Beach Edition!</span></h1>
                
                {gameMode === null ? (
                    <div className="mode-selection">
                        <h2 className="mode-title">Select Game Mode</h2>
                        <div className="mode-buttons">
                            <button 
                                className="mode-button single-player-btn" 
                                onClick={() => selectGameMode("single")}
                            >
                                1 Player
                            </button>
                            <button 
                                className="mode-button multi-player-btn" 
                                onClick={() => selectGameMode("multi")}
                            >
                                2 Players
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="scoreboard" ref={scoreboardRef}>
                            <div className="score-item">
                                <img src={starfish_icon} style={{width: "25px", height: "25px", verticalAlign: "middle"}} /> 
                                <span>{starfishWins} wins</span>
                            </div>
                            <div className="score-item">
                                <img src={shell_icon} style={{width: "25px", height: "25px", verticalAlign: "middle"}} /> 
                                <span>{shellWins} wins</span>
                            </div>
                        </div>
                        <div className="next-player" ref={nextPlayerRef}></div>
                        <div className="board">
                            <div className="row1">
                                <div className="boxes" ref={boxRefs.current[0]} onClick={(e) => handlePlayerMove(e, 0)}></div>
                                <div className="boxes" ref={boxRefs.current[1]} onClick={(e) => handlePlayerMove(e, 1)}></div>
                                <div className="boxes" ref={boxRefs.current[2]} onClick={(e) => handlePlayerMove(e, 2)}></div>
                            </div>
                            <div className="row2">
                                <div className="boxes" ref={boxRefs.current[3]} onClick={(e) => handlePlayerMove(e, 3)}></div>
                                <div className="boxes" ref={boxRefs.current[4]} onClick={(e) => handlePlayerMove(e, 4)}></div>
                                <div className="boxes" ref={boxRefs.current[5]} onClick={(e) => handlePlayerMove(e, 5)}></div>
                            </div>
                            <div className="row3">
                                <div className="boxes" ref={boxRefs.current[6]} onClick={(e) => handlePlayerMove(e, 6)}></div>
                                <div className="boxes" ref={boxRefs.current[7]} onClick={(e) => handlePlayerMove(e, 7)}></div>
                                <div className="boxes" ref={boxRefs.current[8]} onClick={(e) => handlePlayerMove(e, 8)}></div>
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="reset" onClick={resetGame}>RESET</button>
                            <button className="new-game" onClick={newGame}>NEW GAME</button>
                            <button className="mode-select" onClick={() => setGameMode(null)}>CHANGE MODE</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TicTacToe;