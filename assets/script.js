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
    let table;

    const newGame = function(){
        table = [[null,null,null],[null,null,null],[null,null,null]];
    }

    const setCell = function(i, j, player){
        table[i][j] = player;
    };

    const getCell = function(i, j){
        return table[i][j];
    }

    const checkWinCondition = function(){
        let result = false;
        //CHECK ROWS
        for (i = 0; i < 3; i++) {
            if (table[i][0] != null &&
                table[i][0] == table[i][1] && 
                table[i][0] == table[i][2]){
                    result = true;
                }
        }

        //CHECK COLS
        for (j = 0; j < 3; j++) {
            if (table[0][j] != null &&
                table[0][j] == table[1][j] && 
                table[0][j] == table[2][j]){
                    result = true;
                }
        }

        //CHECK DIAG
        if (table[1][1] != null &&
            table[1][1] == table[0][0] && 
            table[1][1] == table[2][2]){
                result = true;
            }

        if (table[1][1] != null &&
            table[1][1] == table[0][2] && 
            table[1][1] == table[2][0]){
                result = true;
            }

        return result;
    }

    const checkTieCondition = function(){
        let result = true;
        table.forEach(function(row){
            if (row.includes(null)){
                result = false;
            }
        })
        return result;
    }

    return {
        newGame,
        setCell,
        getCell,
        checkWinCondition,
        checkTieCondition
    }
})()


const displayController = (function(){
    let parent_node;
    let active_game = true;

    const disp_id = Math.floor(Math.random()*100000);

    game_board = document.createElement('div');
    game_board.setAttribute('id', `_${disp_id}`);
    game_board.setAttribute('class', 'gameboard');

    setParent = function(parent){
        parent_node = parent;
        parent_node.append(game_board);
    }

    setStatus = function(status){
        status_bar.textContent = status.toString();
    }

    render = function(){

        game_board.innerHTML = '';

        status_bar = document.createElement('h2');
        reset_button = document.createElement('button');
        reset_button.textContent = 'RESET';
        reset_button.addEventListener('click', () => gameController.newGame());
        game_board.append(status_bar);

        for (i = 0; i < 3; i++){
            row = document.createElement('div');
            row.setAttribute('id',`_${i}_${disp_id}`);
            row.setAttribute('class','row')

            for (j = 0; j < 3; j++){
                cell = document.createElement('span');
                cell.setAttribute('id',`_${i}_${j}_${disp_id}`);
                cell.setAttribute('class','cell');

                const cell_val = gameBoard.getCell(i, j);
                (cell_val)? cell.textContent = cell_val.mark : cell.textContent = '';
                
                cell.addEventListener('click', function(e){
                    if (active_game) {
                        const [i, j] = e.target.id.split('_').slice(1,3);
                        gameController.setCell(i, j);
                    }
                })
                row.append(cell);
            }
            game_board.append(row);
        }
        game_board.append(reset_button);
    }

    newGame = function(){
        active_game = true;
        render();
    }

    endGame = function(status){
        active_game = false;
        render();
        setStatus(status);
    }

    return{
        render,
        setParent,
        setStatus,
        newGame,
        endGame
    }

})()


const gameController = (function(){
    let p1, p2, active_player, inactive_player;

    const newGame = function(){

        gameBoard.newGame();

        p1 = newPlayer('X');
        p2 = newPlayer('O');
        
        active_player = [p1, p2][Math.round(Math.random())];
        (p1 == active_player)? inactive_player = p2 : inactive_player = p1;

        displayController.setParent(document.querySelector('body'));
        displayController.newGame();
        displayController.setStatus(`Player Turn: ${active_player.mark}`);
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

    const setCell = function(i, j){
        if (gameBoard.getCell(i, j)){
            return;
        } else {
            gameBoard.setCell(i, j, active_player);

            if (gameBoard.checkWinCondition()) {
                active_player.addWin();
                inactive_player.addLoss();
                displayController.endGame(`Game End: Player ${active_player.mark} wins!`);
                return;
            }

            if (gameBoard.checkTieCondition() && !gameBoard.checkWinCondition()){
                active_player.addTie();
                inactive_player.addTie();
                displayController.endGame(`Game End: Tie`);
                return;
            }

            swapActivePlayer();
            displayController.render();
            displayController.setStatus(`Player Turn: ${active_player.mark}`);

        }
    }

    return{
        newGame,
        getActivePlayer,
        setCell
    }

})()


gameController.newGame();
