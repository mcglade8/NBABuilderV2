function handlecsv(element){
    clearOldData();
    var csv = document.getElementById(element).files[document.getElementById(element).files.length-1];
    var reader = new FileReader();
    // save csv to storage as JSON
    reader.onload = function(e){
        var csv = e.target.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for(let i = 1; i < lines.length; i++){
            var obj = {};
            var currentline = lines[i].split(",");
            for(let j = 0; j < headers.length; j++){
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        //localStorage.contestData = JSON.stringify(result);
        //location.reload();
        //DKSalariesNBA = result;//JSON.stringify(result);
        getContestData(result);

    }
    reader.readAsText(csv);

}

function clearOldData(){
    var table = document.getElementById("contestDataTable");
    var rows = table.rows;
    for(let i = rows.length-1; i > 0; i--){
        table.deleteRow(i);
    }
    localStorage.removeItem("tableDataNBA");
    localStorage.removeItem("DKSalariesNBA");
}

async function getContestData(DKSalariesNBA){
    var contestData = [];
    localStorage.DKSalariesNBA = JSON.stringify(DKSalariesNBA);
    // Add contest info from uploaded file to contestData
    // var contestDate = document.getElementById("contestDate").value;
    // var contestName = document.getElementById("contestName").value;
    for(let i of DKSalariesNBA){
        if('Game Info' in i) if(i['Game Info'] != undefined) contestData.push(i);
        if('Game' in i) if(i['Game'] != undefined){
            contestData.push(i);
            i['Team'] = fixTeamAbbrev(i['Team']);
            i['Opponent'] = fixTeamAbbrev(i['Opponent']);
        }
    }
    //addSelectOption(contestName, contestDate);
    addTableRows(contestData);
}

fixTeamAbbrev = (team) => {
    switch(team){
        case "PHO": return "PHX";
        case "NY": return "NYK";
        case "NO": return "NOP";
        case "SA": return "SAS";
        case "GS": return "GSW";
    }
    return team;
}

// Populates the table with data from contestData
function addTableRows(contestData){
    var table = document.getElementById("contestDataTable");
    var ids = [];
    var rows = table.rows;
    for(let i=0; i < rows.length; i++){
        let r = rows[i];
        if(Number(r.rowIndex)>0) ids.push(r.cells[6].innerHTML.trim());
    }
    for(let p of contestData){
        
        if('Game Info' in p) {
            var opponent = getOpp(p['Game Info'].split(" ")[0], p['TeamAbbrev']);
            // If player is already in table, skip it. Otherwise add to playersInList
            if(!ids.includes(p['ID'])) {
                ids.push(p['ID'].trim());
                var row = table.insertRow(-1);
                var pos = row.insertCell(0);
                var name = row.insertCell(1);
                var salary = row.insertCell(2);
                var team = row.insertCell(3);
                var opp = row.insertCell(4);
                var id = row.insertCell(5);
                var proj = row.insertCell(6);
                var value = row.insertCell(7);
                var own = row.insertCell(8);
                pos.innerHTML = p['Position'];
                name.innerHTML = convertToDKName(p['Name']);
                salary.innerHTML = p['Salary'];
                team.innerHTML = p['TeamAbbrev'];
                opp.innerHTML = opponent;
                id.innerHTML = p['ID'];
                proj.innerHTML = 0;
                value.innerHTML = 0;
                own.innerHTML = 0;

            }
        }else{
            // If player is already in table, skip it. Otherwise add to playersInList
            if(!ids.includes(p['Id'])) {
                ids.push(p['Id'].trim());
                var row = table.insertRow(-1);
                var pos = row.insertCell(0);
                var name = row.insertCell(1);
                var salary = row.insertCell(2);
                var team = row.insertCell(3);
                var opp = row.insertCell(4);
                var id = row.insertCell(5);
                var proj = row.insertCell(6);
                var value = row.insertCell(7);
                var own = row.insertCell(8);
                pos.innerHTML = p['Position'];
                name.innerHTML = convertToFDName(p['Nickname']);
                salary.innerHTML = p['Salary'];
                team.innerHTML = p['Team'];
                opp.innerHTML = p['Opponent'];
                id.innerHTML = p['Id'];
                proj.innerHTML = 0;
                value.innerHTML = 0;
                own.innerHTML = 0;
            }
        }
    }
    savetableDataNBA();
    
    location.reload();
}

convertToFDName = (name) => {
    switch(name){
        case "Jaren Jackson": return "Jaren Jackson Jr.";
        case "Wendell Carter": return "Wendell Carter Jr.";
        case "Tim Hardaway": return "Tim Hardaway Jr.";
        case "Otto Porter": return "Otto Porter Jr.";
        case "TJ Warren": return "T.J. Warren";
        case "PJ Tucker": return "P.J. Tucker";
        case "Wesley Matthews": return "Wes Matthews";
        case "TJ McConnell": return "T.J. McConnell";
        case "Derrick Jones": return "Derrick Jones Jr.";
        case "Jabari Smith": return "Jabari Smith Jr.";
        case "Trey Murphy": return "Trey Murphy III";
        case "Kelly Oubre": return "Kelly Oubre Jr.";
        case "Marvin Bagley": return "Marvin Bagley III";
        case "Vince Williams": return "Vince Williams Jr.";
        case "Marcus Morris": return "Marcus Morris Sr.";
        case "Gary Trent": return "Gary Trent Jr.";
        case "Kevin Knox": return "Kevin Knox II";
        case "KJ Martin": return "Kenyon Martin Jr.";
        case "Larry Nance": return "Larry Nance Jr.";
        case "Dereck Lively": return "Dereck Lively II";
        case "Michael Porter": return "Michael Porter Jr.";
        case "Craig Porter": return "Craig Porter Jr.";
        case "Jaime Jaquez": return "Jaime Jaquez Jr.";
    }
    return name;
}


convertToDKName = (name) => {
    switch(name){
        case "PJ Washington": return "P.J. Washington";
    }
    return name;
}

function getOpp(gameInfo, team){
    var opp = "";
    var gameInfo = gameInfo.split("@");
    if(gameInfo[0] == team) opp = gameInfo[1];
    else opp = gameInfo[0];
    return opp;
}

// Save contestDataTable data for access at a later date
function savetableDataNBA(){
    var table = document.getElementById("contestDataTable");
    var rows = table.rows;
    var tableDataNBA = [];
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var rowData = {};
        var firstRow = rows[0];
        for (var j = 0; j < row.cells.length; j++) {
            let info = firstRow.cells[j].innerHTML;
            rowData[info] = row.cells[j].innerHTML;
            
            
        }

        tableDataNBA.push(rowData);

    }
    localStorage.setItem("tableDataNBA", JSON.stringify(tableDataNBA));
}

// Load contestDataTable data from local storage
function loadtableDataNBA(){
    var table = document.getElementById("contestDataTable");
    var tableDataNBA = JSON.parse(localStorage.getItem("tableDataNBA"));
    var firstRow = table.rows[0];
    for (var i = 0; i < tableDataNBA.length; i++) {
        var row = table.insertRow(-1);
        for (let c of firstRow.cells) {
            let info = c.innerHTML;
            //if(info == "Own") continue;
            row.insertCell(-1).innerHTML = tableDataNBA[i][info];

        }
    }
}

function openTab(element){
    var tabs = document.getElementsByClassName("content");
    for(let i = 0; i < tabs.length; i++){
        tabs[i].style.display = "none";
    }
    if(element == "builder"){
        if(document.getElementById('contestDataTable').rows[1].cells[5].innerHTML.includes("-")) element = "fdBuilder";
    }
    var tab = document.getElementById(element);
    tab.style.display = "block";
}

$(document).ready(async function(){
    let promise = new Promise((resolve) => {
        loadtableDataNBA();
        resolve();
    });
    promise.then(() => {
        return getPlayerInfo();
    }).then(() => {
        
        return updateContestDataTable();
    }).then(() => {
        colorRowsBasedOnTeam(document.getElementById('contestDataTable'), 3);
        colorRowsBasedOnTeam(document.getElementById('playerAdjustTable'), 2);
        return applyInjuries();
    }).then(() => {
        return fillTeamMatchups();
    });
});

function applyInjuries(){
    var table = document.getElementById("playerAdjustTable");
    var rows = table.rows;
    if(localStorage.NBAInjuries) var injuries = JSON.parse(localStorage.NBAInjuries); else return;
    for(let i = 1; i < rows.length; i++){
        let row = rows[i];
        let name = row.cells[0].innerHTML;
        if(injuries.includes(name)){
            let btn = row.cells[6].getElementsByTagName("button")[0];
            toggleInjured(btn);
        }
    }
}

// Get info from JSON file
function getInfoFromJSON(file){
    var json = {};
    $.ajax({
        'async': false,
        'global': false,
        'url': file,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
}
// replace accented characters with non-accented characters
function replaceAccented(str){
    const latinRegEx = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    const comboRegEx = `[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]`;

    /** Used to map Latin Unicode letters to basic Latin letters. */
    const latinUnicodeLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',
    '\xc1': 'A',
    '\xc2': 'A',
    '\xc3': 'A',
    '\xc4': 'A',
    '\xc5': 'A',
    '\xe0': 'a',
    '\xe1': 'a',
    '\xe2': 'a',
    '\xe3': 'a',
    '\xe4': 'a',
    '\xe5': 'a',
    '\xc7': 'C',
    '\xe7': 'c',
    '\xd0': 'D',
    '\xf0': 'd',
    '\xc8': 'E',
    '\xc9': 'E',
    '\xca': 'E',
    '\xcb': 'E',
    '\xe8': 'e',
    '\xe9': 'e',
    '\xea': 'e',
    '\xeb': 'e',
    '\xcc': 'I',
    '\xcd': 'I',
    '\xce': 'I',
    '\xcf': 'I',
    '\xec': 'i',
    '\xed': 'i',
    '\xee': 'i',
    '\xef': 'i',
    '\xd1': 'N',
    '\xf1': 'n',
    '\xd2': 'O',
    '\xd3': 'O',
    '\xd4': 'O',
    '\xd5': 'O',
    '\xd6': 'O',
    '\xd8': 'O',
    '\xf2': 'o',
    '\xf3': 'o',
    '\xf4': 'o',
    '\xf5': 'o',
    '\xf6': 'o',
    '\xf8': 'o',
    '\xd9': 'U',
    '\xda': 'U',
    '\xdb': 'U',
    '\xdc': 'U',
    '\xf9': 'u',
    '\xfa': 'u',
    '\xfb': 'u',
    '\xfc': 'u',
    '\xdd': 'Y',
    '\xfd': 'y',
    '\xff': 'y',
    '\xc6': 'Ae',
    '\xe6': 'ae',
    '\xde': 'Th',
    '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',
    '\u0102': 'A',
    '\u0104': 'A',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u0105': 'a',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010a': 'C',
    '\u010c': 'C',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010b': 'c',
    '\u010d': 'c',
    '\u010e': 'D',
    '\u0110': 'D',
    '\u010f': 'd',
    '\u0111': 'd',
    '\u0112': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u0118': 'E',
    '\u011a': 'E',
    '\u0113': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u0119': 'e',
    '\u011b': 'e',
    '\u011c': 'G',
    '\u011e': 'G',
    '\u0120': 'G',
    '\u0122': 'G',
    '\u011d': 'g',
    '\u011f': 'g',
    '\u0121': 'g',
    '\u0123': 'g',
    '\u0124': 'H',
    '\u0126': 'H',
    '\u0125': 'h',
    '\u0127': 'h',
    '\u0128': 'I',
    '\u012a': 'I',
    '\u012c': 'I',
    '\u012e': 'I',
    '\u0130': 'I',
    '\u0129': 'i',
    '\u012b': 'i',
    '\u012d': 'i',
    '\u012f': 'i',
    '\u0131': 'i',
    '\u0134': 'J',
    '\u0135': 'j',
    '\u0136': 'K',
    '\u0137': 'k',
    '\u0138': 'k',
    '\u0139': 'L',
    '\u013b': 'L',
    '\u013d': 'L',
    '\u013f': 'L',
    '\u0141': 'L',
    '\u013a': 'l',
    '\u013c': 'l',
    '\u013e': 'l',
    '\u0140': 'l',
    '\u0142': 'l',
    '\u0143': 'N',
    '\u0145': 'N',
    '\u0147': 'N',
    '\u014a': 'N',
    '\u0144': 'n',
    '\u0146': 'n',
    '\u0148': 'n',
    '\u014b': 'n',
    '\u014c': 'O',
    '\u014e': 'O',
    '\u0150': 'O',
    '\u014d': 'o',
    '\u014f': 'o',
    '\u0151': 'o',
    '\u0154': 'R',
    '\u0156': 'R',
    '\u0158': 'R',
    '\u0155': 'r',
    '\u0157': 'r',
    '\u0159': 'r',
    '\u015a': 'S',
    '\u015c': 'S',
    '\u015e': 'S',
    '\u0160': 'S',
    '\u015b': 's',
    '\u015d': 's',
    '\u015f': 's',
    '\u0161': 's',
    '\u0162': 'T',
    '\u0164': 'T',
    '\u0166': 'T',
    '\u0163': 't',
    '\u0165': 't',
    '\u0167': 't',
    '\u0168': 'U',
    '\u016a': 'U',
    '\u016c': 'U',
    '\u016e': 'U',
    '\u0170': 'U',
    '\u0172': 'U',
    '\u0169': 'u',
    '\u016b': 'u',
    '\u016d': 'u',
    '\u016f': 'u',
    '\u0171': 'u',
    '\u0173': 'u',
    '\u0174': 'W',
    '\u0175': 'w',
    '\u0176': 'Y',
    '\u0177': 'y',
    '\u0178': 'Y',
    '\u0179': 'Z',
    '\u017b': 'Z',
    '\u017d': 'Z',
    '\u017a': 'z',
    '\u017c': 'z',
    '\u017e': 'z',
    '\u0132': 'IJ',
    '\u0133': 'ij',
    '\u0152': 'Oe',
    '\u0153': 'oe',
    '\u0149': "'n",
    '\u017f': 's',
    };

    const basePropertyOf = (object) => (key) => object[key];
    const characterMap = basePropertyOf(latinUnicodeLetters);
        
    if(str && typeof str === 'string'){
        return str.replace(latinRegEx, characterMap).normalize('NFD').replace(new RegExp(comboRegEx, 'g'), '');
    }
}

// Get info from JSON file
function getInfoFromJson(file){
    var json = {};
    $.ajax({
        'async': false,
        'global': false,
        'url': file,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
}

function convertPlayerNameToKey(json){
    var newJson = {};
    for(let p in json){
        if(json[p]['MIN'] == undefined || json[p]['MIN'] == null) var minutes = 0; else var minutes = json[p]['MIN'].substring(0,2);
        let name = replaceAccented(json[p]['PLAYER_NAME']);

        if(name in newJson) newJson[name] = (Number(minutes) + Number(newJson[name]))/2; else newJson[name] = minutes;
    }
    return newJson;
}

// Get player info from JSON file
async function getPlayerInfo(){
    let promise = new Promise((resolve) => {


    resolve(getInfoFromJson("data_from_google_sheets.json"));
    });

    promise.then((data) => {
        
        // add this info plus team to playerAdjust table; make FPs/Minute a range between 0 and 2 with step of 0.1; make minutes a range between 0 and 48 with step of 1, make Proj a text that updates to fps/minute * minutes
        var table = document.getElementById("playerAdjustTable");
        var contestDataTable = document.getElementById("contestDataTable");
        var savedData = localStorage.savedPlayerDataNBA ? JSON.parse(localStorage.savedPlayerDataNBA) : {};
        var rows = contestDataTable.rows;
        var teams = [];
        for(let r of rows){
            if(r.rowIndex == 0) continue;
            var row = table.insertRow(-1);
            var name = row.insertCell(0).innerHTML = r.cells[1].innerHTML;
            var position = row.insertCell(1).innerHTML = r.cells[0].innerHTML;
            var team = row.insertCell(2).innerHTML = r.cells[3].innerHTML;
            var proj = row.insertCell(3);
            var injured = row.insertCell(4);
            var topPlay = row.insertCell(5);
           if(!teams.includes(r.cells[3].innerHTML)) teams.push(r.cells[3].innerHTML);
            var player = r.cells[1].innerHTML;
            if(player in savedData) {
                proj.innerHTML = '<input type="range" value="'+Number(savedData[player]).toFixed(1)+'" min="0" max="80" step="0.1" oninput="updateProj(this)"><text>'+Number(savedData[player]).toFixed(1)+'</text>';
            } else if(player in data){
                proj.innerHTML = '<input type="range" value="'+(data[player]['Projection']).toFixed(1)+'" min="0" max="80" step="0.1" oninput="updateProj(this)"><text>'+(data[player]['Projection']).toFixed(1)+'</text>';
            } else{
                proj.innerHTML = '<input type="range" value="0" min="0" max="80" step="0.1" oninput="updateProj(this)"><text>0</text>';
            }

            var ownership = r.cells[8];
            if(player in data){ 
                r.cells[5].innerHTML.includes("-") ? ownership.innerHTML = data[player]['FDOwn'] : ownership.innerHTML = data[player]['DKOwn'];
            }else{
                ownership.innerHTML = 0;
            }

            injured.innerHTML = '<button class="healthy" onclick="toggleInjured(this)">Healthy</button>';
            if(!teams.includes(r.cells[3].innerHTML)) teams.push(r.cells[3].innerHTML);

            if(localStorage.topPlaysNBA){
                var topPlays = JSON.parse(localStorage.topPlaysNBA);
            }else{
                var topPlays = {};
            }
            if(localStorage.removedFromPoolNBA){
                var removedFromPool = JSON.parse(localStorage.removedFromPoolNBA);
            }else{
                var removedFromPool = {};
            }

            if(player in topPlays || Number(ownership.innerHTML) > 15){
                topPlay.innerHTML = '<button class="topPlay" onclick="togglePlay(this)">Top Play</button>';
            } else if(player in removedFromPool){
                topPlay.innerHTML = '<button class="removedFromPool" onclick="togglePlay(this)">Removed</button>';
            } else{
                topPlay.innerHTML = '<button class="inPool" onclick="togglePlay(this)">In Pool</button>';
            }
        }
        // Add teams to teamSelect
        var teamSelect = document.getElementById("teamSelect");
        teams = teams.sort();
        for(let t of teams){
            var option = document.createElement("option");
            option.text = t;
            option.value = t;
            teamSelect.add(option);
        }
        return;
    });    

}

function togglePlay(btn){
    var player = btn.parentNode.parentNode.cells[0].innerHTML;
    if(localStorage.topPlaysNBA){
        var topPlays = JSON.parse(localStorage.topPlaysNBA);
    }else{
        var topPlays = {};
    }
    if(localStorage.removedFromPoolNBA){
        var removedFromPool = JSON.parse(localStorage.removedFromPoolNBA);
    }else{
        var removedFromPool = {};
    }
    if(btn.innerHTML == "Top Play"){
        btn.innerHTML = "Removed";
        btn.className = "removedFromPool";
        removedFromPool[player] = 1;
        delete topPlays[player];
    } else if(btn.innerHTML == "Removed"){
        btn.innerHTML = "In Pool";
        btn.className = "inPool";
        delete removedFromPool[player];
    } else{
        btn.innerHTML = "Top Play";
        btn.className = "topPlay";
        topPlays[player] = 1;
        delete removedFromPool[player];
    }
    localStorage.topPlaysNBA = JSON.stringify(topPlays);
    localStorage.removedFromPoolNBA = JSON.stringify(removedFromPool);
}

async function team240(){
    let promise = new Promise((resolve) => {
    var table = document.getElementById("playerAdjustTable");
    // Ensuring team minutes add up to 240 (give or take rounding errors)
    var teamMins = {};
    var teamProj = {};
    var teamNewProj = {};
    var teamNumOut = {};
    for(let r of table.rows){
        if(r.rowIndex == 0) continue;
        if(r.cells[1].innerHTML in teamMins) teamMins[r.cells[1].innerHTML] += productOfAttributes(r.cells[3]); else teamMins[r.cells[1].innerHTML] = productOfAttributes(r.cells[3]);
        if(r.cells[1].innerHTML in teamProj) teamProj[r.cells[1].innerHTML] += Number(r.cells[2].getAttribute('origproj'))*Number(r.cells[3].getAttribute('origmins')); else teamProj[r.cells[1].innerHTML] = Number(r.cells[2].getAttribute('origproj'))*Number(r.cells[3].getAttribute('origmins'));
        if(r.cells[1].innerHTML in teamNewProj) teamNewProj[r.cells[1].innerHTML] += productOfAttributes(r.cells[2])*productOfAttributes(r.cells[3]); else teamNewProj[r.cells[1].innerHTML] = productOfAttributes(r.cells[2])*productOfAttributes(r.cells[3]);
        if(r.cells[1].innerHTML in teamNumOut && r.cells[5].getElementsByTagName('button')[0].innerHTML == "Injured") teamNumOut[r.cells[1].innerHTML] += productOfAttributes(r.cells[2])*productOfAttributes(r.cells[3])/30; else teamNumOut[r.cells[1].innerHTML] = productOfAttributes(r.cells[2])*productOfAttributes(r.cells[3])/30;
    }

    for(let r of table.rows){
        if(r.rowIndex == 0) continue;
        let teamMult = 240/Number(teamMins[r.cells[1].innerHTML]);
        let projMult = teamProj[r.cells[1].innerHTML]/teamNewProj[r.cells[1].innerHTML]*(1-0.05*teamNumOut[r.cells[1].innerHTML]);

        let startmins = Number(r.cells[3].getAttribute('origmins'));
        if(startmins > 35) teamMult = 1; else if(startmins > 30) teamMult = (2+teamMult)/3; else if(startmins > 26) teamMult = (1+teamMult)/2; else if(startmins > 18) teamMult=teamMult; else if(startmins > 10) teamMult = (teamMult+0.5)/2; else if(startmins > 5) teamMult = 0.5; else teamMult = 0;

        r.cells[3].getElementsByTagName("input")[0].value = (productOfAttributes(r.cells[3])*teamMult).toFixed(0);
        r.cells[2].getElementsByTagName("input")[0].value = (productOfAttributes(r.cells[2])*projMult).toFixed(2);
    }
    resolve();});
    promise.then(() => {
        var table = document.getElementById("playerAdjustTable");
        for(let r of table.rows){
            if(r.rowIndex == 0) continue;
            updateProj(r.cells[3].getElementsByTagName("input")[0]);
            updateProj(r.cells[2].getElementsByTagName("input")[0]);
        }   
    });
}

function filterPATable(){
    // only display rows which contain the criteria from teamSelect, positionSelect, and playSelect
    var table = document.getElementById("playerAdjustTable");
    var rows = table.rows;
    var teamSelect = document.getElementById("teamSelect");
    var positionSelect = document.getElementById("positionSelect");
    var playSelect = document.getElementById("playSelect");
    var team = teamSelect.options[teamSelect.selectedIndex].value;
    var position = positionSelect.options[positionSelect.selectedIndex].value;
    var play = playSelect.options[playSelect.selectedIndex].value;
    var totalProj = 0;
    var count = 0;
    for(let i = 1; i < rows.length; i++){
        let row = rows[i];
        let rowTeam = row.cells[2].innerHTML;
        let rowPosition = row.cells[1].innerHTML;
        let rowPlay = row.cells[5].getElementsByTagName("button")[0].innerHTML;
        if((team == "All" || rowTeam == team) && (position == "All" || rowPosition.includes(position)) && (play == "All" || rowPlay.includes(play))){
            row.style.display = "";
            totalProj += Number(row.cells[3].getElementsByTagName("input")[0].value);
            count++;
        }else{
            row.style.display = "none";
        }
    }
    fillTeamSummary(team, totalProj, count);
}


function fillTeamSummary(team, teamfps, count){
    var teamSummary = document.getElementById("teamSummary");
    if(teamSummary.rows.length == 1) teamSummary.insertRow(-1);
    teamSummary.rows[1].innerHTML = "";
    var row = teamSummary.rows[1];
    row.insertCell(0).innerHTML = team;
    row.insertCell(1).innerHTML = teamfps;
    row.insertCell(2).innerHTML = count;

}

function updateProj(element){
    var row = element.parentNode.parentNode;
    var text = element.nextElementSibling;
    text.innerHTML = element.value;

    if(localStorage.savedPlayerDataNBA){
        var savedData = JSON.parse(localStorage.savedPlayerDataNBA);
        var name = row.cells[0].innerHTML;
        var sliderValue = element.value;
        savedData[name] = sliderValue;
        localStorage.savedPlayerDataNBA = JSON.stringify(savedData);
    }else{
        var savedData = {};
        var name = row.cells[0].innerHTML;
        var sliderValue = element.value;
        savedData[name] = sliderValue;
        localStorage.savedPlayerDataNBA = JSON.stringify(savedData);
    }

    updateContestDataTable();
    filterPATable();
}

async function updateContestDataTable(){
    var table = document.getElementById("contestDataTable");
    var rows = table.rows;
    var adjustPlayers = document.getElementById("playerAdjustTable");
    var adjustRows = adjustPlayers.rows;

    for(let i = 1; i < rows.length; i++){
        let proj = adjustRows[i].cells[3].getElementsByTagName("input")[0].value;
        let sal = Number(rows[i].cells[2].innerHTML);
        let value = proj/sal*1000;
        rows[i].cells[6].innerHTML = proj;
        rows[i].cells[7].innerHTML = value.toFixed(1);
    }
}

async function buildLineups(only_one_lineup = false){
    if(only_one_lineup) var lineupsToBuild = 1; else var lineupsToBuild = document.getElementById("lineupsToBuild").value;

    var adjustPlayers = document.getElementById("playerAdjustTable");

    for(let i = 0; i < lineupsToBuild; i++){
        
        let promise = new Promise((resolve) => {
            resolve(getBlowouts());
        });
        promise.then((blowouts) => {
            var table = document.getElementById("contestDataTable");
            var rows = table.rows;

            var players = [];
            // get objects of all players from table and add to players
            // objects should have name as key and all other row info as values
            for(let i = 1; i < rows.length; i++){
                var pool = adjustPlayers.rows[i].cells[5].firstElementChild.innerHTML;
                var player = {};
                for(let j = 0; j < rows[i].cells.length; j++){
                    let info = rows[0].cells[j].innerHTML;
                    player[info] = rows[i].cells[j].innerHTML;
                }
                if(player['Projected'] < 14 || pool == "Removed") continue;
                if(pool == "Top Play"){ 
                    player['Top Play'] = 1; 
                }else player['Top Play'] = 0;
                // Add position to player object with value 1
                if(player.Position.includes("PG")){ 
                    player['PG'] = 1;
                    player['G'] = 1;
                }
                if(player.Position.includes("SG")){ 
                    player['SG'] = 1;
                    player['G'] = 1;
                }
                if(player.Position.includes("SF")){ 
                    player['SF'] = 1;
                    player['F'] = 1;
                }
                if(player.Position.includes("PF")){ 
                    player['PF'] = 1;
                    player['F'] = 1;
                }
                if(player.Position.includes("C")){ 
                    player['C'] = 1;
                }
                player['UTIL'] = 1;
                player[player.Team] = 1;

                player = randomizeProjection(player, blowouts);
                players[player.Name] = player;
            }

            return(players);
        }).then((players) => {
            // solve for max projection with constraints
            var topPlays = document.getElementById("minTopPlaysDK").value;
            var teams = [];
            var opponents = {};
            for(let p in players){
                if(!teams.includes(players[p].Team)) {
                    teams.push(players[p].Team);
                    opponents[players[p].Team] = players[p].Opponent;
                }
                players[p][alphabetize(players[p].Team, players[p].Opponent)] = 1;
            }
            
            var constraints = {
                "PG": {"max": 3},
                "SG": {"max": 3},
                "SF": {"max": 3},
                "PF": {"max": 3},
                "C": {"max": 2},
                "G": {"min": 4},
                "F": {"min": 4},
                "UTIL": {"equal": 8},
                "Salary": {"max": 50000},
                "Top Play": {"min" : topPlays}
            }
            for(let t of teams){
                constraints[t] = {"max": 4};
                let game = alphabetize(t, opponents[t]);
                constraints[game] = {"max": 7};
            }
            return [constraints, players];
        }).then((data) => {
            var constraints = data[0];
            var players = data[1];

            var model = {
                "optimize": "Projected",
                "opType": "max",
                "constraints": constraints,
                "variables": players,
                "binaries": players
            };

            return [model, players];
        }).then((data) => {
            require(['solver'], function(solver){
                var model = data[0];
                var players = data[1];

                var result= solver.Solve(model);
                addLineupToTable(result, players);
            }); 
        });
    }
}

function getBlowouts(){
    var table= $('#matchupsTable');
    var rows = table[0].rows;
    var blowouts = {};
    for(let i = 1; i < rows.length; i++){
        let row = rows[i];
        let team1 = row.cells[0].innerHTML;
        let team2 = row.cells[2].innerHTML;
        let team1Proj = Number($('#'+team1+'WinPct')[0].innerHTML);
        let team2Proj = Number($('#'+team2+'WinPct')[0].innerHTML);
        
        blowouts[team1] = {"blowout": fibMe(Math.floor(team1Proj/10))/100, "opp": team2};
        blowouts[team2] = {"blowout": fibMe(Math.floor(team2Proj/10))/100, "opp": team1};
    }
    for(b of Object.keys(blowouts)){
        if(blowouts[blowouts[b].opp]['blowout'] == 'blowout win'){
            blowouts[b]['blowout'] = 'blowout loss';
        }else if(blowouts[blowouts[b].opp]['blowout'] == 'shootout'){
            blowouts[b]['blowout'] = 'shootout';
        }else if(blowouts[b]['blowout'] !== 'blowout loss'){
            if(Math.random() < blowouts[b]['blowout']){ 
                blowouts[b]['blowout'] = 'blowout win';
                blowouts[blowouts[b].opp]['blowout'] = 'blowout loss';
            }else{
                if(Math.random() < 0.6) blowouts[b]['blowout'] = 'shootout'; else blowouts[b]['blowout'] = 'no blowout';
            }
        }
    }
    return blowouts;
}

function fibMe(num){
    switch(num){
        case 0: return 0;
        case 1: return 1;
        case 2: return 2;
        case 3: return 4;
        case 4: return 7;
        case 5: return 12;
        case 6: return 20;
        case 7: return 33;
        case 8: return 54;
        case 9: return 88;
        case 10: return 100;
        default: return 0;
    }

}

async function buildLineupsFD(only_one_lineup = false){
    if(only_one_lineup) var lineupsToBuild = 1; else var lineupsToBuild = document.getElementById("lineupsToBuildFD").value;
    
    for(let i = 0; i < lineupsToBuild; i++){
        
        let promise = new Promise((resolve) => {
            resolve(getBlowouts());
        });
        promise.then((blowouts) => {

            var table = document.getElementById("contestDataTable");
            var adjustPlayers = document.getElementById("playerAdjustTable");
            var rows = table.rows;
            var players = [];
            // get objects of all players from table and add to players
            // objects should have name as key and all other row info as values
            for(let i = 1; i < rows.length; i++){
                var pool = adjustPlayers.rows[i].cells[5].firstElementChild.innerHTML;
                var player = {};
                for(let j = 0; j < rows[i].cells.length; j++){
                    let info = rows[0].cells[j].innerHTML;
                    player[info] = rows[i].cells[j].innerHTML;
                }
                if(player['Projected'] < 14 || pool == "Removed") continue;
                if(pool == "Top Play"){ 
                    player['Top Play'] = 1; 
                    //console.log(player['Name']);
                }else player['Top Play'] = 0;                // Add position to player object with value 1
                if(player.Position.includes("PG")){ 
                    player['PG'] = 1;
                    player['UTIL'] = 1;
                    player['G'] = 1;
                }
                if(player.Position.includes("SG")){ 
                    player['SG'] = 1;
                    player['UTIL'] = 1;
                    player['G'] = 1;
                    player['S'] = 1;
                }
                if(player.Position.includes("SF")){ 
                    player['SF'] = 1;
                    player['UTIL'] = 1;
                    player['F'] = 1;
                    player['S'] = 1;
                }
                if(player.Position.includes("PF")){ 
                    player['PF'] = 1;
                    player['UTIL'] = 1;
                    player['F'] = 1;
                    player['B'] = 1;
                }
                if(player.Position.includes("C")){ 
                    player['C'] = 1;
                    player['UTIL'] = 1;
                    player['B'] = 1;
                }
                player[player.Team] = 1;
                

                player = randomizeProjection(player, blowouts);
                players[player.Name] = player;
            }
            var topPlays = document.getElementById("minTopPlaysFD").value;

            return([players, topPlays]);
        }).then((data) => {
            var players = data[0];
            var topPlays = data[1];

        // solve for max projection with constraints
            var teams = [];
            var opponents = {};
            for(let p in players){
                if(!teams.includes(players[p].Team)) {
                    teams.push(players[p].Team);
                    opponents[players[p].Team] = players[p].Opponent;
                }
                players[p][alphabetize(players[p].Team, players[p].Opponent)] = 1;
            }
            var model = {
                "optimize": "Projected",
                "opType": "max",
                "constraints": {
                    "PG": {"min": 2, "max": 4},
                    "SG": {"min": 2, "max": 6},
                    "SF": {"min": 2, "max": 6},
                    "PF": {"min": 2, "max": 5},
                    "C": {"min": 1, "max": 3},
                    "UTIL": {"equal": 9},
                    "Salary": {"max": 60000},
                    "B": {"min": 3},
                    "S": {"min": 4},
                    "G": {"min": 4},
                    "F": {"min": 4},
                    "Top Play": {"min": topPlays}
                },
                "variables": players,
                "binaries": players
            }

            for(let t of teams){
                model.constraints[t] = {"max": 4};
                let game = alphabetize(t, opponents[t]);
                model.constraints[game] = {"max": 7};
            }
            return([model, players]);
        }).then((data) => { 
            var model = data[0];
            var players = data[1];
            require(['solver'], function(solver){
                var result = solver.Solve(model);
                console.log(players);
                addLineupToTableFD(result, players);
            });
        });
    }
}


// Alphabetize two teams into one string
function alphabetize(team1, team2){
    if(team1 < team2) return team1 + team2;
    else return team2 + team1;
}

function addLineupToTable(result, players){
    var table = document.getElementById("lineupTable");
    var row = table.insertRow(-1);

    var lineupPlayers = [];
    for(let p in result){
        if(players[p] != undefined) lineupPlayers.push(players[p]);
    }
    var totalSalary = 0;
    var totalProj = 0;

    // randomize lineupPlayers order and finalize when order matches PG, SG, SF, PF, C, G, F, UTIL
    
    var orderIsCorrect = false;
    var beginLoop = Date.now();
    while(!orderIsCorrect){
        orderIsCorrect = checkOrder(lineupPlayers);
        if(!orderIsCorrect) lineupPlayers = shuffle(lineupPlayers);
        if(Date.now() - beginLoop > 1000) break;
    }
    if(!orderIsCorrect){
        table.deleteRow(row.rowIndex);
        console.log("Could not find valid lineup");
        buildLineups(true);
        return;
    }
    for(let p of lineupPlayers){
        let c = row.insertCell(-1)
        c.innerHTML = p.Name + "<br>" + p.ID + "<br>" + p.Salary + "<br>" + p.Team;
        c.style.backgroundColor = getTeamColor(p.Team);
        c.style.color = getTeamSecondaryColor(p.Team);
        totalSalary += Number(p.Salary);
        totalProj += Number(p.Projected);
    }
    let s = row.insertCell(-1)
    s.innerHTML = totalSalary;
    s.backgroundColor = colorByScale(48500, 50000, totalSalary);
    let p = row.insertCell(-1)
    p.innerHTML = totalProj.toFixed(1);
    p.backgroundColor = colorByScale(200, 400, totalProj);
    document.getElementById('lineupsBuilt').innerHTML = Number(document.getElementById('lineupsBuilt').innerHTML) + 1;
}

function addLineupToTableFD(result, players){
    var table = document.getElementById("lineupTableFD");
    var row = table.insertRow(-1);
    var lineupPlayers = [];
    for(let p in result){
        if(["feasible", "bounded", "result", "bounded", "isIntegral"].includes(p)) continue;
        if(players[p] != undefined) lineupPlayers.push(players[p]);
    }
    var totalSalary = 0;
    var totalProj = 0;

    // randomize lineupPlayers order and finalize when order matches PG, SG, SF, PF, C, G, F, UTIL
    
    var orderIsCorrect = false;
    var beginLoop = Date.now();
    while(!orderIsCorrect){
        orderIsCorrect = checkOrderFD(lineupPlayers);
        if(!orderIsCorrect) lineupPlayers = shuffle(lineupPlayers);
        if(Date.now() - beginLoop > 1000) break;
    }
    if(!orderIsCorrect){
        table.deleteRow(row.rowIndex);
        console.log("Could not find valid lineup");
        buildLineupsFD(true);
        return;
    }
    for(let p of lineupPlayers){
        let c = row.insertCell(-1)
        c.innerHTML = p.Name + "<br>" + p.ID + "<br>" + p.Salary + "<br>" + p.Team;
        c.style.backgroundColor = getTeamColor(p.Team);
        c.style.color = getTeamSecondaryColor(p.Team);
        totalSalary += Number(p.Salary);
        totalProj += Number(p.Projected);
    }
    let s = row.insertCell(-1)
    s.innerHTML = totalSalary;
    s.backgroundColor = colorByScale(48500, 50000, totalSalary);
    let p = row.insertCell(-1)
    p.innerHTML = totalProj.toFixed(1);
    p.backgroundColor = colorByScale(200, 400, totalProj);
    document.getElementById('lineupsBuiltFD').innerHTML = Number(document.getElementById('lineupsBuiltFD').innerHTML) + 1;
}

function checkOrder(lineup){
    var order = ["PG", "SG", "SF", "PF", "C", "G", "F"];
    for(let i = 0; i < order.length; i++){
        if(!lineup[i].Position.includes(order[i])) return false;
    }
    return true;
}

function checkOrderFD(lineup){
    var order = ["PG", "PG", "SG", "SG", "SF", "SF", "PF", "PF", "C"];
    for(let i = 0; i < order.length; i++){
        if(!lineup[i].Position.includes(order[i])) return false;
    }
    return true;
}
// Randomize the order of an array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function randomizeProjection(p, blowouts){
    var blowout = blowouts[p.Team]['blowout'];
    var proj = Number(p.Projected);
    var variance = document.getElementById("variance").value * randNormal(0, 1) * proj/36;
    p.Projected = applyBlowout(proj, blowout, variance);
    return p;
}

function applyBlowout(proj, blowout, variance){
    switch(blowout){
        case 'blowout win': {
            if(proj < 22){
                proj = proj * 1.1;
                variance = variance * 0.4 + 2;
            }else if(proj > 29){
                proj = proj * 1.1;
                variance = variance * 0.6;
            }else{
                variance = variance * 0.8;
            }
            break;
        }
        case 'blowout loss': {
            if(proj < 22){
                proj = proj + 3.5;
                variance = variance * 0.7;
            }else if(proj > 29){
                proj = (proj - 4)*0.8;
                variance = (variance - 2) * 0.5;
            }else{
                proj = proj*0.9;
                variance = variance * 0.9;
            }
            break;
        }
        case 'no blowout': {
            if(proj < 22){
                proj = proj * 0.7;
            }else if(proj > 29){
                proj = proj * 1.15 + 3;
                variance = variance +2;
            }else{
                proj = proj + 2;
            }
            break;
        }
        case 'shootout': {
            if(proj < 22){
                proj = proj -7;
            }else if(proj > 29){
                proj = proj +3.5;
            }else{
                proj = proj +1;
            }
            variance += 3.5;

            break;
        }
    }
    return proj + variance;
}        

function updateVarianceFD(){
    var fdv = $('#varianceFD')[0].value;
    $('#variance')[0].value = fdv;
}

function randNormal(mean, stdDev){
    var u1 = Math.random();
    var u2 = Math.random();
    var randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return mean + stdDev * randStdNormal;
}

function sortTable(table, column){
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while(switching){
        switching = false;
        rows = table.rows;
        for(i = 1; i < (rows.length - 1); i++){
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[column];
            y = rows[i+1].getElementsByTagName("td")[column];
            if(Number(x.innerHTML) < Number(y.innerHTML)) shouldSwitch = true;
            if(shouldSwitch){
                rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                switching = true;
            }
        }
    }
}

function downloadLineups(){
    var lineups = document.getElementById("lineupTable").rows;
    var csv = "data:text/csv;charset=utf-8,";
    csv += "PG,SG,SF,PF,C,G,F,UTIL\n";
    for(let l of lineups){
        if(l.rowIndex == 0) continue;
        var row = [];
        for(let c of l.cells){
            if(c.cellIndex >= 8) continue;
            csv += c.innerHTML.split("<br>")[1]
            if(c.cellIndex < 7) csv += ",";
        }
        csv += "\n";    
    }
    var encodedUri = encodeURI(csv);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lineups.csv");
    document.body.appendChild(link);
    link.click();
}

function downloadLineupsFD(){
    var lineups = document.getElementById("lineupTableFD").rows;
    var csv = "data:text/csv;charset=utf-8,";
    csv += "PG,PG,SG,SG,SF,SF,PF,PF,C\n";
    for(let l of lineups){
        if(l.rowIndex == 0) continue;
        var row = [];
        for(let c of l.cells){
            if(c.cellIndex >= 9) continue;
            csv += c.innerHTML.split("<br>")[1]
            if(c.cellIndex < 8) csv += ",";
        }
        csv += "\n";    
    }
    var encodedUri = encodeURI(csv);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fdlineups.csv");
    document.body.appendChild(link);
    link.click();
}

function downloadEditedLineups(){
    var lineups = document.getElementById("lineupTable").rows;
    var csv = "data:text/csv;charset=utf-8,";
    var previousLineups = JSON.parse(DKEntries);

    for(let l of lineups){
        if(l.rowIndex == 0) continue;
        var row = [];
        for(let c of l.cells){
            if(c.cellIndex >= 8) continue;
            row.push(c.innerHTML.split("<br>")[1]);
        }

        var index = l.rowIndex;
        if(index > previousLineups.length) index = previousLineups.length;
        for(let i = 0; i < row.length; i++){

            previousLineups[index][i+4] = row[i];
        }
    }
    for(let l of previousLineups){
        csv += l.join(",") + "\n";
    }
    //csv += previousLineups.join("\n");
    var encodedUri = encodeURI(csv);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lineups.csv");
    document.body.appendChild(link);
    link.click();
}

function downloadEditedLineupsFD(){
    var lineups = document.getElementById("lineupTableFD").rows;
    var csv = "data:text/csv;charset=utf-8,";
    var previousLineups = JSON.parse(DKEntries);

    for(let l of lineups){
        if(l.rowIndex == 0) continue;
        var row = [];
        for(let c of l.cells){
            if(c.cellIndex >= 9) continue;
            row.push(c.innerHTML.split("<br>")[1]);
        }

        var index = l.rowIndex;
        if(index > previousLineups.length) index = previousLineups.length;
        for(let i = 0; i < row.length; i++){
            let num = i+3;
            previousLineups[index][num] = row[i];
        }
    }
    for(let l of previousLineups){
        csv += l.join(",") + "\n";
    }

    //csv += previousLineups.join("\n");
    var encodedUri = encodeURI(csv);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fdlineups.csv");
    document.body.appendChild(link);
    link.click();
}

var DKEntries = "";

function handleLineupscsv(){
    var csv = document.getElementById("editcsv").files[0];
    var reader = new FileReader();
    // save csv to storage as JSON
    reader.onload = function(e){
        var csv = e.target.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for(let i = 0; i < lines.length; i++){
            var obj = [];
            var currentline = lines[i].split(",");
            for(let j = 0; j < headers.length; j++){
                obj[j] = currentline[j];
            }
            result.push(obj);
        }
        //localStorage.DKEntries = JSON.stringify(result);
        //return result;
        //return(JSON.stringify(result));
        //location.reload();
        DKEntries = JSON.stringify(result);
    }
    reader.readAsText(csv);

}


function handleLineupscsvFD(){
    var csv = document.getElementById("editcsvFD").files[0];
    var reader = new FileReader();
    // save csv to storage as JSON
    reader.onload = function(e){
        var csv = e.target.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for(let i = 0; i < lines.length; i++){
            var obj = [];
            var currentline = lines[i].split(",");
            for(let j = 0; j < headers.length; j++){
                obj[j] = currentline[j];
            }
            result.push(obj);
        }
        //localStorage.DKEntries = JSON.stringify(result);
        //return result;
        //return(JSON.stringify(result));
        //location.reload();
        DKEntries = JSON.stringify(result);
    }
    reader.readAsText(csv);

}

function colorRowsBasedOnTeam(table, column){
    var rows = table.rows;
    for(let i = 1; i < rows.length; i++){
        let row = rows[i];
        let team = row.cells[column].innerHTML;
        row.style.backgroundColor = getTeamColor(team);
        row.style.color = getTeamSecondaryColor(team);
        row.style.fontWeight = "400";
    }
}

function getTeamColor(team){
    switch(team){
        case "ATL": return "#E03A3E";
        case "BKN": return "#000000";
        case "BOS": return "#007A33";
        case "CHA": return "#1D1160";
        case "CHI": return "#CE1141";
        case "CLE": return "#860038";
        case "DAL": return "#00538C";
        case "DEN": return "#0E2240";
        case "DET": return "#C8102E";
        case "GSW": return "#006BB6";
        case "HOU": return "#CE1141";
        case "IND": return "#002D62";
        case "LAC": return "#C8102E";
        case "LAL": return "#552583";
        case "MEM": return "#5D76A9";
        case "MIA": return "#98002E";
        case "MIL": return "#00471B";
        case "MIN": return "#0C2340";
        case "NOP": return "#0C2340";
        case "NYK": return "#006BB6";
        case "OKC": return "#007AC1";
        case "ORL": return "#0077C0";
        case "PHI": return "#006BB6";
        case "PHX": return "#1D1160";
        case "POR": return "#E03A3E";
        case "SAC": return "#5A2D81";
        case "SAS": return "#C4CED4";
        case "TOR": return "#CE1141";
        case "UTA": return "#002B5C";
        case "WAS": return "#002B5C";
        default: return "#000000";
    }
}

function getTeamSecondaryColor(team){
    switch(team){
        case "SAS": return "#000000";
        default: return "#FFFFFF";
    }
}

function resetPlayerAdjustTable(){
    let c = confirm("Are you sure you want to reset the player adjustments?");
    if(!c) return; else{
        localStorage.removeItem("savedPlayerDataNBA");
        localStorage.removeItem("NBAInjuries");
        localStorage.removeItem("topPlaysNBA");
        localStorage.removeItem("removedFromPoolNBA");
        location.reload();
    }
}

async function toggleInjured(btn){
    var topPlayBtn = btn.parentNode.parentNode.cells[5].getElementsByTagName("button")[0];
    if(localStorage.NBAInjuries){
        var injuries = JSON.parse(localStorage.NBAInjuries);
    }else{
        var injuries = [];
    }
    var player = btn.parentNode.parentNode.cells[0].innerHTML;

    if(btn.innerHTML == "Healthy"){
        btn.innerHTML = "Injured";
        btn.className = "injured";
        btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].setAttribute('savedproj', btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].value);
        btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].value = 0;
        topPlayBtn.innerHTML = "Removed";
        topPlayBtn.className = "removedFromPool";
        if(localStorage.removedFromPoolNBA) var removed = JSON.parse(localStorage.removedFromPoolNBA); else var removed = [];
        if(!removed.includes(player)) removed.push(player);
        localStorage.removedFromPoolNBA = JSON.stringify(removed);
        if(!injuries.includes(player)) injuries.push(player);
    } else{
        btn.innerHTML = "Healthy";
        btn.className = "healthy";
        btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].value = btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].getAttribute('savedproj');
        btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0].removeAttribute('savedproj');
        var index = injuries.indexOf(player);
        topPlayBtn.innerHTML = "In Pool";
        topPlayBtn.className = "inPool";
        if(localStorage.removedFromPoolNBA) var removed = JSON.parse(localStorage.removedFromPoolNBA); else var removed = [];
        if(removed.includes(player)){
            var index = removed.indexOf(player);
            removed.splice(index, 1);
        }
        localStorage.removedFromPoolNBA = JSON.stringify(removed);
        if(index > -1) injuries.splice(index, 1);
    }
    updateProj(btn.parentNode.parentNode.cells[3].getElementsByTagName("input")[0]);
    localStorage.NBAInjuries = JSON.stringify(injuries);
}


