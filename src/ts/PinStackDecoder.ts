/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinStackMath.ts"/>

class PinStackDecoder {
    /** Depth and Space Data database */
    private pinData: PinDataDatabase;

    /** Pin specification select element */
    private pinSpecSelect: JQuery;
    /** Element to select number of pin stacks */
    private numStacks: JQuery;
    /** Element to select (max) number of build-up pins */
    private numBuildupPins: JQuery;

    /** DIV containing inputs for pinning */
    private pinningArea: JQuery;

    /** Button to initiate calculations */
    private runCalculationsButton: JQuery;


    private pinArray: JQuery[][];

    /**
     * Constructor, grabs elements from the DOM
     */
    public constructor() {
        this.pinData = new PinDataDatabase();

        this.pinSpecSelect  = $("#pinSpecSelect");
        this.numStacks      = $("#numStacks");
        this.numBuildupPins = $("#numBuildupPins");

        this.pinningArea = $(".pinningArea");

        this.runCalculationsButton = $("#runCalculations");

        this.pinArray = Array();
    }

    /**
     * Reads the keys from the database, creates canvas contexts, and attaches
     * event callbacks.
     */
    public init() {
        this.pinData.readDatabase("pindata.json", () => this.onPinDataUpdate());

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

            PinStackMath.setBottomPinData(bottom);
            PinStackMath.setBuildupPinData(buildup);
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
        for(let i = 0; i < this.pinArray.length; i++) {
            for(let j = 0; j < this.pinArray[i].length; j++) {
                let pinLength = this.pinArray[i][j].val();

                if(pinLength !== undefined) {
                    // TODO: Unit conversion, if necessary
                    if(j < this.pinArray[i].length - 1) { // Build-up/driver pin
                        let pin = PinStackMath.buildupSizeToNumber(+pinLength);
                        console.info("Buildup pin number: (" + i + "," + j + "): " + pin);
                    } else { // Bottom pin
                        let pin = PinStackMath.bottomSizeToNumber(+pinLength);
                        console.info("Bottom pin number: (" + i + "," + j + "): " + pin);
                    }
                }
            }
        }
    }
}
