import './index.html';
import './index.scss';
import sound from'./sounds/sound.mp3'

const body = document.querySelector('body');
const header = document.createElement('header');
header.className = 'header';
body.append(header);

const headerButtonsArr = ['start', 'save', 'results', 'sound'];
const headerButtons = document.createElement('div');
headerButtons.className = 'header-buttons';
header.append(headerButtons);

headerButtonsArr.forEach(e=> {
  let button = document.createElement('div');
  button.className = `header-button ${e}`;
  button.textContent = e;
  headerButtons.append(button);
});

let audio = new Audio(); 


function soundClick(audio){
  audio.src = sound; 
  audio.autoplay = true; 
}



let soundVolume = document.querySelector('.sound');
soundVolume.textContent = ' ';
soundVolume.addEventListener('click', () => {
  soundVolume.classList.toggle('sound-off');  
  audio.muted = !audio.muted;
})

const infoFields = document.createElement('div');
infoFields.className = 'info-fields';

const moves = document.createElement('div');
moves.className = 'moves';
moves.textContent = 'Moves:';

const movesCounter = document.createElement('span');
movesCounter.className = 'moves-counter';

let movesTestRes = 0;

let movesCount = 0;
if(localStorage.getItem('moves')){
  movesCount = Number(localStorage.getItem('moves'));
  movesTestRes = movesCount;
}


movesCounter.textContent = movesCount;
moves.append(movesCounter); //добавляем счётчик ходов

infoFields.append(moves);

const time = document.createElement('div');
time.className = 'time';
time.textContent = `Time:`;

const timeCounter = document.createElement('span');
timeCounter.className = 'time-counter';
timeCounter.textContent = '00:00';
time.append(timeCounter);

infoFields.append(time);

header.append(infoFields);

const main = document.createElement('main');
main.className = 'main';
body.append(main);

const field = document.createElement('div');
field.className = 'field';
main.append(field);

const footer = document.createElement('footer');
footer.className = 'footer';

const resultFieldWrapper = document.createElement('div');
resultFieldWrapper.className = 'result-field-wrapper';

const resultField = document.createElement('div');
resultField.className = 'result-field';
resultField.innerHTML = '<span>Top-10 results</span>';
const resultsRate = document.createElement('div');
resultsRate.className = 'results-rate';
resultField.append(resultsRate);
resultFieldWrapper.append(resultField)
header.append(resultFieldWrapper);


document.querySelector('.results').addEventListener('click', ()=>{
  resultFieldWrapper.classList.add('show');
})

resultFieldWrapper.addEventListener('click', (e)=>{
  
    resultFieldWrapper.classList.remove('show');
  
})

//При загрузке проверяем наличие данных для рейтинга

let results = [];

if(localStorage.getItem('results')){
  results = JSON.parse(localStorage.getItem('results'));
  addRateResults(results)
}


function addRateResults(results){
  for(let i = 0; i < results.length; i++){
    let string = document.createElement('span');
    string.innerHTML = `${i + 1}. Moves: ${results[i][0]} / Time: ${results[i][1]} (${results[i][2]}x${results[i][2]})`;
    resultsRate.append(string)
  }
}

function isRecord(result){
  results.push(result);
  results.sort(function(a, b){
    if(a[0] > b[0]) return 1;
    if(a[0] == b[0]){
      if(a[1] > b[1])return 1;
      if(a[1] == b[1]) return 0;
      if(a[1] < b[1]) return -1;
    } 
    if(a[0] < b[0]) return -1;
    })
  results.splice(10,1);
  resultsRate.innerHTML = '';

  addRateResults(results);
  localStorage.removeItem('results');
  localStorage.setItem('results', JSON.stringify(results));
}


let fieldSize = 4;

if(localStorage.getItem('size')){
  fieldSize = localStorage.getItem('size');
}

startGame(fieldSize);


const fieldSizesArr = ['3x3', '4x4', '5x5', '6x6', '7x7', '8x8'];

const sizesField = document.createElement('div');
sizesField.className = 'sizes-field';
let sizesChoice = document.createElement('span');
sizesChoice.textContent = 'Other sizes:'
sizesField.append(sizesChoice);