async function applyInjury(player, team){

    var att = playerNameAsAttribute(player);
    var playerAdjustTable = document.getElementById("playerAdjustTable");
    var adjustRows = playerAdjustTable.rows;
    var promises = [];
        for(let r of adjustRows){
            promises.push(new Promise((resolve) => {

            if(r.rowIndex == 0) resolve();
            if(r.cells[2].innerHTML == team){
                let promise = new Promise((resolve) => {
                    let minboost = 0.05; 
                    let projboost = 0.03;
                    startproj = productOfAttributes(r.cells[2]);
                    startmins = productOfAttributes(r.cells[3]);
                    if(r.cells[0].innerHTML == player){
                        projboost = -1;
                        minboost = -1;
                    }else{
                        if(startmins > 35) minboost = 0.005; else if(startmins > 30) minboost = 0.01; else if(startmins > 26) minboost = .015; else if(startmins > 18) minboost = .03; else if(startmins > 10) minboost = 0.08; else if(startmins > 5) minboost = 0.25; else minboost = 0.5;
                        if(startproj > 1.2) projboost = 0; else if(startproj > 0.95) projboost = 0.05; else if(startproj > .5) projboost = 0.08; 
                    }                          
                    let newproj = productOfAttributes(r.cells[2])*(1+projboost);
                    let newmins = productOfAttributes(r.cells[3])*(1+minboost);
                    if(r.cells[5].getElementsByTagName("button")[0].innerHTML == "Injured"){
                        newproj = 0;
                        newmins = 0;
                    }
                    resolve([newproj, newmins, projboost, minboost]);
                }
                );
                promise.then((values) => {
                    r.cells[2].setAttribute(att, 1+values[2]);
                    r.cells[3].setAttribute(att, 1+values[3]);

                    r.cells[2].getElementsByTagName("input")[0].value = values[0];
                    r.cells[3].getElementsByTagName("input")[0].value = values[1];
                    return "done";
                }).then((str) => {
                    updateProj(r.cells[2].getElementsByTagName("input")[0]);
                    updateProj(r.cells[3].getElementsByTagName("input")[0]);
                });
            }
            resolve();
        }));
        }

    Promise.all(promises).then(() => {
        team240();
    });
}


