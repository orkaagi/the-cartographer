import { getMissions, getMissionElements } from './elements.js';
import { countMissionPoints, borderedMountains, mirror3x3Matrix, rotate3x3Matrix } from './helper.js';

let currElementInd = 0;
let missionElements = getMissionElements();
let currentElement = missionElements[currElementInd];

window.onload = () => {
    totalTime = 0;
    fieldValues = [];
    spPts = 0;
    sumPts = 0;
    auPts = 0;
    wiPts = 0;
    firstMessage = true;
    updatePoints();
    updateSeason();
    updateSeasonTimeLeft();
    setupField();
    updateField();
    initDisplayElement();
    setupMissions();
};

// Jatek vege ellenorzese

let totalTime;
let firstMessage;

function isGameOver(){
    if(totalTime < 28){
        return false;
    } 
    else if(firstMessage){
        window.alert(`Játék vége! Az összpontszámod: ${spPts + sumPts + auPts + wiPts}`);
        firstMessage = false;        
    }
    return true;
}

//  Jatekmezo inicializalasa

const mountainPos = [[2,2], [4,9], [6,4], [9,10], [10,6]];
const table = document.querySelector("#field");
let fieldValues;

function setupField(){
    for(let i = 0; i < 11; i++){
        fieldValues.push([]);        
        const row = table.insertRow();
        for(let j = 0; j < 11; j++){
            row.insertCell();
        }
    }

    for(let i = 0; i < 11; i++){
        for(let j = 0; j < 11; j++){
            fieldValues[i].push("base");
            const cellContent = document.createElement("img");
            cellContent.src = 'assets/tiles/base_tile.png';
            cellContent.style.width = '100%';
            cellContent.style.height = '100%';
            cellContent.dataset.rowInd = i;
            cellContent.dataset.colInd = j;            
            cellContent.addEventListener('mouseenter', (e) => setTileHoverState(e, true));
            cellContent.addEventListener('mouseleave', (e) => setTileHoverState(e, false));
            cellContent.addEventListener('click', clickTile);
            table.rows[i].cells[j].appendChild(cellContent);
        }
    }
    mountainPos.forEach(elem => { fieldValues[elem[0]-1][elem[1]-1] = "mountain"; });
}

// Jatekmezok firssitese

function setTileHoverState(event, isAdd = true){
    if (isGameOver()) {
        return;
    }
    let row = event.target.dataset.rowInd;
    let col = event.target.dataset.colInd;
    if (isAdd) {
        let state;
        if(isValidposition(event.target.dataset.rowInd, event.target.dataset.colInd, currentElement.shape)){
            state = "validpos";            
        }
        else { 
            state = "invalidpos";
        }        
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(currentElement.shape[i+1][j+1] == 1 && -1 < Number(row)+i && Number(row)+i < 11 && -1 < Number(col)+j && Number(col)+j < 11){
                    table.rows[Number(row)+i].cells[Number(col)+j].classList.add(state);
                }
            }
        }
    } 
    else {
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(currentElement.shape[i+1][j+1] == 1 && -1 < Number(row)+i && Number(row)+i < 11 && -1 < Number(col)+j && Number(col)+j < 11){
                    table.rows[Number(row)+i].cells[Number(col)+j].classList.remove("validpos");
                    table.rows[Number(row)+i].cells[Number(col)+j].classList.remove("invalidpos");
                }
            }
        }
    }
}

function updateField(){
    for(let i = 0; i < 11; i++){
        for(let j = 0; j < 11; j++){
            table.rows[i].cells[j].firstChild.src = 'assets/tiles/' + fieldValues[i][j] + '_tile.png';
        }
    }
}

//  Pontok frissitese

const springPts = document.querySelector("#spring-pts");
const summerPts = document.querySelector("#summer-pts");
const autumnPts = document.querySelector("#autumn-pts");
const winterPts = document.querySelector("#winter-pts");
const totalPts = document.querySelector("#total-pts");
let spPts, sumPts, auPts, wiPts;

function updatePoints(){
    let currSeason = Math.floor(totalTime / 7);
    switch(currSeason){
        case 0:
            spPts += countMissionPoints(missionA, fieldValues);
            spPts += countMissionPoints(missionB, fieldValues);
            spPts += borderedMountains(fieldValues);
            break;
        case 1:
            sumPts += countMissionPoints(missionB, fieldValues);
            sumPts += countMissionPoints(missionC, fieldValues);
            sumPts += borderedMountains(fieldValues);
            break;
        case 2:
            auPts += countMissionPoints(missionC, fieldValues);
            auPts += countMissionPoints(missionD, fieldValues);
            auPts += borderedMountains(fieldValues);
            break;
        case 3:
            wiPts += countMissionPoints(missionD, fieldValues);
            wiPts += countMissionPoints(missionA, fieldValues);
            wiPts += borderedMountains(fieldValues);
            break;
        default:
            break;
    }

    springPts.innerText = spPts;
    summerPts.innerText = sumPts;
    autumnPts.innerText = auPts;
    winterPts.innerText = wiPts;
    totalPts.innerText = spPts + sumPts + auPts + wiPts;
}

//  Evszak frissitese

const seasonTexts = ["Spring (AB)", "Summer (BC)", "Autumn (CD)", "Winter (DA)", "-"];
const currSeasonText = document.querySelector("#current-season");

function updateSeason(){
    let currSeason = Math.floor(totalTime / 7);
    currSeasonText.innerText = seasonTexts[currSeason];
}

