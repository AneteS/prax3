/* Variables */
var gridSize, shipsCount;
var computerTurnsCount = 0;
var userDestroyedCount = 0;
var computerDestroyedCount = 0;
var userFiredCount, computerFiredCount;

/* Constants */
var EMPTY = 0, SHIP = 1, USED = 2, DESTROYED = -1;

/* Arrays */
var _userBoard = [];
var _computerBoard = [];

/* Pregame menu */

//Mänguvälja suuruse valimine
$("#select-grid").change(function() {
    gridSize = $("#select-grid").val();
    $("#select-ships").empty();
    for(var i = gridSize-1; i > 0; i--) {
        var option = $('<option></option>').attr("value", i).text(i);
        $("#select-ships").append(option);
    }
});

//Start Game
$(document).on('click', "#start-game", function() {
    gridSize = $("#select-grid").val();
    shipsCount = $("#select-ships").val();
    document.getElementById('computerBoard').style.pointerEvents = 'auto';
    document.getElementById('userBoard').style.pointerEvents = 'auto';
    startNewGame();
});

//Change board and ships
$(document).on('click', "#start-game-selection", function() {
    $("#game-board").hide();
    $("#game-menu").fadeIn();
});


/*Show all results
$(document).on('click', "#results", function() {
    $("#game-board").hide();
    $("#all-results").fadeIn();
});
*/

/* Game */

function startNewGame() {
    $("#game-menu").hide();
    $("#game-board").hide();
    $("#all-results").hide();
    $("#game-board").fadeIn();
    $("#userBoardPrint").empty();
    $("#computerBoardPrint").empty();
    computerTurnsCount = 0;
    userDestroyedCount = 0;
    computerDestroyedCount = 0;
    userFiredCount = 0;
    computerFiredCount = 0;
    $("#userFiredCount").text("Computer shots fired: " + userFiredCount);
    $("#computerFiredCount").text("Computer shots fired: " + computerFiredCount);
    _userBoard = generateRandomShips();
    generateUserBoard(_userBoard);
    _computerBoard = generateRandomShips();
    generateComputerBoard(_computerBoard);
}

function generateUserBoard(_userBoard) {    

    var dataCounter = 0;

    for (var i = 0; i < gridSize; i++) {
        var row = '<div class="board-row">';

        for (var j = 0; j < gridSize; j++) {
            switch(_userBoard[dataCounter]) {
                case EMPTY:
                    row += '<div id="' + dataCounter + '" class="square-user empty"></div>';
                    break;
                case SHIP:
                    row += '<div id="' + dataCounter + '" class="square-user ship">0</div>';
                    break;
                case USED:
                    row += '<div id="' + dataCounter + '" class="square-user used">X</div>';
                    break;
                case DESTROYED:
                    row += '<div id="' + dataCounter + '" class="square-user destroyed">X</div>';
                    break;
            }
            dataCounter++;
        }
        
        row += '</div><br/>';

        $('#userBoardPrint').append(row);
    }
}

function generateComputerBoard(_computerBoard) {    

    var dataCounter = 0;

    for (var i = 0; i < gridSize; i++) {
        var row = '<div class="board-row">';

        for (var j = 0; j < gridSize; j++) {
            switch(_computerBoard[dataCounter]) {
                case EMPTY:
                    row += '<div id="' + dataCounter + '" class="square-computer empty"></div>';
                    break;
                case SHIP:
                    row += '<div id="' + dataCounter + '" class="square-computer ship"></div>';
                    break;
                case USED:
                    row += '<div id="' + dataCounter + '" class="square-computer used">X</div>';
                    break;
                case DESTROYED:
                    row += '<div id="' + dataCounter + '" class="square-computer destroyed">X</div>';
                    break;
            }
            dataCounter++;
        }
        
        row += '</div><br/>';

        $('#computerBoardPrint').append(row);
    }
}

function generateRandomShips() {
    var _randomBoard = [];
    var remainingShips = 0;
    var geneCount = 0;
    
    for(var i = 0; i < (gridSize*gridSize); i++) {
        _randomBoard[i] = 0;
    }
    
    while (remainingShips < shipsCount) {
        if(gridSize < 5 && geneCount == 0) {   //3x3 jaoks
            var randomRow = 1;
            geneCount++;
        } else {
            var randomRow = Math.floor(Math.random() * gridSize) + 1;
        }
        
        var randomCol = Math.floor(Math.random() * (gridSize-1)) + 1;
        var randomIndex = (((randomRow-1) * gridSize) + randomCol) - 1;
        
        // Check if randomIndex and randomIndex+1 are empty
        if(_randomBoard[randomIndex] != SHIP && _randomBoard[randomIndex+1] != SHIP) {
            // Check one square before and one after
            if(_randomBoard[(randomIndex-1)] != SHIP && _randomBoard[(randomIndex+2)] != SHIP) {
                // Check upper row for collision
                if(_randomBoard[(randomIndex-gridSize)] != SHIP && _randomBoard[((randomIndex-gridSize)+1)] != SHIP) {
                    // Check for lower row for collision
                    if(_randomBoard[Number(randomIndex) + Number(gridSize)] != SHIP && _randomBoard[Number(randomIndex) + Number(gridSize) + 1] != SHIP) {
                        _randomBoard[randomIndex] = SHIP;
                        _randomBoard[randomIndex+1] = SHIP;
                        remainingShips++;
                    }    
                }
            }
        }
    }
    return _randomBoard;
}