function productOfAttributes(cell){
    var attributes = cell.getAttributeNames();
    var product = 1;
    for(let a of attributes){
        let att = cell.getAttribute(a);
        product *= Number(att);
    }
    return product;
}

function playerNameAsAttribute(player){
    var name = player.replace(/[^a-zA-Z ]/g, "");
    name = name.replace(/\s/g, "");
    return name;
}

async function removeInjury(player, team){
    var att = playerNameAsAttribute(player);
    var playerAdjustTable = document.getElementById("playerAdjustTable");
    var adjustRows = playerAdjustTable.rows;
    let loopPromise = new Promise((resolve) => {
        for(let r of adjustRows){
            if(r.rowIndex == 0) continue;
            if(r.cells[1].innerHTML == team){
                if(r.cells[0].innerHTML == player){
                    let promise = new Promise((resolve) => {
                        let proj = productOfAttributes(r.cells[2]);
                        let min = productOfAttributes(r.cells[3]);
                        resolve([proj, min]);
                    });
                    promise.then((values) => {
                        r.cells[2].getElementsByTagName("input")[0].value = values[0];
                        r.cells[3].getElementsByTagName("input")[0].value = values[1];
                        return "done";
                    }).then((str) => {
                        updateProj(r.cells[2].getElementsByTagName("input")[0]);
                        updateProj(r.cells[3].getElementsByTagName("input")[0]);
                    });
                }else{
                    let promise = new Promise((resolve) => {
                        r.cells[2].removeAttribute(att);
                        r.cells[3].removeAttribute(att);
                        resolve();
                    });
                    promise.then(() => {
                        let proj = productOfAttributes(r.cells[2]);
                        let min = productOfAttributes(r.cells[3]);
                        return([proj, min]);
                    }).then((values) => {
                        r.cells[2].getElementsByTagName("input")[0].value = values[0];
                        r.cells[3].getElementsByTagName("input")[0].value = values[1];
                        return "done";
                    }).then((str) => {
                        updateProj(r.cells[2].getElementsByTagName("input")[0]);
                        updateProj(r.cells[3].getElementsByTagName("input")[0]);
                    });
                }
            }
        }
        resolve();
    }
    );
    loopPromise.then(() => {
        team240();
    });
}

