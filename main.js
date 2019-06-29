//создаем мины, 
//возращаем ф-ию как массив, в нем рандомные числа,
//число означает номер клетки где будет мина
let generationBombs =(b, n) => { //количество бомб, диапазон 0 до "n" рандом число(количество клеток)
  let bombs = [];
  let randTrBomb, randFlag;

  while(bombs.length !== b) { //пока массив не будет заполнен(рандом числа)
    randFlag = true;
    randTrBomb = Math.floor(Math.random() *(n - 0)); //диапазон кол. бомб
    
    if(bombs.length === 0) bombs.push(randTrBomb);

    for(let i = 0; i <= bombs.length; i++) {
      if(randTrBomb === bombs[i]) randFlag = false;
    }

    if(randFlag) bombs.push(randTrBomb);
  }
  return bombs;
};


//создаем таблицу, зарание есть клетки со знаком "+",
//в этой клетка "+" будет расположена мина
let creatingTable = (c, r, b) => { //сell, rows, bombs
  let numTD = 0, tdFlag, count, bombsOnField;
  count  = c * r; //мы выбрали диапазон от a - b
  bombsOnField = generationBombs(b, count);
  let table = ['<table>'];

    for(let i = 1; i <= c; i++) {
      table.push('<tr>');
      
      for(let j = 0; j < r; j++) {
        tdFlag = true;

        for(let k = 0; k < count; k++) {
          if(numTD === bombsOnField[k]) {
            table.push('<td style="background: black">+</td>');
            tdFlag = false;
          }
        }

        if(tdFlag) table.push('<td>*</td>');
        ++numTD;
      }

      table.push('</tr>');
    }

  table.push('</table>');
  return document.getElementById('table').innerHTML = table.join('\n');
};



/* SEARCHING IN ROWS */

//в ф-ие двигаемся до нижней бобмбыи
//передаем массив со всем рядками где будем искать бомбы
let openTDs = (objTD) => {
  
  let cell = objTD.cellIndex;
  let aboveBomb = aboveBombTo = firstTopBomb(objTD, cell);  //вызываем ф-ию "firstTopBomb" и получаем 
                                //индекс рядок с первой бомбой
  for(let i = aboveBomb; i < objTD.collTR.length; i++) {
    let cellTD = objTD.collTR[i].cells[cell];

    if(checkBombAround(objTD, cellTD)) {
      break;
    } else { 
      objTD.activeTR.push(objTD.collTR[i]);
      aboveBomb = i;
    };
  }

  moveLeftAndRight(objTD, cell, aboveBombTo); // -, и-кс cell в ряду
}


//ф-ия ищет первую бобмбу сверху в этои столбике
//и возрвращает номер рядка
let firstTopBomb = (objTD, cell) => {
  let row = objTD.rowIndex;
  
  for(let i = row; i >= 0 ; i--) {
    let cellTD = objTD.collTR[i].cells[cell];
    
    if(checkBombAround(objTD, cellTD)) {
      break;
    } else {
      row = i;
    };
    
  }
  return row; // ряд и-кс первой бобмбы
}



/* SEARCHING IN CELLS */

//вызываем и получаем инд. ячейки
// откуда будем двиг. вправо
let moveLeftAndRight = (objTD, cell, aboveBombTo) => {
  
  for(let i = 0; i < objTD.activeTR.length; i++) {
    let leftBomInRow = moveLeft(objTD, cell, i); // -, и-кс cell в ряду, и-кс рядка

    for(let j = leftBomInRow; j < objTD.collTR.length; j++) {
      let cellTD = objTD.activeTR[i].cells[j];

      if(checkBombAround(objTD, cellTD)) {
        break;
      } else {
        objTD.activeTD.push(cellTD);
      }
      
    }
    aboveBombTo++;
  }
  //заполняем клетки без бомб
  paintingTD(objTD);
}


