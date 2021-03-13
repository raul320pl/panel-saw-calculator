const calc = document.getElementById("calc");

//boiard constructor
function Board(boardLength, boardWidth, thickness, material) {
    this.boardLength = boardLength;
    this.boardWidth = boardWidth;
    this.thickness = thickness;
    this.material = material;
}

Board.prototype.volume = function () {
    return this.boardLength * this.boardWidth * this.thickness;
}

Board.prototype.area = function () {
    return this.boardLength * this.boardWidth;
}

//panel constructor
function Panel(panelLength, panelWidth) {
    this.panelLength = panelLength;
    this.panelWidth = panelWidth;
}

Panel.prototype.area = function () {
    return this.panelLength * this.panelWidth;
}

//board processor
function Processor(board, panel, sawThicnkess, margins){
    this.board = board;
    this.panel = panel;
    this.sawThicnkess = sawThicnkess;    
    this.margins = margins
}

Processor.prototype.getMaxPack = function(){
    //sort panel dimm
    
    //check horizontal aragement

    //check vertical aragement

    //compare efficiency

    //return results
    let eff = 93
    return `${this.board.material} ${this.board.thickness} => efficiency ${eff}%"`
}

const pb1 = new Board(2800, 2070, 15, "Particle board");
const pw1 = new Board(1525, 1525, 15, "Plywood - small sheet");
console.log(pb1, pb1.area())

const panel1 = new Panel(1050, 220);
console.log(panel1, panel1.area())

const proces1 = new Processor(pb1, panel1, 5, [10,10]);
console.log(proces1.getMaxPack())

