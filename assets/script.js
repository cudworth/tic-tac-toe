//TODO: GAMEBOARD MODULE
const gameBoard = (function(){
    const gameboard = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
    return {gameboard}
})();


//TODO: GAME LOGIC MODULE


//TODO: PLAYER FACTORY FUNCTION


//TODO: DISPLAY CONTROLLER MODULE
const displayController = (function(){
    const body = document.querySelector('body');
    gameboard = document.createElement('div');
    

    return{render}
})();

console.log(gameBoard.gameboard[0][0]);