//красим клетки
let paintingTD = (objTD) => {
  for (const td of objTD.activeTD) {
    switch(td.textContent) {
      case '1': td.classList.add('colorRed_1'); break;
      case '2': td.classList.add('colorRed_2'); break;
      case '3': td.classList.add('colorRed_3'); break;
      case '4': td.classList.add('colorRed_4'); break;
      case '5': td.classList.add('colorRed_5'); break;
      case '6': td.classList.add('colorRed_6'); break;
      case '7': td.classList.add('colorRed_7'); break;
      case '8': td.classList.add('colorRed_8'); break;
      default: td.classList.add('colorRed');
    }
  }
}


//поиск крайней бомбы справа
//передаем инд. клетки, вызывающая ф-ия будет 
//начинать с этого инд.
let moveLeft = (objTD, cell, i) => {
  
  for(let k = cell; k >= 0 ; k--) {
    let cellTD = objTD.activeTR[i].cells[k];
    if(checkBombAround(objTD, cellTD)) {
      break;
    } else {
      cell = k;
    };
  }
  return cell; // и-кс крйней ячейки слева
}



/* CHECK BOMBS фкщгтв*/

//проверка нажатой ячейки,
//если бомба то проиграл, иначе вызывем "openTDs"
let youLose = (objTD) => {
  if(objTD.collTR[objTD.rowIndex].cells[objTD.cellIndex].textContent === '+') {
    console.log('you lose :-)'); return;
  };
  openTDs(objTD); // -
}


//Ф-ия проверяет клетки рядом на бобмбы (1-я часть)
//внутри вызывакм другую ф-ию для подсчета бобм вокруг клетки
let checkBombAround = (objTD, cellTD) => {
  let { 
    startTRIndex, bombs, 
    startTR, startTDIndex, 
    currentTDBombs, foundBombs 
  } = variablesChecking(objTD, cellTD);
  
  for(let i = 0; i < 3; i++) {
    if(startTRIndex === -1 || startTRIndex === objTD.collTR.length) continue; // если клетка за пределами таблицы то пропуск
    bombs += countBombs(objTD, startTR, startTRIndex, startTDIndex); // -, начальная клетка, + _ + |,  _ + +
    startTRIndex++;
  }
  
  currentTDBombs.textContent = bombs;
  objTD.activeTD.push(currentTDBombs);
  if(bombs > 0) foundBombs = true;

  return foundBombs;
}

//деструктуризация для проверки(checkBombAround) 
function variablesChecking(objTD, cellTD) {
  let startTR = objTD.table;
  let currentTDBombs = startTR.rows[cellTD.parentNode.rowIndex].cells[cellTD.cellIndex];
  let startTRIndex = cellTD.parentNode.rowIndex - 1;
  let startTDIndex = cellTD.cellIndex - 1;
  let bombs = 0;
  let foundBombs = false;
  return { startTRIndex, bombs, startTR, startTDIndex, currentTDBombs, foundBombs };
}


//Ф-ия проверяет клетки рядом на бобмбы (2-я часть)
//ф-ия вернет кол. бомб запишет в клетку
function countBombs(objTD, startTR, startTRIndex, startTDIndex) {
  let bombs = 0;

  for(let j = 0; j < 3; j++) {
    let currentTD = startTR.rows[startTRIndex].cells[startTDIndex];
    if(startTDIndex === -1 || startTDIndex === objTD.collTR.length) continue; // если клетка за пределами таблицы то пропуск
    if (currentTD.textContent === '+') bombs += 1; // если в клетке бобма то +;
    startTDIndex++;
  }
  return bombs;
}

//** */



/* START GAME */

//при клике по 'td' получаем его 'index'(row, cell)
//передаем 'obj' в 'openTDs'
let handlerOnTD = (e) => {
  if(e.target.tagName === 'TD') {
    let objTD = {
      table : document.getElementsByTagName('tbody')[0], //получаем обновленную табл.
      collTR: this.table.getElementsByTagName('tr'),
      rowIndex: e.target.parentNode.rowIndex, // row index
      cellIndex: e.target.cellIndex, // cell index
      activeTD: [],
      activeTR: [] //массив, куда будут попадать 'tr' от выбраного 'td'. вверх и вниз в столбике
            //до первой мины сверху или снизу
    }
    // checkCurentTD(objTD);
    youLose(objTD);
  }
};


creatingTable(9,9,10);
addEventListener('mousedown', handlerOnTD);