fieldSizesArr.forEach(e => {
  let size = document.createElement('div');
  size.textContent = e;
  size.addEventListener('click', (e)=>{
    movesTestRes = 0;
    clearInterval(ticker);
    let size = e.target.textContent[0];
    localStorage.removeItem('moves');
    localStorage.removeItem('sec');
    localStorage.removeItem('minutes');
    localStorage.removeItem('cells');
    localStorage.removeItem('size');
    movesCount = 0;
    fieldSize = size;
    startGame(size);
  })
  sizesField.append(size);
})

footer.append(sizesField);

body.append(footer);

const start = document.querySelector('.start');
start.addEventListener('click', ()=>{
  clearInterval(ticker);
  localStorage.removeItem('moves');
  localStorage.removeItem('sec');
  localStorage.removeItem('minutes');
  localStorage.removeItem('cells');
  localStorage.removeItem('size');
  movesTestRes = 0;
  movesCount = 0;
  startGame(fieldSize);
})


//timer
let sec = localStorage.getItem('sec')?localStorage.getItem('sec'): 0, 
minutes = localStorage.getItem('minutes')?localStorage.getItem('minutes'): 0,
ticker = 0;

if(localStorage.getItem('sec') || localStorage.getItem('minutes')){
  timeCounter.textContent = (minutes > 9 ? minutes : "0" + minutes)
          + ":" + (sec > 9 ? sec : "0" + sec);
}

function tick(){
  sec++;
  if (sec >= 60) {
      sec = 0;
      minutes++;
  }
  if(minutes >= 60){
    alert('Вы заснули?')
    startGame(fieldSize);
  }
}

function add() {
  tick();
  timeCounter.textContent = (minutes > 9 ? minutes : "0" + minutes)
          + ":" + (sec > 9 ? sec : "0" + sec);
}

let save = document.querySelector('.save');
save.addEventListener('click', ()=>{

  localStorage.removeItem('minutes');
  localStorage.removeItem('sec');
  localStorage.removeItem('moves');
  localStorage.removeItem('size');


  localStorage.setItem('size', fieldSize);
  localStorage.setItem('minutes', minutes);
  localStorage.setItem('sec', sec);
  localStorage.setItem('moves', movesCount);
})

function startGame(fieldSize){
  clearInterval(ticker)
  field.innerHTML = '';
  timeCounter.textContent = '00:00';
  movesCounter.textContent = 0;
  if(movesCount > 0){
    movesCounter.textContent = movesCount;
  }
  sec = 0; 
  minutes = 0;
  localStorage.removeItem('times');
  
  let cells = [];

  let cellsNumArr = [];
  
  if(localStorage.getItem('cells')){
    cells = JSON.parse(localStorage.getItem('cells'));
    fieldSize = Number(localStorage.getItem('size'));
    getFieldLocalStorage(cells, fieldSize);
  }
  else{
    cellsNumArr = getCorrectGame(fieldSize);
    getField(cells, fieldSize, cellsNumArr);
  }

  cellAddListener (cells, fieldSize); 
  
}


field.ondragover = allowDrop;//
function allowDrop(event){
  event.preventDefault();
}//

function cellAddListener (cells, fieldSize){
  let empty = cells[0];
  let cellSize = 100 / fieldSize;
  for(let i = 1; i < cells.length; i++){

    cells[i].element.ondragstart = drag;

    function drag(event){
      event.target.classList.add('hidden');
      event.dataTransfer.setData('elem', JSON.stringify(cells[i]));
    }

    cells[i].element.ondragend = undrop;

    function undrop(event){
      event.target.classList.remove('hidden');
    }

    field.ondrop = drop;

    function drop(event){
      let itemObj = JSON.parse(event.dataTransfer.getData('elem'));
      event.target.classList.remove('hidden')
      move(cells.find(item => item.value === itemObj.value), empty, cellSize);    
      save.addEventListener('click', ()=>{
        localStorage.setItem('cells', JSON.stringify(cells));
      })
      getWin(cells, fieldSize);  
      
    }



    cells[i].element.addEventListener('click', (e)=> {
      move(cells[i], empty, cellSize);
      save.addEventListener('click', ()=>{
        localStorage.setItem('cells', JSON.stringify(cells));
      })
      getWin(cells, fieldSize);
    }) 
  }
  
}

