/*-------------------------------------------------------------------------
 * Creates the Board and houses the logic for verfiying the certificate
 *-----------------------------------------------------------------------*/
class Board {
    constructor() {
        this.seed = null;
        this.cells = [];
        this.element = document.createElement('div');
        this.numberTotal = 0;
        this.pathCount = 0;
        this.checkTwoByTwo = this.checkTwoByTwo.bind(this);
        this.checkShadeContinuity = this.checkShadeContinuity.bind(this);
        this.verify = this.verify.bind(this);
        this.reset = this.reset.bind(this);
    }

    // Builds a new puzzle based on a random seed from the array
    newPuzzle(array) {
        let choice = this.getRandomNum(array.length);
        this.seed = array[choice];
    }

    // Creates and stores the cells for the puzzle
    createCells() {
        let numCells = this.seed.length;
        let rowCount = 0;

        for (let i = 0; i < numCells; i++) {
            let cell = new Cell();

            // if seed entry has a number, add number to cell
            if (this.seed[i] != 0) {
                cell.hasNumber = true;
                cell.number = this.seed[i];
                this.numberTotal += cell.number;
            }

            this.cells.push(cell);

            // if cell doesn't start a new row
            if (i > 0 && (i % 5) !== 0) {
                cell.left = this.cells[i - 1]; // sets previous cell left
                this.cells[i - 1].right = this.cells[i]; // sets current cell as prev cell's right
            } else {
                rowCount += 1;
            }
            
            // from second row on
            if (rowCount > 1) {
                cell.up = this.cells[i - 5]; // set previous row's cell to up
                this.cells[i - 5].down = cell; // set current to prev row cell's down
            }
        }
    }

    // Get a random number in range
    getRandomNum(n) {
        return Math.floor(Math.random() * Math.floor(n));
    }

    /*----------------------------------------------------------------------
     * The verification algorithm uses a combination of methods to determine
     * if the provided certificate is a valid solution to the problem.
     * -------------------------------------------------------------------*/
    verify() {
        for (let cell in this.cells) {
            // if there is a 2x2 block and not enough shaded cells
            if (!this.checkTwoByTwo(this.cells[cell])) {
                return {
                    "status": false,
                    "message": "Two by two block in path"
                }
            }

            // if the regions don't have the proper number of cells
            // or two paths are connected
            if (this.cells[cell].hasNumber) {
                if (!this.checkRegions(this.cells[cell])) {
                    return {
                        "status": false,
                        "message": "Region count incorrect"
                    }
                }
            }

            // if shaded path isn't continuous
            if (this.cells[cell].color === 'black' && this.cells[cell].state !== 'checked') {
                if (!this.checkShadeContinuity(this.cells[cell])) {
                    return {
                        "status": false,
                        "message": "No contiguous shade path"
                    }
                }
            }
        }
        
        // if all tests above pass
        return {
            "status": true,
            "message": "Correct solution found!"
        }
    }

    /*--------------------------------------------------------------------------
     * This loops through the cells (minus the last row) and checks to make sure
     * there are no blocks of 4. O(n)
     *------------------------------------------------------------------------*/
    checkTwoByTwo(cell) {
        if(cell.right && cell.down) {
            let start = cell.color;
            let right = cell.right.color;
            let down = cell.down.color;
            let diag = cell.down.right.color;

            if (right == start && down == start && diag == start) {
                return false;
            }
        }

        return true;
    }

    /*----------------------------------------------------------------------------------
     * Uses a breadth first search algorithm to go through the paths from each number
     * to determine that the count is correct and that no regions are connected. O(V+E)
     *--------------------------------------------------------------------------------*/
    checkRegions(cell) {
            
        let queue = [];
        let count = 1;
        cell.state = 'checked';
        queue.push(cell); // numbered cell as root

        // checks all the connected white cells from the number root
        while (queue.length > 0 && count <= cell.number) {
            // Check for all attached cells in each direction, if white, push to queue
            let current = queue.pop();
            
            // check right cells
            if (current.right && current.right.color === 'white' && current.right.state !== 'checked') {
                // if the cell has a number, test fails
                if (current.right.hasNumber === true) {
                    return false;
                }
                current.right.state = 'checked';
                queue.push(current.right);
                count++;
            }

            // check left cells
            if (current.left && current.left.color === 'white' && current.left.state !== 'checked') {
                if (current.left.hasNumber === true) {
                    return false;
                }

                current.left.state = 'checked';
                queue.push(current.left);
                count++;
            }

            // check up cells
            if (current.up && current.up.color === 'white' && current.up.state !== 'checked') {
                if (current.up.hasNumber === true) {
                    return false;
                }

                current.up.state = 'checked';
                queue.push(current.up);
                count++;
            }

            // check down cells
            if (current.down && current.down.color === 'white' && current.down.state !== 'checked') {
                if (current.down.hasNumber === true) {
                    return false;
                }

                current.down.state = 'checked';
                queue.push(current.down);
                count++;
            }
        }

        // if the cell count doesn't match the number, test fails
        if (count != cell.number) {
            return false;
        }

        return true;
    }

