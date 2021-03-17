

//boiard constructor
function Board(boardLength, boardWidth, thickness, material, materialPrice) {
    this.boardLength = boardLength >= boardWidth ? boardLength : boardWidth;
    this.boardWidth = boardWidth < boardLength ? boardWidth : boardWidth;
    this.thickness = thickness;
    this.material = material;
    this.materialPrice = materialPrice;
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
    this.usage = 3.15;
    this.cost = 2.5;
}

Processor.prototype.boardLabel = function () {
    return `${this.board.material} ${this.board.thickness}`;
}

Processor.prototype.panelDimmLabel = function () {
    return `${this.panel.panelLength} x ${this.panel.panelWidth}`;
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
            cols: {
                qty: boardLongwisePanelLongwise[0],
                dimm: this.panel.panelWidth,
                space: this.sawThicnkess
            },
            rows: {
                qtyr: boardLongwisePanelLongwise[1],
                dimm: this.panel.panelLength,
                space: this.sawThicnkess
            },
            board: this.board,
            panel: this.panel
        }
    } else {
        return {
            cols: {
                qty: boardLongwisePanelWidthwise[0],
                dimm: this.panel.panelLength,
                space: this.sawThicnkess
            },
            rows: {
                qty: boardLongwisePanelWidthwise[1],
                dimm: this.panel.panelWidth,
                space: this.sawThicnkess
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


//App controller
const app = (function () {
    const boardCanvas = document.getElementById("boardCanvas");
    const boardList = document.getElementById("boardList");
    const panelList = document.getElementById("panelList");
    const btnAdd = document.getElementById("btnAdd");
    const btnUpdate = document.getElementById("btnUpdate");

    const panelNr = document.getElementById("panelNr");
    const panelWidth = document.getElementById("panelWidth");
    const panelLength = document.getElementById("panelLength");

    var activeBoard = null;
    var activePanelProcessor = null;
    const panelProcessors = [];
    const boards = [
        new Board(2800, 2070, 15, "Particle board", 745.00),
        new Board(2800, 2070, 3, "HDF Board", 1075.00),
        new Board(2500, 1250, 15, "Plywood - big sheet", 1450.00),
        new Board(1525, 1525, 15, "Plywood - small sheet", 1600.00)
    ];

    const getBoardList = function () {
        let radioBoxes = boards.map((board, index) => {
            return `<p><label>
                <input id="board_${index}" type="radio" name="group1" />
                <span>${board.material} ${board.boardLength} x ${board.boardWidth} x ${board.thickness}</span> 
                <span class="badge">${board.materialPrice} PLN/m<sup>3</sup></span>
            </label></p>`;
        });
        return radioBoxes.reduce((pr, curr) => pr + curr);
    }

    const updateActiveBoard = function (e) {
        activeBoard = this.boards[e.srcElement.id.split("_")[1]];
        //console.log(`recalculate... `, activeBoard);
    }

    const updatePanel = function (e) {
        //
        console.log(e)
    }

    const addPanel = function (e) {
        //create panel and save list

        //TODO: 
        // - get last item, check duplicates
        // - identification by unique part name

        let itemNr = 1;

        let tableRow = document.createElement('tr');
        tableRow.setAttribute('id',`panel_${itemNr}`);
        tableRow.innerHTML = `        
        <td>${panelNr.value}</td>
        <td>${activePanelProcessor.boardLabel()}</td>
        <td>${activePanelProcessor.panelDimmLabel()}</td>
        <td>${activePanelProcessor.usage}</td>
        <td>${activePanelProcessor.price}</td>
        <td>
            <i class="material-icons edit">edit</i>
            <i class="material-icons delete">delete</i>
        </td>`
        panelList.appendChild(tableRow);
    }

    const clickPanelList = function (e) {
        if (e.srcElement.classList.contains("delete")) {
            //delete
            console.log(`delete ${e.srcElement.parentNode.parentNode.id.split("_")[1]}`);
        } else if (e.srcElement.classList.contains("edit")) {
            //edit
            console.log(`edit ${e.srcElement.parentNode.parentNode.id.split("_")[1]}`);
        }
    }


    return {
        init: function () {
            boardList.innerHTML = getBoardList();
            boardList.addEventListener('change', updateActiveBoard);
            btnAdd.addEventListener('click', addPanel);
            btnUpdate.addEventListener('click', updatePanel);
            panelList.addEventListener('click', clickPanelList);
            activePanelProcessor = new Processor(new Board(2333, 1400, 15, 'Particle board', 1432), new Panel(100, 300, 'ASDAS'), 5.0, 10.0, 10.0);
            console.log(activePanelProcessor.boardLabel());
            console.log(activePanelProcessor.panelDimmLabel());
            //console.log(b1) 
        },

        activeBoard: function () { return activeBoard }
    }
}
)();


app.init();