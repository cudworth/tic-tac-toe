const newPlayer = function(symbol){
    const mark = symbol;
    const record = [0, 0, 0];

    const addWin = () => record[0] += 1;
    const addLoss = ()=> record[1] += 1;
    const addTie = ()=> record[2] += 1;

    const getRecord = () => console.log(`player ${mark}'s record: ${record[0]} - ${record[1]} - ${record[2]}`);

    return {
        mark,
        addWin,
        addLoss,
        addTie,
        getRecord
    }
}


const gameBoard = (function(){
    const board = [['','',''],['','',''],['','','']];

    const addMark = function(mark, [i, j]){
        board[i][j] = mark;
    };

    //TODO
    const checkWinCondition = function(){
        return false; //TODO
    }

    //TODO
    const checkTieCondition = function(){
        return false;
    }

    return {
        board,
        addMark,
        checkWinCondition,
        checkTieCondition,
    }
})()


const displayController = (function(){
    let parent_node;

    const disp_id = Math.floor(Math.random()*100000);

    game_board = document.createElement('div');
    game_board.setAttribute('id', `_${disp_id}`);
    game_board.setAttribute('class', 'gameboard');

    setParent = function(parent){
        parent_node = parent;
        parent_node.append(game_board);
    }

    render = function(){

        game_board.innerHTML = '';

        for (i = 0; i < 3; i++){
            row = document.createElement('div');
            row.setAttribute('id',`_${i}_${disp_id}`);
            row.setAttribute('class','row')

            for (j = 0; j < 3; j++){
                cell = document.createElement('span');
                cell.setAttribute('id',`_${i}_${j}_${disp_id}`);
                cell.setAttribute('class','cell');
                cell.textContent = gameBoard.board[i][j];
                cell.addEventListener('click', function(e){
                    const [i, j] = e.target.id.split('_').slice(1,3);
                    gameController.addMark([i, j]);
                })
                row.append(cell);
            }
            game_board.append(row);
        }
    }

    return{
        render,
        setParent
    }

})()


const gameController = (function(){
    let p1, p2, active_player, inactive_player;

    const newGame = function(){
        p1 = newPlayer('X');
        p2 = newPlayer('O');
        
        active_player = [p1, p2][Math.round(Math.random())];
        (p1 == active_player)? inactive_player = p2 : inactive_player = p1;

        displayController.setParent(document.querySelector('body'));
        displayController.render();
    }

    const getActivePlayer = function(){
        return active_player;
    }

    const swapActivePlayer = function(){
        if (p1 == active_player) {
            active_player = p2;
            inactive_player = p1;
        } else {
            active_player = p1;
            inactive_player = p2;
        }
    }

    const addMark = function([i, j]){
        if ('' != gameBoard.board[i][j]){
            return;
        } else {
            gameBoard.board[i][j] = active_player.mark;

            if (gameBoard.checkWinCondition()) {
                active_player.addWin();
                inactive_player.addLoss();
                console.log(`player ${active_player.mark} is victorious`)
            }

            if (gameBoard.checkTieCondition()) {
                active_player.addTie();
                inactive_player.addTie();
                console.log(`game resulted in a tie`)
            }

            swapActivePlayer();
            displayController.render();
        }
    }

    return{
        newGame,
        getActivePlayer,
        addMark
    }

})()


gameController.newGame();
