const dataForm = document.getElementById("dataForm");
const boardCanvas = document.getElementById("boardCanvas");
const resultOutput = document.getElementById("resultOutput");

//boiard constructor
function Board(boardLength, boardWidth, thickness, material) {
    this.boardLength = boardLength >= boardWidth ? boardLength : boardWidth;
    this.boardWidth = boardWidth < boardLength ? boardWidth : boardWidth;
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
function Panel(panelLength, panelWidth, partNr) {
    this.panelLength = panelLength >= panelWidth ? panelLength : panelWidth;
    this.panelWidth = panelWidth < panelLength ? panelWidth : panelLength;
    this.partNr = partNr;
}

Panel.prototype.area = function () {
    return this.panelLength * this.panelWidth;
}

function Processor(board, panel, sawThicnkess, boardWidthMargin, boardLengthMargin) {
    this.board = board;
    this.panel = panel;
    this.sawThicnkess = sawThicnkess;
    this.boardWidthMargin = boardWidthMargin;
    this.boardLengthMargin = boardLengthMargin;
}

Processor.prototype.getMaxPack = function () {

    let boardLongwisePanelLongwise = [
        getOptimalCt(this.board.boardWidth, this.panel.panelWidth, this.boardWidthMargin, this.sawThicnkess),
        getOptimalCt(this.board.boardLength, this.panel.panelLength, this.boardLengthMargin, this.sawThicnkess)
    ];

    let boardLongwisePanelWidthwise = [
        getOptimalCt(this.board.boardWidth, this.panel.panelLength, this.boardWidthMargin, this.sawThicnkess),
        getOptimalCt(this.board.boardLength, this.panel.panelWidth, this.boardLengthMargin, this.sawThicnkess)
    ];

    //check refilement

    if (boardLongwisePanelLongwise.reduce((pr, curr) => pr * curr) > (boardLongwisePanelWidthwise.reduce((pr, curr) => pr * curr))) {
        return {
            W: {
                r: boardLongwisePanelLongwise[0],
                d: this.panel.panelWidth,
                s: this.sawThicnkess
            },
            L: {
                r: boardLongwisePanelLongwise[1],
                d: this.panel.panelLength,
                s: this.sawThicnkess
            },
            board: this.board,
            panel: this.panel
        }
    } else {
        return {
            W: {
                r: boardLongwisePanelWidthwise[0],
                d: this.panel.panelLength,
                s: this.sawThicnkess
            },
            L: {
                r: boardLongwisePanelWidthwise[1],
                d: this.panel.panelWidth,
                s: this.sawThicnkess
            },            
            board: this.board,
            panel: this.panel
        }
            
    }

}

function getOptimalCt(boardDim, panelDim, boardMargin, sawWidth) {
    const ITER_MAX = 10;

    let usefullDimm = boardDim - boardMargin;
    if (usefullDimm > panelDim) {
        return Math.floor(usefullDimm / (panelDim + sawWidth));
    } else {
        return 0;
    }

}

const pb1 = new Board(2800, 2070, 15, "Particle board");
const pw1 = new Board(1525, 1525, 15, "Plywood - small sheet");
console.log(pb1, pb1.area())

const panel1 = new Panel(00, 750, "ZG123123");
console.log(panel1, panel1.area())

const proces1 = new Processor(pb1, panel1, 5, 10, 10);
console.log(proces1.getMaxPack())