/* When user clicks on computer-board square */
$(document).on('click', ".square-computer", function() {
    var fireIndex = this.getAttribute('id');
    var fireIndexValue = _computerBoard[fireIndex];

    switch(fireIndexValue) {
        case EMPTY:
            _computerBoard[fireIndex] = USED;
            $("#computerBoardPrint").empty();
            generateComputerBoard(_computerBoard);
            userFiredCount++;
            $("#userFiredCount").text("User shots fired: " + userFiredCount);
            
            $("#computerError").removeClass("computerSuccess");
            $("#computerError").addClass("computerError");
            
            $("#computerError").fadeOut(100);
            $("#computerError").text("You missed!");
            $("#computerError").fadeIn(100);
            computerTurn();
            break;
        case SHIP:
            _computerBoard[fireIndex] = DESTROYED;
            userDestroyedCount++;
            userFiredCount++;
            $("#userFiredCount").text("User shots fired: " + userFiredCount);
            $("#computerBoardPrint").empty();
            generateComputerBoard(_computerBoard);
            if(checkWin()) {
                document.getElementById('computerBoard').style.pointerEvents = 'none';
                document.getElementById('userBoard').style.pointerEvents = 'none';
                break;
            } else {
                $("#computerError").removeClass("computerError");
                $("#computerError").addClass("computerSuccess");
                
                $("#computerError").fadeOut(100);
                $("#computerError").text("You fired a ship!");
                $("#computerError").fadeIn(100);
            }
            break;
        case USED:
            $("#computerError").removeClass("computerSuccess");
            $("#computerError").addClass("computerError");
            
            $("#computerError").fadeOut(100);
            $("#computerError").text("Already fired there!");
            $("#computerError").fadeIn(100);
            break;
        case DESTROYED:
            $("#computerError").removeClass("computerSuccess");
            $("#computerError").addClass("computerError");
            
            $("#computerError").fadeOut(100);
            $("#computerError").text("Already fired there!");
            $("#computerError").fadeIn(100);
            break;
    }
    
});

function computerTurn() {
    var computerValidMove = false;
    
    if(computerTurnsCount < (_userBoard.length-1)){
        while(!computerValidMove) {
            var randomIndex = Math.floor(Math.random() * (_userBoard.length-1)) + 0;
            var squareValue = _userBoard[randomIndex];

            if(squareValue == EMPTY) {
                _userBoard[randomIndex] = USED;
                $("#userBoardPrint").empty();
                generateUserBoard(_userBoard);
                computerValidMove = true;
                computerTurnsCount++;
                computerFiredCount++;
                $("#computerFiredCount").text("Computer shots fired: " + computerFiredCount);
                
                $("#userError").removeClass("userSuccess");
                $("#userError").addClass("userError");
                
                $("#userError").fadeOut(100);
                $("#userError").text("Computer missed!");
                $("#userError").fadeIn(100);
                break;
            }

            if(squareValue == SHIP) {
                _userBoard[randomIndex] = DESTROYED;
                $("#userBoardPrint").empty();
                generateUserBoard(_userBoard);
                computerValidMove = true;
                computerTurnsCount++;
                computerDestroyedCount++;
                computerFiredCount++;
                $("#computerFiredCount").text("Computer shots fired: " + computerFiredCount);
                if(checkWin()) {
                    document.getElementById('computerBoard').style.pointerEvents = 'none';
                    document.getElementById('userBoard').style.pointerEvents = 'none';
                    return;
                } else {
                    $("#userError").removeClass("userError");
                    $("#userError").addClass("userSuccess");
                    
                    $("#userError").fadeOut(100);
                    $("#userError").text("Computer hit your ship!");
                    $("#userError").fadeIn(100);
                }
                computerTurn();
                break;
            }
            
            if(squareValue == USED ||squareValue == DESTROYED) {
                continue;
            }

        }
        
    // Proov
    } else {                                             
        for(var i = 0; i < _userBoard.length; i++) {
            if(_userBoard[i] == EMPTY) {
                _userBoard[i] = USED;
                $("#userBoardPrint").empty();
                generateUserBoard(_userBoard);
                return;
            }
            if(_userBoard[i] == SHIP) {
                _userBoard[i] = DESTROYED;
                $("#userBoardPrint").empty();
                generateUserBoard(_userBoard);
                return;
            }
        }
    }
}

function checkWin() {
    // If user won
    if(userDestroyedCount == (shipsCount*2)) {
        $("#userError").removeClass("userSuccess");
        $("#userError").addClass("userError");
        $("#computerError").removeClass("computerError");
        $("#computerError").addClass("computerSuccess");
        
        $('#scoreTable').append('<tr><td>' + gridSize + ' x ' + gridSize + '</td><td>' + shipsCount + '</td><td>' + userFiredCount + '</td><td>' + computerFiredCount + '</td><td>User</td></tr>');
        
        $("#userError").fadeOut(100);
        $("#userError").text("Computer lost!");
        $("#userError").fadeIn(100);
        $("#computerError").fadeOut(100);
        $("#computerError").text("You won!");
        $("#computerError").fadeIn(100);
        return true;
    }
    // If computer won
    if(computerDestroyedCount == (shipsCount*2)) {
        $("#userError").removeClass("userError");
        $("#userError").addClass("userSuccess");
        $("#computerError").removeClass("computerSuccess");
        $("#computerError").addClass("computerError");
        
        $('#scoreTable').append('<tr><td>' + gridSize + ' x ' + gridSize + '</td><td>' + shipsCount + '</td><td>' + userFiredCount + '</td><td>' + computerFiredCount + '</td><td>Computer</td></tr>');
        
        
        $("#userError").fadeOut(100);
        $("#userError").text("Computer won!");
        $("#userError").fadeIn(100);
        $("#computerError").fadeOut(100);
        $("#computerError").text("You lost!");
        $("#computerError").fadeIn(100);
        return true;
    }
    
    //Otsing
    function search() {
	searchVar = document.getElementById("search").value;
	document.location.href = "?page=results&search=" + searchVar;
}
}