//  Evszakbol hatralevo ido frissitese

const seasonTimeLeft = document.querySelector("#time-left");

function updateSeasonTimeLeft(){
    seasonTimeLeft.innerText = 7 - (totalTime % 7);
}

// 4 kuldetes megjelenitese es kinezetuk frissitese

const missions = getMissions();
const missionA = missions[0];
const missionB = missions[1];
const missionC = missions[2];
const missionD = missions[3];

function setupMissions(){
    document.querySelector("#mission-A").src = "assets/missions/" + missionA.identifier + ".png";
    document.querySelector("#mission-B").src = "assets/missions/" + missionB.identifier + ".png";
    document.querySelector("#mission-C").src = "assets/missions/" + missionC.identifier + ".png";
    document.querySelector("#mission-D").src = "assets/missions/" + missionD.identifier + ".png";

    updateMissions();
}

function updateMissions(){
    let currSeason = Math.floor(totalTime / 7);
    switch(currSeason){
        case 0:
            document.querySelector("#mission-A").classList.add("springMission");
            document.querySelector("#mission-B").classList.add("springMission");
            break;
        case 1:
            document.querySelector("#mission-A").classList.remove("springMission");
            document.querySelector("#mission-B").classList.remove("springMission");
            document.querySelector("#mission-B").classList.add("summerMission");
            document.querySelector("#mission-C").classList.add("summerMission");
            break;
        case 2:
            document.querySelector("#mission-B").classList.remove("summerMission");
            document.querySelector("#mission-C").classList.remove("summerMission");
            document.querySelector("#mission-C").classList.add("autumnMission");
            document.querySelector("#mission-D").classList.add("autumnMission");
            break;
        case 3:
            document.querySelector("#mission-C").classList.remove("autumnMission");
            document.querySelector("#mission-D").classList.remove("autumnMission");
            document.querySelector("#mission-D").classList.add("winterMission");
            document.querySelector("#mission-A").classList.add("winterMission");
            break;
        default:
            break;
    }
    
}

// Elem megjelenitese

const timeValue = document.querySelector("#time-value");
const smallTable = document.querySelector("#next-element");

function initDisplayElement(){
    for(let i = 0; i < 3; i++){
        const row = smallTable.insertRow();
        for(let j = 0; j < 3; j++){
            row.insertCell();
        }
    }
    displayElement();
}

function displayElement(){
    timeValue.innerText = currentElement.time;
    let type = currentElement.type;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(currentElement.shape[i][j] == 1){
                smallTable.rows[i].cells[j].innerHTML = "<img src=\"assets/tiles/" + type + "_tile.png\" width=\"55px\">";
            }
            else {
                smallTable.rows[i].cells[j].innerHTML = "";
            }           
        }
    }
}

const rotateBtn = document.querySelector("#rotate-btn");
const mirrorBtn = document.querySelector("#mirror-btn");

rotateBtn.addEventListener("click", rotateElement);
mirrorBtn.addEventListener("click", mirrorElement);

function rotateElement(){
    let old = currentElement.shape;
    currentElement.shape = rotate3x3Matrix(old);
    displayElement();
}

function mirrorElement(){
    let old = currentElement.shape;
    currentElement.shape = mirror3x3Matrix(old);
    displayElement();
}

// Elem elhelyezese

function isValidposition(row, col, toPlace){    
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){            
            if(Number(row)+i < 0 || 10 < Number(row)+i || Number(col)+j < 0 || 10 < Number(col)+j){
                // ha van olyan cella, ami kilogna a tablarol
                if(toPlace[i+1][j+1] == 1){
                    return false;
                }                
            }
            // a palyan belul levo cellakra, ha van olyan, ami mar foglalt
            else if(toPlace[i+1][j+1] == 1 && fieldValues[Number(row)+i][Number(col)+j] != "base"){
                return false;
            }
        }
    }
    return true;
}

function clickTile(event){
    if (isGameOver()) {
        return;
    }
    let row = event.target.dataset.rowInd;
    let col = event.target.dataset.colInd;
    // ervenyes helyre tortent kattintas eseten
    if(isValidposition(row, col, currentElement.shape)){
        // frissitjuk a matrix ertekeit es megjelenitjuk
        let type = currentElement.type;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(currentElement.shape[i+1][j+1] == 1){
                    fieldValues[Number(row)+i][Number(col)+j] = type;
                    table.rows[Number(row)+i].cells[Number(col)+j].classList.remove("validpos");
                }
            }
        }
        // ha evszak valtozas tortenik
        if(Math.floor(totalTime / 7) != Math.floor((totalTime + currentElement.time) / 7)){
            // frissitjuk az egyes evszakok pontjait
            updatePoints();
            // ujrakeverjuk az elemeket            
            missionElements = getMissionElements();
            currElementInd = -1;   
        }

        // frissitjuk az eltelt idot
        totalTime += currentElement.time;
        updateSeasonTimeLeft();

        // frissitjuk a kuldetesek megjeleneset, hogy egyezzen a jelenlegi evszakkal
        updateSeason();
        updateMissions();

        updateField();        

        // uj lehelyezendo elemet sorsolunk es megjelenitjuk
        currElementInd++;
        currentElement = missionElements[currElementInd];
        displayElement();
    }
}

// jatek befejezese (pl abban az esetben, ha nem lehet tobb mezot lerakni)

const newGameeBtn = document.querySelector("#end-game-btn");
newGameeBtn.addEventListener("click", endGame);

function endGame(){
    totalTime = 28;
    isGameOver();
}