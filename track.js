var game1 = [ //horizontal track
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"s", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"f", m:""}],
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}]
];

var game2 = [ //loop track
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"t", m:"270"},{t:"f", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"s", m:""},{t:"t", m:"0"},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"v", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"v", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"t", m:"180"},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"t", m:"90"},{t:"g", m:""}],
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}]
];

var game3 = [ //right turn
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"s", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"h", m:""},{t:"t", m:"0"},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"v", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"g", m:"180"},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"f", m:"90"},{t:"g", m:""}],
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}]
];

var game4 = [ //8 track
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"t", m:"270"},{t:"f", m:""},{t:"s", m:""},{t:"t", m:"0"},{t:"g", m:"0"},{t:"g", m:""},{t:"g", m:""},{t:"g", m:"0"},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"v", m:""},{t:"g", m:""},{t:"g", m:""},{t:"v", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"t", m:"180"},{t:"h", m:""},{t:"h", m:""},{t:"i", m:""},{t:"h", m:""},{t:"t", m:"0"},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""}, {t:"g", m:"180"},{t:"g", m:""},{t:"g", m:""},{t:"v", m:""},{t:"g", m:""},{t:"v", m:"0"},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],

    [{t:"g", m:""}, {t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"t", m:"180"},{t:"h", m:""},{t:"t", m:"90"},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}],
    [{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""},{t:"g", m:""}]
];

var tracks = [{id:"game-1", board: game1}, {id:"game-2", board: game2}, {id:"game-3", board: game3}, {id:"game-4", board: game4}];

var images = [
    {id:"t",img:"track-90.png"},
    {id:"h",img:"track-horizontal.png"},
    {id:"v",img:"track-vertical.png"},
    {id:"s",img:"track-start.png"},
    {id:"f",img:"track-finish.png"},
    {id:"i",img:"track-intersection.png"},
    {id:"g",img:"track-grass.png"}
];

let timerId;
let direction = "east";

function reset() {
    console.clear();
    stop();
    direction = "east";
    var board = document.querySelector("#game-board");
    board.innerHTML = '';
    loadGame();
}

function start() {
    if(timerId != "") stop();

    var picker = document.querySelector("#game-picker");
    if(picker.selectedIndex > 0) {
        var event = new Event("redraw");
        var gameBoard = document.querySelector("#game-board");
        gameBoard.addEventListener('redraw', redraw, false);
        timerId = setInterval(function() {gameBoard.dispatchEvent(event);}, 80);
    }
}

function stop() {
    window.clearInterval(timerId);
    timerId = "";
}

function redraw() {
    tick(); //defined in your-code-here.js
}



function loadGame() {
    var menu = document.querySelector("#game-picker");
    var trackid = menu[menu.selectedIndex].id;
    paintTrack(trackid);
    showCar();
}

function showCar(){
    var gameBoard = document.querySelector("#game-board");
    var start = document.querySelector("#start");
    var car = document.createElement("img");
    car.setAttribute("id", "car");
    car.setAttribute("style", "top:" + (getCompTop(start) + 30) + "px;left:" + window.getComputedStyle(start).left);
    car.setAttribute("src", "art/car-red.png");
    gameBoard.appendChild(car);
}

function getProps(element) {
    var ce = window.getComputedStyle(element);
    var props = {
        left: stripPx(ce.left), top: stripPx(ce.top), width: stripPx(ce.width), height: stripPx(ce.height)
    }

    return props;
}

function stripPx(prop) {
    return parseInt(prop.replace("px", ""));
}

function getCompTop(element) { return parseInt(window.getComputedStyle(element).top.replace("px","")); }
function getCompLeft(element) { return parseInt(window.getComputedStyle(element).left.replace("px","")); }

function paintTrack(trackid) {
    var track = tracks.find(element => { return element.id == trackid; });
    var squareTop = 0;
    for(var i = 0;i<track.board.length;i++) {
        var squareLeft = 0;
        for(var j = 0;j<track.board[i].length;j++) {
            addSquare(track.board[i][j], squareTop, squareLeft);
            squareLeft += 100;
        }
        squareTop += 100;
    }
}

function addSquare(square, squareTop, squareLeft) {
    var gameBoard = document.querySelector("#game-board");
    var boardimg = images.find(function(element) {
        return element.id == square.t;
    });
    var pos = "pos-" +squareTop + "-" + squareLeft;
    var img = document.createElement("img");
    img.setAttribute("src","art/" + boardimg.img);
    img.setAttribute("style", "top:" +squareTop + "px;left:" + squareLeft + "px");
    img.setAttribute("class", "square " + pos);
    img.setAttribute("data-square-meta", square.m);
    img.setAttribute("data-square-type", square.t);

    if(square.t == "s") {
        img.setAttribute("id","start");
    }
    else if(square.t == "f") {
        img.setAttribute("id", "finish");
    }

    switch(parseInt(square.m)) {
        case 90:
            img.setAttribute("class", "square r90 " + pos);
            break;

        case 180:
            img.setAttribute("class", "square r180 " + pos);
            break;

        case 270:
            img.setAttribute("class", "square r270 " + pos);
            break;
    }
        

    gameBoard.appendChild(img);
}