function clearLineups(){
    var table = document.getElementById("lineupTable");
    var rows = table.rows;
    for(let i = rows.length-1; i > 0; i--){
        table.deleteRow(i);
    }
    document.getElementById('lineupsBuilt').innerHTML = 0;
}

function clearLineupsFD(){
    var table = document.getElementById("lineupTableFD");
    var rows = table.rows;
    for(let i = rows.length-1; i > 0; i--){
        table.deleteRow(i);
    }
    document.getElementById('lineupsBuiltFD').innerHTML = 0;
}

function colorByScale(min, max, value){
    if(value < min) value = min;
    if(value > max) value = max;
    
    var percent = (value - min)/(max - min);
    var r, g, b = 0;
    if(percent < 0.5){
        r = 255;
        g = Math.round(510 * percent);
    }
    else{
        g = 255;
        r = Math.round(510 * (1 - percent));
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

// Update odds-to-hit table
// Table should show odds of players hitting each target score
// GPP Need will be 20 + salary/60000 * 220
// odds to hit will be percent chance of hitting GPP Need with mean Projection and standard deviation 5 + proj/10
async function updateOddsToHit(){
    let promise = new Promise((resolve) => {
        var players = document.getElementById("contestDataTable").rows;
        var table = document.getElementById("oddsTable");
        while(table.rows.length > 1){
            table.deleteRow(1);
        }
        var sumOTH = 0;
        for(let i = 1; i < players.length; i++){
            let player = players[i];
            let position = player.cells[0].innerHTML;
            let name = player.cells[1].innerHTML;
            let proj = Number(player.cells[7].innerHTML);
            let salary = Number(player.cells[2].innerHTML);
            let team = player.cells[3].innerHTML;
            let gppNeed = 20 + salary/60000 * 220;
            let odds = 1-normDist(gppNeed, proj, 5 + proj/10);
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = name;
            row.insertCell(1).innerHTML = position;
            row.insertCell(2).innerHTML = team;
            row.insertCell(3).innerHTML = salary;
            row.insertCell(4).innerHTML = proj;
            row.insertCell(5).innerHTML = gppNeed.toFixed(1);
            row.insertCell(6).innerHTML = (odds*100);
            row.style.backgroundColor = getTeamColor(team);
            row.style.color = getTeamSecondaryColor(team);
            row.cells[6].style.backgroundColor = colorByScale(0, 100, odds*100);
            row.cells[6].style.color = "black";
            sumOTH += odds*100;
        }
        resolve(sumOTH);
    });
    promise.then((sumOTH) => {
        var table = document.getElementById("oddsTable");
        for(let i = 1; i < table.rows.length; i++){
            let row = table.rows[i];
            let odds = Number(row.cells[6].innerHTML);
            row.cells[6].innerHTML = (odds*800/sumOTH).toFixed(1);
        }
        return;
    }).then(() => {
        sortTable(document.getElementById("oddsTable"), 6);
    });

}


function updateOwnership(){
    if(document.getElementById("contestDataTable").rows[1].cells[5].innerHTML.includes("-")){
        var lineupTable = document.getElementById("lineupTableFD");
    }else{
        var lineupTable = document.getElementById("lineupTable");
    }
    var ownershipTable = document.getElementById("ownershipTable");
    var poolSize = document.getElementById("poolSize");

    while(ownershipTable.rows.length > 1){
        ownershipTable.deleteRow(1);
    }
    poolSize.innerHTML = 0;
    var rowLength = lineupTable.rows[0].cells.length;
    var rows = lineupTable.rows;
    var ownership = {};
    for(let i = 1; i < rows.length; i++){
        var row = rows[i];
        var players = row.cells;
        for(let p of players){
            if(p.cellIndex >= rowLength - 2) continue;
            let name = p.innerHTML.split("<br>")[0];
            if(name in ownership) ownership[name] += 1;
            else{ 
                ownership[name] = 1;
                poolSize.innerHTML = Number(poolSize.innerHTML) + 1;
            }
        }
    }
    for(let p in ownership){
        let row = ownershipTable.insertRow(-1);
        let name = row.insertCell(0);
        let own = row.insertCell(1);
        name.innerHTML = p;
        own.innerHTML = (ownership[p]/(rows.length-1)*100).toFixed(1);
    }
    sortTable(ownershipTable, 1);
}



function normDist(x, mean, std){
    return 0.5 * (1 + erf((x - mean)/(std * Math.sqrt(2))));
}

function erf(x){
    var a1 = 0.254829592;
    var a2 = -0.284496736;
    var a3 = 1.421413741;
    var a4 = -1.453152027;
    var a5 = 1.061405429;
    var p = 0.3275911;
    var sign = 1;
    if(x < 0) sign = -1;
    x = Math.abs(x);
    var t = 1/(1 + p*x);
    var y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t * Math.exp(-x*x);
    return sign*y;
}

// Filter the built lineups to only include the top X lineups
// X is determined by the input box
// Priority is given to lineups with high starter or backup correlation (determined by salary and team/opponent), high median projected value
function filterLineups(){
    var table = document.getElementById("lineupTable");
    var rows = table.rows;
    var lineupValues = [];
    for(let r of rows){
        if(r.rowIndex == 0) continue;
        let lineup = [];
        for(let c of r.cells){
            if(c.cellIndex >= 8) continue;
            lineup.push(c.innerHTML.split("<br>")[0]);
        }
        lineupValues.push(valueOfLineup(lineup));
    }
    var topLineups = [];
    var lineupsToFilter = document.getElementById("lineupsToFilter").value;

    for(let i = 0; i < lineupsToFilter; i++){
        let index = lineupValues.indexOf(Math.max(...lineupValues));
        topLineups.push(rows[index+1]);
        lineupValues[index] = 0;
    }

    for(let i = rows.length-1; i > 0; i--){
        if(!topLineups.includes(rows[i])) table.deleteRow(i);
    }
}

function valueOfLineup(lineup){
    var players = document.getElementById("contestDataTable").rows;
    var lineupObj = {};
    var teams = [];
    for(let p of lineup){
        var player = getPlayer(p, players);
        var team = player.cells[3].innerHTML;
        teams.push(team);
        var opp = player.cells[4].innerHTML;
        var game = alphabetize(team, opp);
        var expensive = player.cells[2].innerHTML >= 8000;
        var highUsage = player.cells[5].innerHTML >= 15;
        var value = player.cells[7].innerHTML;
        if(team in lineupObj){
            lineupObj[team]["expensive"] += Number(expensive);
            lineupObj[team]["highUsage"] += Number(highUsage);
            lineupObj[team]["players"] += 1;
            lineupObj["value"] += Number(value);
            lineupObj[game]["expensive"] += Number(expensive);
            lineupObj[game]["highUsage"] += Number(highUsage);
            lineupObj[game]["players"] += 1;
        }else{
            lineupObj= {team : {
                "expensive": Number(expensive),
                "highUsage": Number(highUsage),
                "players": 1
                },
                "value": Number(value),
                game : {
                    "expensive": Number(expensive),
                    "highUsage": Number(highUsage),
                    "players": 1
                },
                opp : {
                    "expensive": 0,
                    "highUsage": 0,
                    "players": 0
                }
            };
            
        }
    }

    var value = lineupObj["value"];

    for(let t in lineupObj){
        if(t == "value"){ 
            continue;
        }else if(teams.includes(t)){
            // Handles lineups with players on the same team
            if(lineupObj[t]["expensive"] > 1) value -= 5;
            if(lineupObj[t]["highUsage"] > 1) value -= 5;
            if(lineupObj[t]["players"] >= 3) value -= 5;
        }else{
            // Handles lineups with players in the same game
            let change = 0;
            if(lineupObj[t]["players"] >= 3){
                switch(lineupObj[t]["players"]){
                    case 3: change = 8; break;
                    case 4: change = 6; break;
                    case 5: change = 2; break;
                    case 6: change = -4; break;
                    case 7: change = -8; break;
                    case 8: change = -12; break;
                    case 9: change = -16; break;
                }
            }
            switch(lineupObj[t]["expensive"]){
                case 2: change += 3; break;
                case 4: change -= 3; break;
                case 5: change -= 6; break;
                case 6: change -= 9; break;
                case 7: change -= 12; break;
                default: break; 
            }
            switch(lineupObj[t]["highUsage"]){
                case 1: change += 3; break;
                case 3: change -= 3; break;
                case 4: change -= 6; break;
                case 5: change -= 9; break;
                case 6: change -= 12; break;
                default: break;
            }
            value += change;
        }
}

    return value;
}

function getPlayer(name, players){
    for(let p of players){
        if(p.cells[1].innerHTML == name) return p;
    }
}

function fillTeamMatchups(){
    var matchupsTable = document.getElementById("matchupsTable");

    if(localStorage.teamMatchups){
        var matchups = JSON.parse(localStorage.teamMatchups);
        for(i of matchups){
            let val = Number(i[1]);
            let inverse = 100 - val;
            let team = i[0];
            let opp = i[2];
            matchupsTable.insertRow(-1).innerHTML = "<td>" + team + "</td><td style='text-align:center'><text id='"+team+"WinPct'>"+ val +"</text><input type='range' value='" + val + "' min='0' max='100' oninput='updateMatchup(this)'><text id='"+opp+"WinPct'>"+inverse+"</text></td><td>" + i[2] +"</td>";
        }
    }else{
        var contestDataTable = document.getElementById("contestDataTable");
        var rows = contestDataTable.rows;
        var teams = [];
        for(let i = 1; i < rows.length; i++){
            let team = rows[i].cells[3].innerHTML;
            let opp = rows[i].cells[4].innerHTML;
            if(!teams.includes(team)){
                teams.push(team);
                teams.push(opp);
                matchupsTable.insertRow(-1).innerHTML = "<td>" + team + "</td><td><text id='"+team+"WinPct'>"+50+"</text><input type='range' value='" + 50 + "' min='0' max='100' oninput='updateMatchup(this)'><text id='"+opp+"WinPct'>"+50+"</text></td><td>" + opp +"</td>";
            }
        }
    }
}

function updateMatchup(element){
    element.nextElementSibling.innerHTML = 100 - element.value;
    element.previousElementSibling.innerHTML = element.value;
    var matchups = [];
    var matchupsTable = document.getElementById("matchupsTable");
    var rows = matchupsTable.rows;
    for(let i = 1; i < rows.length; i++){
        matchups.push([rows[i].cells[0].innerHTML, rows[i].cells[1].getElementsByTagName("input")[0].value, rows[i].cells[2].innerHTML]);
    }
    localStorage.teamMatchups = JSON.stringify(matchups);
}

function resetMatchups(){
    var matchupsTable = document.getElementById("matchupsTable");
    var rows = matchupsTable.rows;
    for(let i = rows.length-1; i > 0; i--){
        matchupsTable.deleteRow(i);
    }
    localStorage.removeItem("teamMatchups");
    fillTeamMatchups();
}