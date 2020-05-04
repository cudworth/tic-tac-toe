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
    const table = [[null,null,null],[null,null,null],[null,null,null]];

    const setCell = function(i, j, player){
        table[i][j] = player;
    };

    const getCell = function(i, j){
        return table[i][j];
    }

    //TODO
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
        setCell,
        getCell,
        checkWinCondition,
        checkTieCondition
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

                const cell_val = gameBoard.getCell(i, j);
                (cell_val)? cell.textContent = cell_val.mark : cell.textContent = '';
                
                cell.addEventListener('click', function(e){
                    const [i, j] = e.target.id.split('_').slice(1,3);
                    gameController.setCell(i, j);
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

    const setCell = function(i, j){
        if (gameBoard.getCell(i, j)){
            return;
        } else {
            gameBoard.setCell(i, j, active_player);

            if (gameBoard.checkWinCondition()) {
                active_player.addWin();
                inactive_player.addLoss();
                console.log(`player ${active_player.mark} is victorious`)
            }

            if (gameBoard.checkTieCondition() && !gameBoard.checkWinCondition()){
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
        setCell
    }

})()


gameController.newGame();
