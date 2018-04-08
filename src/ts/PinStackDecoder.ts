/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinStackMath.ts"/>

class PinStackDecoder {
    /** Depth and Space Data database */
    private pinData: PinDataDatabase;

    /** File input used to open CSV file containing pin lengths */
    private csvFileInput: JQuery;

    /** Pin specification select element */
    private pinSpecSelect: JQuery;
    /** Element to select number of pin stacks */
    private numStacks: JQuery;
    /** Element to select (max) number of build-up pins */
    private numBuildupPins: JQuery;
    /** Slement to select units of measurement */
    private measUnitSelect: JQuery;

    /** DIV containing inputs for pinning */
    private pinningArea: JQuery;
    /** Table for displaying calculated pin values */
    private pinningTable: JQuery;
    /** Table for displaying control key bitting */
    private controlBittingTable: JQuery;
    /** Table for displaying change/master key bittings */
    private changeBittingTable:  JQuery;

    /** Button to initiate calculations */
    private runCalculationsButton: JQuery;

    /** Array of pin length input boxes */
    private pinArray: JQuery[][];

    /** Array of calculated pin numbers */
    private pinNumbers: number[][];

    /**
     * Constructor, grabs elements from the DOM
     */
    public constructor() {
        this.pinData = new PinDataDatabase();

        this.csvFileInput   = $("#csvFileInput");

        this.pinSpecSelect  = $("#pinSpecSelect");
        this.numStacks      = $("#numStacks");
        this.numBuildupPins = $("#numBuildupPins");
        this.measUnitSelect = $("#measUnitSelect");

        this.pinningArea         = $(".pinningArea");
        this.pinningTable        = $(".pinningTable");
        this.controlBittingTable = $(".controlBittingTable");
        this.changeBittingTable  = $(".changeBittingTable");

        this.runCalculationsButton = $("#runCalculations");

        this.pinArray   = Array();
        this.pinNumbers = Array();
    }

    /**
     * Reads the keys from the database, creates canvas contexts, and attaches
     * event callbacks.
     */
    public init() {
        this.pinData.readDatabase("pindata.json", () => this.onPinDataUpdate());

        this.csvFileInput.on("change", () => this.onCSVFileSelect());

        this.pinSpecSelect.on("change",  () => this.onPinSpecChange());

        this.numStacks.on("change",      () => this.onPinNumberChange());
        this.numBuildupPins.on("change", () => this.onPinNumberChange());

        this.runCalculationsButton.on("click", () => this.runCalculations());
    }

    private onPinDataUpdate() {
        let specs = this.pinData.getNames();
        specs.forEach((val: string, idx: number) => {
            this.pinSpecSelect.append(
                $("<option/>", {
                    value: idx
                }).text(val)
            );
        });

        this.onPinSpecChange();
    }

    private onPinSpecChange() {
        let idx = this.pinSpecSelect.val();

        if(idx !== undefined) {
            let bottom  = this.pinData.getBottomSizes(+idx);
            let buildup = this.pinData.getBuildupSizes(+idx);
            let control = this.pinData.getControlShear(+idx);

            PinStackMath.setBottomPinData(bottom);
            PinStackMath.setBuildupPinData(buildup);
            PinStackMath.setControlShear(control);
        }
    }

    private onPinNumberChange() {
        this.pinningArea.empty();
        this.pinArray = Array();

        let stacks   = this.numStacks.val();
        let buildups = this.numBuildupPins.val();

        if(stacks !== undefined && buildups !== undefined) {
            for(let i = 0; i < 2 + +buildups; i++) {
                for(let j = 0; j < +stacks; j++) {
                    if(i == 0) {
                        this.pinArray[j] = Array();
                    }
                    let elem = $("<input size='6' maxlength='6'/>").addClass("pinInput");
                    this.pinArray[j][i] = elem;
                    this.pinningArea.append(elem);
                }
                this.pinningArea.append("<br/>");
            }
        }
    }

    private runCalculations() {
        this.pinNumbers = Array();

        let scaleFactor = this.measUnitSelect.val();
        if(scaleFactor === undefined) return;

        for(let i = 0; i < this.pinArray.length; i++) {
            this.pinNumbers[i] = Array();
            for(let j = 0; j < this.pinArray[i].length; j++) {
                let pinLength   = this.pinArray[i][j].val();

                if(pinLength !== undefined) {
                    // TODO: Unit conversion, if necessary
                    if(j < this.pinArray[i].length - 1) { // Build-up/driver pin
                        let pin = PinStackMath.buildupSizeToNumber(+pinLength * +scaleFactor);
                        this.pinNumbers[i][j] = pin;
                    } else { // Bottom pin
                        let pin = PinStackMath.bottomSizeToNumber(+pinLength * +scaleFactor);
                        this.pinNumbers[i][j] = pin;
                    }
                }
            }
        }

        this.pinningTable.empty();
        for(let i = 0; i < this.pinNumbers[0].length; i++) {
            let row = $("<tr/>");
            for(let j = 0; j < this.pinNumbers.length; j++) {
                row.append($("<td/>").text(this.pinNumbers[j][i]));
            }
            this.pinningTable.append(row);
        }

        let control = PinStackMath.getControlBitting(this.pinNumbers);
        let changes = PinStackMath.getChangeBittings(this.pinNumbers);

        this.controlBittingTable.empty();
        this.changeBittingTable.empty();

        let controlRow = $("<tr/>");
        for(let i = 0; i < control.length; i++) {
            controlRow.append($("<td/>").text(control[i]));
        }
        this.controlBittingTable.append(controlRow);

        for(let i = 0; i < changes.length; i++) {
            let row = $("<tr/>");
            for(let j = 0; j < changes[i].length; j++) {
                row.append($("<td/>").text(changes[i][j]));
            }
            this.changeBittingTable.append(row);
        }
    }


    private loadCSV(csv: string) {
        let array = Array();

        csv.split(/(?:\r\n|\r|\n)/g).forEach((val: string, row: number) => {
            if(val.length < 1) return;
            array[row] = Array();
            val.split(",").forEach((val: string, col: number) => {
                array[row][col] = +val;
            })
        });

        this.numStacks.val(array[0].length);
        this.numBuildupPins.val(array.length - 2);
        this.onPinNumberChange();

        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array[i].length; j++) {
                this.pinArray[j][i].val(array[i][j]);
            }
        }
    }

    private onCSVFileSelect() {
        let fr = new FileReader();
        fr.onload = () => {
            this.loadCSV(fr.result);
        };

        fr.readAsText(this.csvFileInput.prop("files")[0]);
    }

}
