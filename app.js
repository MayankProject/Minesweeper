const boardWidth = 17 // 18 blocks
const boardHeight = 13 // 14 blocks
const noOfBombs = 30
const allMines = randomMinesPosition() //random 4 mines Positon
let boardGEO = new Array(boardHeight+1).fill().map(()=>new Array(boardWidth+1).fill(0));
let flags = 0
function DCN(val){
    return document.querySelector(`.${val}`)
}
function CEM(val){
    return document.createElement(val)
}
function CTN(val){
    return document.createTextNode(val)
}
function selectBlockByPosition(position){
    return document.querySelector(`.block[data-status='${position['x']}-${position['y']}']`)
     
}
function randomNumber(startNum, endNum, providedArray=false){
    let checkArray = []
    if (providedArray){
        checkArray = providedArray
    }
    let randomNum;
    do {
        randomNum = Math.round(Math.random()*(endNum-startNum) + startNum)
        
        if (checkArray.includes(randomNum)) {
            randomNum = undefined;
        }

    } while (!randomNum); 

    return randomNum
}
function randomMinesPosition(){
    let xPositions = new Array(noOfBombs).fill().map(()=>(randomNumber(0, boardWidth)))
    let yPositions = new Array(noOfBombs).fill().map(()=>(randomNumber(0, boardHeight)))
    let allPositions = []
    for (let i = 0; i < noOfBombs; i++) {
        const x = xPositions[i];
        const y = yPositions[i];
        allPositions.push({x: x, y: y})
    }
    return allPositions
}
function isValid(position){
    if (position['x']<boardWidth+1 && position['x']>=0 && position['y']<boardHeight+1 && position['y']>=0) {
        return true
    }
    else{
        return false
    }
}function surroundedBombNumber(position){
    let allPossibleSq = neighbourCells(position)
    let count = 0
    allPossibleSq.forEach((block)=>{
        if (isValid(block) && isMine(block)) {
            count++
        }
    })
    return count
}
function burst(position){
    let bombCount = surroundedBombNumber(position)
    let tile = selectBlockByPosition(position)
    if (!isValid(position) || isMine(position)) return
    revealTile(tile)
    if (bombCount) {
        tile.innerHTML = `<p>${bombCount}</p>`
    }
    else{
        let a = neighbourCells(position)
        for (let i = 0; i < a.length; i++) {
            const element = a[i];
            if (isValid(element) && !(position['x']===element['x'] && position['y']===element['y']) && !Array.from(selectBlockByPosition(element).classList).includes('show')) {
                burst(element)
            }
        }
    }
    return
}
function isMine(obj){
    found = false
    allMines.forEach((mine)=>{
        if (mine['x'] === obj['x'] && mine['y'] === obj['y'] ) {
            found = true
            return found
        }
    })
    return found
}
function setBoard(){
    allMines.forEach(({x, y})=>{
        boardGEO[y][x] = 1
    })
}
function revealTile(tile){
    tile.classList.add('show')
}
function neighbourCells(position){
    return [
        {x: position['x'], y: position['y']},
        {x: position['x']+1, y: position['y']+1},
        {x: position['x']-1, y: position['y']-1},

        {x: position['x']+1, y: position['y']-1},
        {x: position['x']-1, y: position['y']+1},

        {x: position['x']+1, y: position['y']},
        {x: position['x']-1, y: position['y']},
        {x: position['x'], y: position['y']-1},
        {x: position['x'], y: position['y']+1},
    ]
}
function gameOver(){
    let allGameOverBlocks = document.querySelectorAll('.bomb')
    let counter = 0
    setInterval(() => {
        counter++
        if (counter < allGameOverBlocks.length) {   
            bomb = allGameOverBlocks[counter]
            bomb.classList.add('show')
        }
        }, 100);
    alert('Game Over')
}
function displayBoard(){
    const board = DCN('board')
    updateflags()
    boardGEO.forEach((column, y)=>{
        column.forEach((row, x)=>{
            let block = document.createElement('div')
            block.classList.add('block')
            if (row) {
                block.classList.add('bomb')
            }
            block.setAttribute('data-status', `${x}-${y}`)
            board.appendChild(block)
        })
    })
}
function handleClick(tile){
    let position_string = tile.getAttribute('data-status').split('-')
    let positon = {x:Number(position_string[0]), y:Number(position_string[1])}
    burst(positon)

}
function updateflags(){
    document.querySelector('.noFlag').innerText = noOfBombs-flags
}
function checkForWin(){
    let status = true
    document.querySelectorAll('.bomb').forEach((bomb)=>{
        let position_string = bomb.getAttribute('data-status').split('-')
        let positon = {x:Number(position_string[0]), y:Number(position_string[1])}
        let allNeighbour = neighbourCells(positon)
        allNeighbour.forEach((neighbour)=>{
            if (!isMine(neighbour) && isValid(neighbour) && !Array.from(selectBlockByPosition(neighbour).classList).includes('show')) {
                status = false
            }
        })
    })
    return status
}
function clickToRevealistener(){
    document.querySelectorAll('.block').forEach((block)=>{
        block.addEventListener('click', (e)=>{
            if (Array.from(e.target.classList).includes('bomb') && !e.ctrlKey) {
                gameOver()
            }
            else{
                handleClick(e.target)
            }
            if (checkForWin()) {
                alert('You Won')
            }
        })
        block.addEventListener('contextmenu', (e)=>{
            e.preventDefault()
            if (Array.from(e.target.classList).includes('flag')) {
                e.target.classList.remove('flag')
                flags--
            }
            else{
                e.target.classList.add('flag')
                flags++

            }
            updateflags()
        })
    })
}

setBoard()
displayBoard()
clickToRevealistener()