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
        //case "NY": return "NY";
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
    resetMatchups();
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
        //case "Marvin Bagley": return "Marvin Bagley III";
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
        selectBuilder();
    }
    var tab = document.getElementById(element);
    tab.style.display = "block";
}

// toggle which builder should be displayed
function selectBuilder(){
    var fd = document.getElementById("fdBuilder");
    var dk = document.getElementById("dkBuilder");
    if(document.getElementById('dfs-site-btn').textContent == "FD"){ 
        fd.style.display = "block";
        dk.style.display = "none"; 
    }else{
        fd.style.display = "none";
        dk.style.display = "block";
        let headers = dk.getElementsByTagName("th");

        if(document.getElementById("dfs-site-btn").textContent == "DK") {
            var labels = ["PG", "SG", "SF", "PF", "C", "G", "F", "UTIL"];
        }else{
            var labels = ["PG", "SG", "G", "SF", "PF", "F", "C", "UTIL"];
        }
        for(let i = 0; i < labels.length; i++){
            headers[i].innerHTML = labels[i];
        }
    }
}

$(document).ready(async function(){
    let promise = new Promise((resolve) => {
        fillPlayersFromJSON();
        resolve();
    //     loadtableDataNBA();
    //     resolve();
    // });
    // promise.then(() => {
    //     return getPlayerInfo();
    // }).then(() => {
        
    //     return updateContestDataTable();
    });
    promise.then(() => {
        //colorRowsBasedOnTeam(document.getElementById('contestDataTable'), 3);
        colorRowsBasedOnTeam(document.getElementById("playerAdjustTable"), whichCol("playerAdjustTable", "Team"));
        fillTeamMatchups()
    });
    
    //     return applyInjuries();
    // }).then(() => {
    //     //filterPATable();
    //     return fillTeamMatchups();
    // });
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
/*async function getPlayerInfo(){
    let promise = new Promise((resolve) => {


        resolve(getInfoFromJson("data_from_google_sheets.json"));
    });

    promise.then((data) => {
        
        // add this info plus team to playerAdjust table; make FPs/Minute a range between 0 and 2 with step of 0.1; make minutes a range between 0 and 48 with step of 1, make Proj a text that updates to fps/minute * minutes
        var table = document.getElementById("playerAdjustTable");
        var contestDataTable = document.getElementById("contestDataTable");
        var savedData = localStorage.savedPlayerDataNBA ? JSON.parse(localStorage.savedPlayerDataNBA) : {};
        var rows = table.rows;
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
                if(r.cells[5].innerHTML.includes("-")){
                    ownership.innerHTML = data[player]['FDOwn'];
                    var isTopPlay = data[player]['TopPlayFD'];
                    var isRemoved = data[player]['RemovedFD'];
                }else{
                    ownership.innerHTML = data[player]['DKOwn'];
                    var isTopPlay = data[player]['TopPlayDK'];
                    var isRemoved = data[player]['RemovedDK'];
                }
            }else{
                ownership.innerHTML = 0;
                var isTopPlay = 0;
                var isRemoved = 0;
            }

            injured.innerHTML = '<button class="healthy" onclick="toggleInjured(this)">Healthy</button>';
            if(!teams.includes(r.cells[whichCol("playerAdjustTable", "Team")].textContent)) teams.push(r.cells[whichCol("playerAdjustTable", "Team")].textContent);

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

            if(isRemoved || player in removedFromPool || proj.getElementsByTagName("input")[0].value == 0){
                topPlay.innerHTML = '<button class="removedFromPool" onclick="togglePlay(this)">Removed</button>';
            } else if(isTopPlay || player in topPlays){
                topPlay.innerHTML = '<button class="topPlay" onclick="togglePlay(this)">Top Play</button>';
            } else {
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

}*/

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
    var table_id = "playerAdjustTable";
    var table = document.getElementById(table_id);
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
        let rowTeam = row.cells[whichCol(table_id, "Team")].innerHTML;
        let rowPosition = row.cells[whichCol(table_id, "Position")].innerHTML;
        let rowPlay = row.cells[whichCol(table_id, "Top Play")].getElementsByTagName("button")[0].innerHTML;
        if((team == "All" || rowTeam == team) && (position == "All" || rowPosition.includes(position)) && (play == "All" || rowPlay.includes(play))){
            row.style.display = "";
            totalProj += Number(row.cells[whichCol(table_id, "Proj")].getElementsByTagName("input")[0].value);
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

    //updateContestDataTable();
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
    var t_id = "playerAdjustTable";
    var adjustPlayers = document.getElementById(t_id);

    for(let i = 0; i < lineupsToBuild; i++){
        
        let promise = new Promise((resolve) => {
            resolve(getBlowouts());
        });
        promise.then((blowouts) => {
            var orig_data = getInfoFromJSON("data_from_google_sheets.json");
            var rows = adjustPlayers.rows;
            var jvalues = [];
            var players = [];
            var site = document.getElementById('dfs-site-btn').textContent;
            // get objects of all players from table and add to players
            // objects should have name as key and all other row info as values
            for(let i = 1; i < rows.length; i++){
                var pool = rows[i].cells[whichCol(t_id, "Top Play")].firstElementChild.textContent;
                var player = {};
                for(let j = 0; j < rows[i].cells.length; j++){
                    
                    let info = rows[0].cells[j].innerHTML;
                    if(rows[0].cells[j].textContent == "Proj"){
                        info = "Projected";
                        player[info] = rows[i].cells[j].getElementsByTagName("input")[0].value;
                    }else{
                        player[info] = rows[i].cells[j].innerHTML;
                    }
                }
                if(player['Projected'] < 14 || pool == "Removed") continue;
                player['jvalue'] = site == "Y" ? orig_data[player['Player']]['Y J-Value'] : orig_data[player['Player']]['DK J-Value'];
                jvalues.push(player['jvalue']);
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
                players[player.Player] = player;
            }

            return([players, jvalues]);
        }).then((data) => {
            var players = data[0];
            var jvalues = data[1].sort();
            // solve for max projection with constraints
            var site = document.getElementById('dfs-site-btn').textContent;
            var topPlays = document.getElementById("minTopPlaysDK").value; // ok since we're using the same builder for Y and DK
            var teams = [];
            var opponents = {};
            var max_salary = site == "DK" ? 50000 : 200;
            // get the 10th highest jvalue
            var min_core = document.getElementById("min-core").value;
            var min_core_plays= document.getElementById("min-core-plays").value;
            var core_player_jvalue = jvalues[jvalues.length - min_core_plays -1];
            
            for(let p in players){
                if(!teams.includes(players[p].Team)) {
                    teams.push(players[p].Team);
                    opponents[players[p].Team] = players[p].Opponent;
                }
                players[p][alphabetize(players[p].Team, players[p].Opponent)] = 1;
                players[p]["Core"] = players[p].jvalue > core_player_jvalue ? 1 : 0;
            }
            
            var constraints = {
                "PG": {"max": 3},
                "SG": {"max": 3},
                "SF": {"max": 3},
                "PF": {"max": 3},
                "C": {"min": 1},
                "G": {"min": 3},
                "F": {"min": 3},
                "UTIL": {"equal": 8},
                "Salary": {"max": max_salary},
                "Top Play": {"min" : topPlays},
                "Core": {"min": min_core}
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
    var t_id = "playerAdjustTable";

    for(let i = 0; i < lineupsToBuild; i++){
        
        let promise = new Promise((resolve) => {
            resolve(getBlowouts());
        });
        promise.then((blowouts) => {

            var adjustPlayers = document.getElementById("playerAdjustTable");
            var rows = adjustPlayers.rows;
            var players = [];
            var jvalues = [];
            // get objects of all players from table and add to players
            // objects should have name as key and all other row info as values
            for(let i = 1; i < rows.length; i++){
                var pool = rows[i].cells[whichCol(t_id, "Top Play")].firstElementChild.textContent;
                var player = {};
                for(let j = 0; j < rows[i].cells.length; j++){
                    let info = rows[0].cells[j].innerHTML;
                    if(rows[0].cells[j].textContent == "Proj"){
                        info = "Projected";
                        player[info] = rows[i].cells[j].getElementsByTagName("input")[0].value;
                    }else{
                        player[info] = rows[i].cells[j].innerHTML;
                    }
                }
                if(player['Projected'] < 14 || pool == "Removed") continue;
                player['jvalue'] = (Number(player['Projected'])/(Number(player['Salary'])/1000));
                player['jvalue'] = (player['jvalue'] * player['jvalue'] * player['jvalue'] * player['jvalue']);
                jvalues.push(player['jvalue']);

                if(pool == "Top Play"){ 
                    player['Top Play'] = 1; 
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
                players[player.Player] = player;
            }
            return [players, jvalues];


        }).then((data) => {
            var players = data[0];
            var jvalues = data[1].sort();
            // solve for max projection with constraints
            var min_core = document.getElementById("min-core-FD").value;
            var min_core_plays= document.getElementById("min-core-plays-FD").value;
            var core_player_jvalue = jvalues[jvalues.length - min_core_plays -1];
            var teams = [];
            var opponents = {};

            for(let p in players){
                if(!teams.includes(players[p].Team)) {
                    teams.push(players[p].Team);
                    opponents[players[p].Team] = players[p].Opponent;
                }
                players[p][alphabetize(players[p].Team, players[p].Opponent)] = 1;
                players[p]["Core"] = players[p].jvalue > core_player_jvalue ? 1 : 0;
            }
            
            var topPlays = document.getElementById("minTopPlaysFD").value;
            
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
                    "Top Play": {"min": topPlays},
                    "Core": {"min": min_core}
                },
                "variables": players,
                "binaries": players
            }

            for(let t of teams){
                model.constraints[t] = {"max": 4};
                let game = alphabetize(t, opponents[t]);
                model.constraints[game] = {"max": 7};
            }
            return [model, players];
        }).then((data) => { 
            var model = data[0];
            var players = data[1];
            require(['solver'], function(solver){
                var result = solver.Solve(model);
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
    var site = document.getElementById('dfs-site-btn').textContent;
    while(!orderIsCorrect){
        orderIsCorrect = site == "Y" ? checkOrder(lineupPlayers, ["PG", "SG", "G", "SF", "PF", "F", "C"]) : checkOrder(lineupPlayers);
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
        c.innerHTML = p.Player + "<br>" + p.ID + "<br>" + p.Salary + "<br>" + p.Team;
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
        if(Date.now() - beginLoop > 15) break;
    }
    if(!orderIsCorrect){
        table.deleteRow(row.rowIndex);
        console.log("Could not find valid lineup");
        buildLineupsFD(true);
        return;
    }
    for(let p of lineupPlayers){
        let c = row.insertCell(-1)
        c.innerHTML = p.Player + "<br>" + p.ID + "<br>" + p.Salary + "<br>" + p.Team;
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

function checkOrder(lineup, order = ["PG", "SG", "SF", "PF", "C", "G", "F"]){
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
            csv += c.innerHTML.split("<br>")[1];
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
    var previousLineups = DKEntries;// JSON.parse(DKEntries);
    var site = document.getElementById('dfs-site-btn').textContent;
    for(let l of lineups){
        if(l.rowIndex == 0) continue;
        var row = [];
        for(let c of l.cells){
            if(c.cellIndex >= 8) continue;
            let id = c.innerHTML.split("<br>")[1];
            row.push(id);
        }

        var index = l.rowIndex;
        if(index > previousLineups.length) index = previousLineups.length;
        for(let i = 0; i < row.length; i++){
            if(site == "Y") previousLineups[index][i+5] = row[i]; else previousLineups[index][i+4] = row[i];
        }
    }
    if(site == "Y"){
        for(let j = 0; j < lineups.length; j++){
            let l = previousLineups[j];
            for(let i = 0; i < 13; i++){
                csv += l[i] + ",";
            }
            csv += "\n";
        }
    }else{
        for(let l of previousLineups){
            csv += l.join(",") + "\n";
        }
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
    var previousLineups = DKEntries; //JSON.parse(DKEntries);

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
        var site = document.getElementById('dfs-site-btn').textContent;
        var headers = lines[0].split(",");
        for(let i = 0; i < lines.length; i++){
            var obj = [];
            var currentline = lines[i].split(",");
            if(site == "Y"){
                currentline = cutOffYahooEntries(currentline);
            }
            if(currentline.length > headers.length && site == "Y" ) {
                // combine the first and second items in array into one, with a comma between them
                currentline[0] = currentline[0]+ currentline[1];
                currentline.splice(1, 1);
            }
            for(let j = 0; j < headers.length; j++){
                obj[j] = currentline[j];
            }
            result.push(obj);
        }
        //localStorage.DKEntries = JSON.stringify(result);
        //return result;
        //return(JSON.stringify(result));
        //location.reload();

        DKEntries = result; //JSON.stringify(result);
    }
    reader.readAsText(csv);

}

// cuts off yahoo entries at the end of the list of players since they like to add extra commas that ruin everything
function cutOffYahooEntries(arr){
    var new_arr = [];
    for(let i = 0; i < 13; i++){
        new_arr.push(arr[i]);
    }
    return new_arr;
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
        DKEntries = result; //JSON.stringify(result);
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
        case "GS": return "#006BB6";
        case "HOU": return "#CE1141";
        case "IND": return "#002D62";
        case "LAC": return "#C8102E";
        case "LAL": return "#552583";
        case "MEM": return "#5D76A9";
        case "MIA": return "#98002E";
        case "MIL": return "#00471B";
        case "MIN": return "#0C2340";
        case "NOP": return "#0C2340";
        case "NY": return "#006BB6";
        case "OKC": return "#007AC1";
        case "ORL": return "#0077C0";
        case "PHI": return "#006BB6";
        case "PHO": return "#1D1160";
        case "POR": return "#E03A3E";
        case "SAC": return "#5A2D81";
        case "SA": return "#C4CED4";
        case "TOR": return "#CE1141";
        case "UTA": return "#002B5C";
        case "WAS": return "#002B5C";
        default: return "#000000";
    }
}

function getTeamSecondaryColor(team){
    switch(team){
        case "SA": return "#000000";
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
    var topPlayBtn = btn.parentNode.parentNode.cells[9].getElementsByTagName("button")[0];
    if(localStorage.NBAInjuries){
        var injuries = JSON.parse(localStorage.NBAInjuries);
    }else{
        var injuries = {};
    }
    if(localStorage.removedFromPoolNBA) var removed = JSON.parse(localStorage.removedFromPoolNBA); else var removed = {};

    var player = btn.parentNode.parentNode.cells[0].innerHTML;
    var slider = btn.parentNode.parentNode.cells[7].getElementsByTagName("input")[0];

    if(btn.innerHTML == "Healthy"){
        btn.innerHTML = "Injured";
        btn.className = "injured";
        slider.setAttribute('savedproj', slider.value);
        slider.value = 0;
        topPlayBtn.innerHTML = "Removed";
        topPlayBtn.className = "removedFromPool";
        console.log(removed);
        if(!(player in removed)) removed[player] = slider.getAttribute('savedproj');
        localStorage.removedFromPoolNBA = JSON.stringify(removed);
        if(!(player in injuries)) injuries[player] = slider.getAttribute('savedproj');
    } else{
        btn.innerHTML = "Healthy";
        btn.className = "healthy";
        slider.value = removed[player];
        slider.removeAttribute('savedproj');
        topPlayBtn.innerHTML = "In Pool";
        topPlayBtn.className = "inPool";
        if(player in removed){
            delete removed[player];
        }
        localStorage.removedFromPoolNBA = JSON.stringify(removed);

    }
    updateProj(btn.parentNode.parentNode.cells[7].getElementsByTagName("input")[0]);
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
    if(document.getElementById("dfs-site-btn").textContent == "FD"){
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
function filterLineups(site = "DK"){
    if(site == "DK"){
        var table = document.getElementById("lineupTable");
    }else{
        var table = document.getElementById("lineupTableFD");
    }
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
    if(site == "DK"){
        var lineupsToFilter = document.getElementById("lineupsToFilter").value;
    }else{
        var lineupsToFilter = document.getElementById("lineupsToFilterFD").value;
    }

    for(let i = 0; i < lineupsToFilter; i++){
        let index = lineupValues.indexOf(Math.max(...lineupValues));
        topLineups.push(rows[index+1]);
        lineupValues[index] = 0;
    }

    for(let i = rows.length-1; i > 0; i--){
        if(!topLineups.includes(rows[i])) table.deleteRow(i);
    }
    if(site == "DK"){
        document.getElementById("lineupsBuilt").innerHTML = topLineups.length;
    }else{
        document.getElementById("lineupsBuiltFD").innerHTML = topLineups.length;
    }
}

function valueOfLineup(lineup){
    var t_id = "playerAdjustTable";
    var players = document.getElementById(t_id).rows;
    var lineupObj = {};
    var teams = [];
    for(let p of lineup){
        var player = getPlayer(p, players);
        var team = player.cells[whichCol(t_id, "Team")].innerHTML;
        teams.push(team);
        var opp = player.cells[whichCol(t_id, "Opponent")].innerHTML;
        var game = alphabetize(team, opp);
        var salary = player.cells[whichCol(t_id, "Salary")].innerHTML;
        var proj = player.cells[whichCol(t_id, "Proj")].getElementsByTagName("input")[0].value;
        var expensive = salary >= 8000;
        var highUsage = proj >= 15;
        var value = proj/salary * 1000;
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
        if(p.cells[whichCol("playerAdjustTable", "Player")].innerHTML == name) return p;
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
        var t_id = "playerAdjustTable";
        var contestDataTable = document.getElementById(t_id);
        var rows = contestDataTable.rows;
        var teams = [];
        for(let i = 1; i < rows.length; i++){
            let team = rows[i].cells[whichCol(t_id, "Team")].textContent;
            let opp = rows[i].cells[whichCol(t_id, "Opponent")].textContent;
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

// Late swap: same as optimizer but only optimize for players who have not yet played
function fillTableForLateSwap(){
    // get current lineups uploaded by the user
    var lineups = document.getElementById("current-lineup-upload").files[0];
    var reader = new FileReader();
    // add lineups to lineupTable
    reader.onload = function(e){
        var csv = e.target.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for(let i = 0; i < lines.length; i++){
            var obj = [];
            var currentline = lines[i].split(",");
            for(let j = 0; j <= 11; j++){
                obj[j] = currentline[j];
            }
            result.push(obj);
        }
        var lineupTable = document.getElementById("late-swap-table");
        while(lineupTable.rows.length > 1){
            lineupTable.deleteRow(1);
        }
        for(let i = 0; i < result.length; i++){
            var l = result[i];
            var row = lineupTable.insertRow(-1);
            for(let j = 0; j < l.length; j++){
                var cell = row.insertCell(-1);
                if(i == 0){
                    cell.innerHTML = l[j];
                    cell.style.background = "linear-gradient(#858585, #e7e7e7)";
                    cell.style.color = "#000000";
                    cell.style.fontWeight = "bold";
                }else if(j < 4){
                    cell.innerHTML = l[j];
                    cell.style.background = "#BBBBBB";
                    cell.style.color = "#000000";
                    cell.style.fontWeight = "bold";
                }else{
                    var p = l[j];
                    cell.innerHTML = getPlayerDataForLineup(p);
                    var team = cell.innerHTML.split("<br>")[2];
                    cell.style.backgroundColor = getTeamColor(team);
                    cell.style.color = getTeamSecondaryColor(team);
                }
            }
        }
    }
    reader.readAsText(lineups);
}

function getPlayerDataForLineup(p){
    var contest_data = document.getElementById("contestDataTable").rows;
    for(let i = 1; i < contest_data.length; i++){
        let player = contest_data[i];
        if(player.cells[5].innerHTML == p){
            return player.cells[1].innerHTML + "<br>" + player.cells[2].innerHTML + "<br>" + player.cells[3].innerHTML + "<br>" + p;
        }
    }
}

// Late swap: same as optimizer but only optimize for players who have not yet played
function lateSwapLineups(){
    var lineupTable = document.getElementById("late-swap-table").rows;
    for(let r of lineupTable){
        let lineup = [];
        for(let c of r.cells){
            if(c.cellIndex < 4) continue;
            lineup.push(c.innerHTML.split("<br>")[3]);
        }
        if(r.rowIndex == 0) continue;
        lateSwapThisLineup(lineup, r.rowIndex);
    }
}

function lateSwapThisLineup(lineup, row_index){
    var player_info = getInfoFromJSON("data_from_google_sheets.json");
    var contest_data_table = document.getElementById("contestDataTable").rows;
    var possible_pool = [];
    var players_to_swap = [];
    var salary_cap = 50000;
    for(let i = 1; i < contest_data_table.length; i++){
        let row = contest_data_table[i];
        let name = row.cells[1].textContent;
        if(name == undefined) continue;
        // continue if player's game has started
        let event_info = player_info[name]["event-info"].split(" ");
        let game_time = new Date(event_info[1] + " " + event_info[2] + " " + event_info[3]);
        let current_time = new Date();
        if(game_time < current_time) {
            if(lineup.includes(row.cells[5].textContent)){
                salary_cap -= Number(row.cells[2].textContent);
            }
            continue;
        }
        // add player to possible pool
        let player = player_info[row.cells[1].textContent];
        player["salary"] = row.cells[2].textContent;
        player["position"] = row.cells[0].textContent;
        possible_pool.push(player);
        if(lineup.includes(row.cells[5].textContent)){
            players_to_swap.push(getPositionFromIndex(lineup.indexOf(row.cells[5].textContent)));
        }
    }

    swaptimize(players_to_swap, possible_pool, salary_cap, row_index);
}

function getPositionFromIndex(index){
    if(index==0) return "PG";
    else if(index==1) return "SG";
    else if(index==2) return "SF";
    else if(index==3) return "PF";
    else if(index==4) return "C";
    else if(index==5) return "G";
    else if(index==6) return "F";
    else if(index==7) return "UTIL";
}

async function swaptimize(players_to_swap, possible_pool, salary_cap, row_index){
    // use the solver to find the best players that fit the position-to-swap 
    // the max salary cap for the new players is salary_cap
    // positions of new players are the inverse of getPositionsFromIndex
    // players_to_swap should include the positions of the players to swap
    var lineups = document.getElementById("late-swap-table").rows;
    let promise = new Promise((resolve) => {
        for(let p of possible_pool){
            p = randomizeProjection(p, getBlowouts());
            resolve(p);
        }
    });
    promise.then((p) => {
    
        var solver = new Solver();
        var players = [];
        var constraints = {
            "PG": {"min": 0},
            "SG": {"min": 0},
            "SF": {"min": 0},
            "PF": {"min": 0},
            "C": {"min": 0},
            "G": {"min": 0},
            "F": {"min": 0},
            "UTIL": {"equal": 0},
            "Salary": {"max": salary_cap}
        };
        for(let p of possible_pool){
            let possible_positions = [];
            if("PG" in p["positions"]) possible_positions.push("PG");
            if("SG" in p["positions"]) possible_positions.push("SG");
            if("SF" in p["positions"]) possible_positions.push("SF");
            if("PF" in p["positions"]) possible_positions.push("PF");
            if("C" in p["positions"]) possible_positions.push("C");
            if("G" in p["positions"]) possible_positions.push("G");
            if("F" in p["positions"]) possible_positions.push("F");
            possible_positions.push("UTIL");
            for(let pos of possible_positions){
                p[pos] = 1;
            }
            for(let pos of players_to_swap){
                if(!players.includes(p) && pos in p && p[pos] == 1){
                    players.push(p);
                }
            }
        }
        for(let pos of players_to_swap){
            constraints[pos]["min"] =+ 1;
        }

        constraints["UTIL"]["equal"] = players_to_swap.length;
        
        var model = {
            "optimize": "Projection",
            "opType": "max",
            "constraints": constraints,
            "variables": players,
            "binaries": players
        };
        var solution = solver.Solve(model);
        var lineup = [];
        for(let p of players){
            if(solution[p] == 1){
                lineup.push(p);
            }
        }
        var orderIsCorrect = false;
        var beginLoop = Date.now();
        var site = document.getElementById("dfs-site-btn").textContent;

        while(!orderIsCorrect){
            orderIsCorrect = site == "Y" ? checkOrder(lineupPlayers, ["PG", "SG", "G", "SF", "PF", "F", "C", "UTIL"]) : checkOrder(lineupPlayers);
            if(!orderIsCorrect) lineup = shuffle(lineup);
            if(Date.now() - beginLoop > 1000) break;
        }

        for(let i = 0; i < players_to_swap.length; i++){
            let p = players_to_swap[i];
            let index = getIndexFromPosition(p) + 4;
            lineups[row_index].cells[index].innerHTML = lineup[i]["Name"];
        }

    });
}

// opposite of getPositionFromIndex
function getIndexFromPosition(pos){
    if(pos=="PG") return 0;
    else if(pos=="SG") return 1;
    else if(pos=="SF") return 2;
    else if(pos=="PF") return 3;
    else if(pos=="C") return 4;
    else if(pos=="G") return 5;
    else if(pos=="F") return 6;
    else if(pos=="UTIL") return 7;
}

// Toggles player data based on site selected
function changeDFSSite(el){
    if(el.textContent == "DK"){ 
        el.textContent = "FD";
        el.className = "fd-btn";
       
    } else if(el.textContent == "Y"){ 
        el.textContent = "DK";
        el.className = "dk-btn";

    } else{
        el.textContent = "Y";
        el.className = "yahoo-btn";
    }
    fillPlayersFromJSON();
    colorRowsBasedOnTeam(document.getElementById("playerAdjustTable"), whichCol("playerAdjustTable", "Team"));
    selectBuilder();
    updateOwnership();
}

// find which column corresponds to a header for a given table
function whichCol(table_id, header){
    var table = document.getElementById(table_id);
    var headers = table.rows[0].cells;
    for(let i = 0; i < headers.length; i++){
        if(headers[i].textContent == header) return i;
    }
}

// find which row corresponds to a player for a given table
function whichRow(table_id, player){
    var table = document.getElementById(table_id);
    var rows = table.rows;
    var player_col = whichCol(table_id, "Player");
    for(let i = 1; i < rows.length; i++){
        if(rows[i].cells[player_col].textContent == player) return i;
    }
}

// filling player adjust table with data from .json file based on the selected DFS site
function fillPlayersFromJSON(){
    var player_info = getInfoFromJSON("data_from_google_sheets.json");
    var player_adjust_table = document.getElementById("playerAdjustTable");
    var rows = player_adjust_table.rows;
    var players = Object.keys(player_info);
    var site = document.getElementById("dfs-site-btn").textContent;
    var injuries = (localStorage.NBAInjuries) ? JSON.parse(localStorage.NBAInjuries) : [];
    var savedPlayerData = (localStorage.savedPlayerDataNBA) ? JSON.parse(localStorage.savedPlayerDataNBA) : {};
    var savedTopPlays = (localStorage.topPlaysNBA) ? JSON.parse(localStorage.topPlaysNBA) : {};
    var savedRemoved = (localStorage.removedFromPoolNBA) ? JSON.parse(localStorage.removedFromPoolNBA) : {};
    var teams = [];
    
    while(rows.length > 1){
        player_adjust_table.deleteRow(1);
    }
    for(let p of players){
        let player = player_info[p];
        let row = player_adjust_table.insertRow(-1);
        switch(site){
            case "DK": 
                var proj = player["Projection"];
                var salary = player["DK Salary"];
                var id = player["DK ID"];
                var pos = player["DK Position"];
                var top_play = player["TopPlayDK"];
                var remove = player["RemovedDK"];
                break;
            case "FD":
                var proj = player["FD Projection"];
                var salary = player["FD Salary"];
                var id = player["FD ID"];
                var pos = player["FD Position"];
                var top_play = player["TopPlayFD"];
                var remove = player["RemovedFD"];
                break;
            case "Y":
                var proj = player["FD Projection"];
                var salary = player["Y Salary"];
                var id = player["Y ID"];
                var pos = player["Y Position"];
                var top_play = player["TopPlayY"];
                var remove = player["RemovedY"];
                break;
        }

        if(savedPlayerData[p]){
            proj = savedPlayerData[p];
        }
        if(p in savedTopPlays){
            top_play = "true";
        }
        if(p in savedRemoved){
            remove = "true";
        }
        row.insertCell(0).innerHTML = p;
        row.insertCell(-1).innerHTML = id; //site == "DK" ? player["DK ID"] : player["FD ID"];
        row.insertCell(-1).innerHTML = pos //site == "DK" ? player["DK Position"] : player["FD Position"];
        row.insertCell(-1).innerHTML = player["Team"];
        row.insertCell(-1).innerHTML = player["Opp"];
        row.insertCell(-1).innerHTML = player["event-info"];
        row.insertCell(-1).innerHTML = salary //site == "DK" ? player["DK Salary"] : player["FD Salary"];
        row.insertCell(-1).innerHTML = "<input type='range' value='" + proj + "' min='0' max='100' step='0.1' oninput='updateProj(this)'><text id='"+id+"Proj'>"+proj+"</text>";
        
        if(p in injuries){
            row.cells[whichCol("playerAdjustTable", "Proj")].getElementsByTagName("input")[0].value = 0;
            row.insertCell(-1).innerHTML = "<button class='injured' onclick='toggleInjured(this)'>Injured</button>";
            row.insertCell(-1).innerHTML = "<button class='removeFromPool' onclick='togglePlay(this)'>Removed</button>";
        }else if(top_play == "true"){
            row.insertCell(-1).innerHTML = "<button class='healthy' onclick='toggleInjured(this)'>Healthy</button>";
            row.insertCell(-1).innerHTML = "<button class='topPlay' onclick='togglePlay(this)'>Top Play</button>";    
        }else if(remove == "true"){
            row.insertCell(-1).innerHTML = "<button class='healthy' onclick='toggleInjured(this)'>Healthy</button>";
            row.insertCell(-1).innerHTML = "<button class='removeFromPool' onclick='togglePlay(this)'>Removed</button>";
        }else{
            row.insertCell(-1).innerHTML = "<button class='healthy' onclick='toggleInjured(this)'>Healthy</button>";
            row.insertCell(-1).innerHTML = "<button class='inPool' onclick='togglePlay(this)'>In Pool</button>";
        }

        if(!teams.includes(player["Team"])) teams.push(player["Team"]);
    }
    teams.sort();
    var teamSelect = document.getElementById("teamSelect");
    for(let t of teams){
        teamSelect.innerHTML += "<option value='"+t+"'>"+t+"</option>";
    }
    
}