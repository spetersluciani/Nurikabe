class Board {
    constructor() {
        this.seed = null;
        this.cells = [];
        this.element = document.createElement('div');
        this.numberTotal = 0;
        this.shadeCount = 0;
        this.checkShadeLimit = this.checkShadeLimit.bind(this);
        this.checkTwoByTwo = this.checkTwoByTwo.bind(this);
        this.verify = this.verify.bind(this);
    }

    newPuzzle(array) {
        let choice = this.getRandomNum(array.length);
        this.seed = array[choice];
    }

    createCells() {
        let numCells = this.seed.length;
        let rowCount = 0;

        for (let i = 0; i < numCells; i++) {
            let cell = new Cell();

            if (this.seed[i] != 0) {
                cell.hasNumber = true;
                cell.number = this.seed[i];
                this.numberTotal += cell.number;
            }

            this.cells.push(cell);

            if (i > 0 && (i % 5) !== 0) {
                cell.left = this.cells[i - 1];
                this.cells[i - 1].right = this.cells[i];
            } else {
                rowCount += 1;
            }
            
            if (rowCount > 1) {
                cell.up = this.cells[i - 5];
                this.cells[i - 5].down = cell;
            }
        }
    }

    getRandomNum(n) {
        return Math.floor(Math.random() * Math.floor(n));
    }

    verify() {
        if (!this.checkShadeLimit()) {
            return false;
        }

        if (!this.checkTwoByTwo()) {
            return false;
        }

        return true;
    }

    checkShadeLimit() {
        this.shadeCount = 0;
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].color === 'black') {
                this.shadeCount++;
            }
        }

        if (this.shadeCount > (this.cells.length - this.numberTotal)) {
            window.alert('Too many shaded squares.');
            return false;
        } else if (this.shadeCount != (this.cells.length - this.numberTotal)) {
            window.alert('Not enough shaded squares.');
            return false;
        }

        return true;
    }

    // Convert to Dynamic Programming Algo?
    checkTwoByTwo() {
        for (let i = 0; i < this.cells.length - 6; i++) {
            if(this.cells[i].right) {
                let start = this.cells[i].color;
                let right = this.cells[i + 1].color;
                let down = this.cells[i + 5].color;
                let diag = this.cells[i + 6].color;

                if (start == 'black' && right == 'black' && down == 'black' && diag == 'black') {
                    window.alert('4 block black');
                    return false;
                }
            }
        }

        return true;
    }

    checkRegionCount() {
        
    }

    render() {
        this.element.classList.add('board');
        for (let i = 0; i < this.cells.length; i++) {
            let cell = this.cells[i].render();
            this.element.append(cell);         
        }

        return this.element;
    }
}

class Cell {
    constructor() {
        this.color = 'white';
        this.state = 'unset';
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
        this.hasNumber = false;
        this.number = '';
        this.element = document.createElement('div');
        this.setBlack = this.setBlack.bind(this);
        this.checkNeighbors = this.checkNeighbors.bind(this);
        this.render = this.render.bind(this);
    }

    setBlack() {
        if (this.color !== 'black' && !this.hasNumber) {
            this.color = 'black';
            this.element.classList.add('shaded');
        } else {
            this.color = 'white';
            this.element.classList.remove('shaded');
        }
    }

    checkNeighbors() {
        if (this.up && this.up.hasNumber) {
            return true;
        }

        if (this.down && this.down.hasNumber) {
            return true;
        }

        if (this.left && this.left.hasNumber) {
            return true;
        }

        if (this.right && this.right.hasNumber) {
            return true;
        }

        return false;
    }

    checkShadeBlock() {
        let isOkay = true;

        let coloredBlocks = 1;

        if (this.up && this.up.color == 'black') {
            coloredBlocks++;
        }

        if (this.right && this.right.color == 'black') {
            coloredBlocks++;
            if (this.right.down && this.right.down.color == 'black') {
                coloredBlocks++;
            }
            if (this.right.up && this.right.up.color == 'black') {
                coloredBlocks++;
            }
        }

        if (this.left && this.left.color == 'black') {
            coloredBlocks++;
        }
    }

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

let puzzles = [
    [1,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,3,0,0],
    [0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,5,0],
    [0,2,0,2,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2,0,1,0],
    [0,0,3,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0],
    [1,0,0,0,3,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,2],
    [0,0,0,0,3,0,1,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,3],
    [1,0,0,0,0,0,0,0,4,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,1,0,0,4,0,0,0,1,0,0,2,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,2,0,6,0,0,0,0,0,1,0,0,0,0,0,0,2,0],
    [1,0,0,2,0,0,0,1,0,0,0,2,0,0,5,0,0,0,0,0,0,0,0,0,0]
];

let board = new Board();
board.newPuzzle(puzzles);
board.createCells();
board.render();
let container = document.getElementById('container');
container.append(board.element);



let checkButton = document.createElement('button');
checkButton.append(document.createTextNode('Check'));
checkButton.addEventListener('click', function () {
    if(board.verify()) {
        window.alert('passed');
    }
});

container.append(checkButton);