    /*----------------------------------------------------------------------------------
     * Uses a breadth first search algorithm to go through the shaded path to make sure 
     * it is one continuous path. O(V+E)
     *--------------------------------------------------------------------------------*/
    checkShadeContinuity(cell) {

        this.pathCount++;
        cell.state = 'checked';

        let queue = [];
        queue.push(cell);
        // checks all directions from the root cell to determine a connected path
        while (queue.length > 0) {
            let current = queue.pop();

            // check right cell
            if (current.right && current.right.color === 'black' && current.right.state !== 'checked') {
                current.right.state = 'checked';
                queue.push(current.right);
            }

            // check down cell
            if (current.down && current.down.color === 'black' && current.down.state !== 'checked') {
                current.down.state = 'checked';
                queue.push(current.down);
            }

            // check left cell
            if (current.left && current.left.color === 'black' && current.left.state !== 'checked') {
                current.left.state = 'checked';
                queue.push(current.left);
            }

            // check up cell
            if (current.up && current.up.color === 'black' && current.up.state !== 'checked') {
                current.up.state = 'checked';
                queue.push(current.up);
            }
        }

        // if more than 1 path was found, test fails
        if (this.pathCount != 1) {
            return false;
        }

        return true;
    }

    /*----------------------------------------------------------------
     * This method resets the state and path count for verification
     *---------------------------------------------------------------*/
    reset() {
        for (let cell in this.cells) {
            this.cells[cell].state = 'unchecked';
        }

        this.pathCount = 0;
    }

    /*----------------------------------------------------------------
     * This method renders the board based on the Cell objects in the
     * cells array.
     *---------------------------------------------------------------*/
    render() {
        this.element.classList.add('board');
        for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i].render();
            this.element.append(cell);         
        }

        return this.element;
    }
}

/*------------------------------------------------------------------------
 * Creates a Cell object to maintain and generate the cells in the board.
 *-----------------------------------------------------------------------*/
class Cell {
    constructor() {
        this.color = 'white';
        this.state = 'unchecked';
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
        this.hasNumber = false;
        this.number = '';
        this.element = document.createElement('div');
        this.setBlack = this.setBlack.bind(this);
        this.render = this.render.bind(this);
    }

    /*-----------------------------------------------------------------
     * This method sets the cell to black (bound to a click function)
     *----------------------------------------------------------------*/
    setBlack() {
        if (this.color !== 'black' && !this.hasNumber) {
            this.color = 'black';
            this.element.classList.add('shaded');
        } else {
            this.color = 'white';
            this.element.classList.remove('shaded');
        }
    }

    /*-------------------------------------------------------------------
     * This method renders the cell on the board. Used in Board.render()
     *-------------------------------------------------------------------*/
    render() {
        this.element.classList.add('cell');
        this.element.addEventListener('click', this.setBlack);
        if (this.hasNumber) {
            let numberNode = document.createTextNode(this.number);
            this.element.append(numberNode);
        }
        return this.element;
    }
}

/*-----------------------------------------------------------------------------
 * Initialization function for the game. Creates the board object and buttons.
 *----------------------------------------------------------------------------*/
function init(puzzles) {
    let container = document.getElementById('board_container');
    let board = new Board();
    board.newPuzzle(puzzles);
    board.createCells();
    board.render();
    container.prepend(board.element);

    let buttonContainer = document.getElementById('button_container');
    let checkButton = document.createElement('button');
    checkButton.append(document.createTextNode('Check'));
    checkButton.addEventListener('click', function () {
        let verify = board.verify();
        window.alert(verify.message);
        board.reset();
    });

    let newPuzzle = document.createElement('button');
    newPuzzle.append(document.createTextNode('New Puzzle'));
    newPuzzle.addEventListener('click', function () {
        let board_container = document.getElementById('board_container');
        let button_container = document.getElementById('button_container');
        board_container.innerHTML = "";
        button_container.innerHTML = "";
        init(puzzles);
    })

    buttonContainer.append(checkButton, newPuzzle);
}

(function() {
    // seeds for puzzles
    let puzzles = [
        [1,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,3,0,0],
        [0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,5,0],
        [0,2,0,2,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2,0,1,0],
        [0,0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0],
        [1,0,0,0,3,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,2],
        [0,0,0,0,3,0,1,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,3],
        [1,0,0,0,0,0,0,0,4,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,1,0,0,4,0,0,0,1,0,0,2,0,0,1,0,0,0,0]
    ];

    init(puzzles);
})();