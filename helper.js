// Elem tukrozese es fogatasa

export function mirror3x3Matrix(orig){
    const mirrored = [];
    for(let i = 0; i < 3; i++){
        const arr = Array(3);      
        for(let j = 0; j < 3; j++){
            arr[j] = orig[i][2-j];
        }
        mirrored.push(arr);
    }    
    return mirrored;
}

export function rotate3x3Matrix(orig){
    const rotated = [];
    for(let i = 0; i < 3; i++){
        const arr = Array(3);     
        for(let j = 0; j < 3; j++){
            arr[j] = orig[2-j][i];
        }
        rotated.push(arr);
    }
    return rotated;
}

// Egy kuldetesert kapott pontok kiszamitasa

export function countMissionPoints(currentMission, fieldValues){    
    if(fieldValues.length == 0){
        return 0;
    }
    let points = 0;
    switch(currentMission.identifier){        
        case 'azerdoszele':
            for(let col = 0; col < 11; col++){
                if(fieldValues[0][col] == "forest"){
                    points++;
                }
                if(fieldValues[10][col] == "forest"){
                    points++;
                }
            }
            for(let row = 1; row < 10; row++){
                if(fieldValues[row][0] == "forest"){
                    points++;
                }
                if(fieldValues[row][10] == "forest"){
                    points++;
                }
            }
            console.log("Erdoszele, points=", points); 
            break;
        case 'almosvolgy':
            // pontosan 3 erdomezo egy sorban
            for(let row = 0; row < 11; row++){
                const forestCnt = fieldValues[row].filter((t) => t == "forest").length;
                if(forestCnt == 3){
                    points += 4;
                }
            }
            console.log("Almosvolgy, points=", points); 
            break;
        case 'krumpliontozes':
            // farmmezokkel szomszedos viz mezok
            let FWCnt = 0;
            for(let row = 0; row < 11; row++){                
                for(let col = 0; col < 11; col++){
                    if(fieldValues[row][col] == "farm"){
                        FWCnt += neighbourValues(row, col, fieldValues).filter((t) => t == "water").length;
                    }
                }
            }
            points += (2 * FWCnt);
            console.log("Krumpliontozes, points=", points);
            break;
        case 'hatarvidek':
            // a hegy telinek szamit a pelda abra alapjan
            for(let ind = 0; ind < 11; ind++){
                // ha teli a sor
                if(fieldValues[ind].every((t) => t != "base")){
                    points += 6;
                }
                // teli oszlop vizsgalata
                let fullCol = true;
                for(let row = 0; row < 11; row++){
                    if(fieldValues[row][ind] == "base"){
                        fullCol = false;
                    }
                }
                if(fullCol){
                    points += 6;
                }
            }
            console.log("Hatarvidek, points=", points);
            break;
        case 'fasor':
            // fuggolegesen egybefuggo leghosszabb fasor minden eleme
            // maximum kereses
            let maxAllForest = 0;
            for(let col = 0; col < 11; col++){
                // legtobb osszefuggo egy oszlopban
                let max = 0;
                let sum = 0;
                for(let row = 0; row < 11; row++){
                    if(fieldValues[row][col] == "forest"){ 
                        sum++;
                        if(sum > max) {
                            max = sum;
                        }
                    }
                    else {                        
                        sum = 0;
                    }
                }
                if(max > maxAllForest){
                    maxAllForest = max;
                }
            }
            points += maxAllForest * 2;
            break;
        case 'gazdagvaros':
            // legalabb 3 kulonbozo tereptipussal szomszedos falumezo
            let cnt3Diff = 0;
            for(let row = 0; row < 11; row++){
                for(let col = 0; col < 11; col++){
                    if(fieldValues[row][col] == "town"){
                        const allNeighbours = neighbourValues(row, col, fieldValues);
                        const diffNeighbours = new Set();
                        for(let n = 0; n < allNeighbours.length; n++){
                            if(allNeighbours[n] != "base") diffNeighbours.add(allNeighbours[n]);
                        }
                        if(diffNeighbours.size >= 3) cnt3Diff++;
                    }
                }
            }
            points += cnt3Diff * 3;
            break;
        case 'ontozocsatorna':
            // oszlopban egyezo szamu farm es viz            
            for(let col = 0; col < 11; col++){
                let waterCnt = 0;
                let farmCnt = 0;
                for(let row = 0; row < 11; row++){
                    if(fieldValues[row][col] == "water"){
                        waterCnt++;
                    }
                    else if(fieldValues[row][col] == "farm"){
                        farmCnt++;
                    }
                }
                if(waterCnt != 0 && waterCnt == farmCnt){
                    points += 4;
                }
            }
            break;
        case 'magusokvolgye':
            // hegymezokkel szomszedos viz mezok
            let MWCnt = 0;
            for(let row = 0; row < 11; row++){                
                for(let col = 0; col < 11; col++){
                    if(fieldValues[row][col] == "mountain"){
                        MWCnt += neighbourValues(row, col, fieldValues).filter((t) => t == "water").length;
                    }
                }
            }
            points += (3 * MWCnt);
            break;
        case 'urestelek':
            // falumezokkel szomszedos ures mezok
            let cnt = 0;
            for(let row = 0; row < 11; row++){                
                for(let col = 0; col < 11; col++){
                    if(fieldValues[row][col] == "town"){
                        cnt += neighbourValues(row, col, fieldValues).filter((t) => t == "base").length;
                    }
                }
            }
            points += (2 * cnt);
            break;
        case 'sorhaz':
            // vizszintesen egybefuggo leghosszabb falu minden eleme
            // maximum kereses
            let maxAllTown = 0;
            for(let row = 0; row < 11; row++){
                // legtobb osszefuggo egy sorban
                let max = 0;
                let sum = 0;
                for(let col = 0; col < 11; col++){
                    if(fieldValues[row][col] == "town"){ 
                        sum++;
                        if(sum > max) {
                            max = sum;
                        }
                    }
                    else {                        
                        sum = 0;
                    }
                }
                if(max > maxAllTown){
                    maxAllTown = max;
                }
            }
            points += maxAllTown * 2;
            break;
        case 'paratlansilok':
            // paratlansorszamu teli oszlop            
            for(let col = 0; col < 11; col+=2){
                let isFull = true;
                for(let row = 0; row < 11; row++){
                    if(fieldValues[row][col] == "base"){
                        isFull = false;
                    }
                }
                if(isFull){
                    points += 10;
                }
            }
            break;
        case 'gazdagvidek':
            // legalabb 5 kulonbozo tereptipust tartalmazo sor (minden tereptipust tartalmaz, base nem tereptipus)
            let count = 0;
            for(let row = 0; row < 11; row++){
                if(fieldValues[row].includes("forest") && fieldValues[row].includes("town") && fieldValues[row].includes("farm") && fieldValues[row].includes("water") && fieldValues[row].includes("mountain")) count++;
            }
            points += count * 4;
            break;
        default:
            break;
    }
    return points;
}

function neighbourValues(row, col, fieldValues){
    const neighbours = [];
    if(row-1 > -1) neighbours.push(fieldValues[row-1][col]);
    if(row+1 < 11) neighbours.push(fieldValues[row+1][col]);
    if(col-1 > -1) neighbours.push(fieldValues[row][col-1]);
    if(col+1 < 11) neighbours.push(fieldValues[row][col+1]);
    return neighbours;
}

export function borderedMountains(fieldValues){
    if(fieldValues.length == 0){
        return 0;
    }
    const mountainPos = [[2,2], [4,9], [6,4], [9,10], [10,6]];
    let BMCnt = 0;
    for(let ind = 0; ind < 5; ind++){
        if(!neighbourValues(mountainPos[ind][0]-1, mountainPos[ind][1]-1, fieldValues).includes("base")){
            BMCnt++;
        }
    }
    return BMCnt;
}