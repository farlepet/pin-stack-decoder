/// <reference path="./PinDataDatabase.ts"/>

class PinStackDecoder {
    /** Depth and Space Data database */
    private pinData: PinDataDatabase;


    /**
     * Constructor, grabs elements from the DOM
     */
    public constructor() {
        this.pinData = new PinDataDatabase();
    }

    /**
     * Reads the keys from the database, creates canvas contexts, and attaches
     * event callbacks.
     */
    public init() {
        this.pinData.readDatabase("pindata.json", () => this.onPinDataUpdate());

    }

    private onPinDataUpdate() {
        
    }
}
