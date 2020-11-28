

function setBlack() {
    if(!this.classList.contains('shaded') && !this.classList.contains('hasNumber')) {
        this.classList.add('shaded');
    } else {
        this.classList.remove('shaded');
    }
}

function getRandomNum(n) {
    return Math.floor(Math.random() * Math.floor(n));
}

function checkDirection(i, j, arr) {

}

function assignNumbers(n, arr) {
    let length = n;
    while (length > 0) {
        let i = getRandomNum(n);
        let j = getRandomNum(n);
        let number = document.createTextNode(getRandomNum(n) + 1);

        if(arr[i][j].childNodes.length == 0) {
            if (i == 0) {
                if (j == 0) {
                    if(!arr[i+1][j].classList.contains('hasNumber') 
                    && !arr[i][j+1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else if (j > 0 && j < n - 1) {
                    if(!arr[i+1][j].classList.contains('hasNumber')
                    && !arr[i][j+1].classList.contains('hasNumber')
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else {
                    if(!arr[i+1][j].classList.contains('hasNumber')
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                }
            } else if(i == n - 1) {
                if (j == 0) {
                    if(!arr[i-1][j].classList.contains('hasNumber') 
                    && !arr[i][j+1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else if (j > 0 && j < n - 1) {
                    if(!arr[i-1][j].classList.contains('hasNumber')
                    && !arr[i][j+1].classList.contains('hasNumber')
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else {
                    if(!arr[i-1][j].classList.contains('hasNumber')
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                }
            } else {
                if (j == 0) {
                    if(!arr[i-1][j].classList.contains('hasNumber') 
                    && !arr[i+1][j].classList.contains('hasNumber') 
                    && !arr[i][j+1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else if (j > 0 && j < n - 1) {
                    if(!arr[i-1][j].classList.contains('hasNumber') 
                    && !arr[i+1][j].classList.contains('hasNumber') 
                    && !arr[i][j+1].classList.contains('hasNumber') 
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                } else {
                    if(!arr[i-1][j].classList.contains('hasNumber') 
                    && !arr[i+1][j].classList.contains('hasNumber') 
                    && !arr[i][j-1].classList.contains('hasNumber')) {
                        arr[i][j].append(number);
                        arr[i][j].classList.add('hasNumber');
                        length--;
                    }
                }
            }
        }
    }
}

function createBoard(n) {
    let board = document.createElement('div');
    board.className = 'board';

    let cellArr = [];

    for (let i = 0; i < n; i++) {
        let rowArray = [];

        for (let j = 0; j < n; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('click', setBlack);
            rowArray.push(cell);
        }

        cellArr.push(rowArray);
    }

    assignNumbers(n, cellArr);

    for (row in cellArr) {
        for (cell in cellArr[row]) {
            board.append(cellArr[row][cell]);
        }
    }

    let container = document.getElementById('container');

    container.append(board);
}

createBoard(5);