function move(cell, empty, cellSize){

  //Проверка соседства

  const leftSide = Math.abs(empty.left  - cell.left);
  const topSide = Math.abs(empty.top - cell.top); 
  if(leftSide + topSide > 1){ 
    return;
  }
  // Запуск счетчика
  movesCounter.textContent = ++movesCount;
  if(movesCount == 1 || movesCount - movesTestRes == 1){
    ticker = setInterval(add, 1000);
  }
  //Воспроизведение звука
  soundClick(audio);


  cell.element.style.left = `${empty.left * cellSize}%`;
  cell.element.style.top = `${empty.top * cellSize}%`

  const emptyLeft = empty.left;
  const emptyTop = empty.top;

  empty.left = cell.left;
  empty.top = cell.top;

  cell.left = emptyLeft;
  cell.top = emptyTop;

}

function getWin(arr, fieldSize){
  const victory = arr.every(e => {
  let result = false;
  if(e.value === 0){
    e.top == fieldSize -1;
    e.left == fieldSize - 1;
    result = true;
  }else{
    result = (e.value === e.top * fieldSize + e.left +1);
  }
   return result;
});


if(victory){
  let result = [movesCount, timeCounter.textContent, fieldSize];
  isRecord(result);
  resultsRate.append('');
  setTimeout(() => {
    localStorage.removeItem('moves');
    localStorage.removeItem('minutes');
    localStorage.removeItem('sec');
    localStorage.removeItem('cells');
    alert(`Hooray! You solved the puzzle in ${timeCounter.textContent} and ${movesCounter.textContent} moves!`); 
    movesCount = 0;
    startGame(fieldSize);
  }, 300)

}
}

function getCorrectGame(fieldSize){
  const cellsNumArr = [];
  for(let i = 1; i <= (fieldSize*fieldSize - 1); i++){
    cellsNumArr.push(i);
  }

  cellsNumArr.sort(() => Math.random() - 0.5); //Перемешиваем ячейки
  let solvability  = 0; //ряд нулевой ячейки
  if(fieldSize % 2 ===0){
    solvability = fieldSize
  }

  for(let i = 0; i < cellsNumArr.length; i++){
    for(let j = i+1; j < cellsNumArr.length; j++ ){
      if(cellsNumArr[i]> cellsNumArr[j]){
        solvability++;
      }
    }
  }
  return (solvability % 2 === 0)?cellsNumArr:getCorrectGame(fieldSize);
}

function getField(cells, fieldSize, cellsNumArr){
  const cellSize = 100 / fieldSize;

  let empty = {
    value: 0,
    left: fieldSize - 1,
    top: fieldSize - 1,
  };  

  cells.push(empty); 

  for(let i = 0; i < cellsNumArr.length ; i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.draggable = 'true';
    const value = cellsNumArr[i];
    cell.id = `cell-${value}`
    cell.textContent = value;
  
    const left = i % fieldSize;
    const top = (i - left) / fieldSize;
    
    cells.push({
      value: value,
      left: left,
      top: top,
      element: cell,
    })

    cell.style.width = `${cellSize}%`;
    cell.style.height = `${cellSize}%`;
  
    cell.style.left = `${left*cellSize}%`;
    cell.style.top = `${top*cellSize}%`;
  
    field.append(cell);

  }
}


function getFieldLocalStorage(cells, fieldSize){
  let cellSize = 100 / fieldSize;

  for(let i = 1; i < cells.length; i++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    const value = cells[i].value;
    cell.textContent = value;
  
    const left = cells[i].left;
    const top =  cells[i].top;

    cells[i].element = cell;

    cell.style.width = `${cellSize}%`;
    cell.style.height = `${cellSize}%`;
  
    cell.style.left = `${left*cellSize}%`;
    cell.style.top = `${top*cellSize}%`;
  
    field.append(cell);
  
  }

}
