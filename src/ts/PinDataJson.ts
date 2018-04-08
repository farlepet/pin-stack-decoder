/** Root of pindata json file */
interface PinDataJson {
    /** List of data for different pin specifications */
    pindata: PinDataEntry[];
}

/** Pin data entry */
interface PinDataEntry {
    /** Name of specification */
    name: string;

    /** Number of first bottom pin size */
    bottomPinStartNumber: number;
    /** Number of bottom pin sizes */
    bottomPinSizes:       number;
    /** Smallest size of bottom pin */
    bottomPinStartSize:   number;
    /** Step between each consecutive bottom pin size */
    bottomPinStepSize:    number;

    /** Number of first buildup pin size */
    buildupPinStartNumber: number;
    /** Number of buildup pin sizes */
    buildupPinSizes:       number;
    /** Smallest size of buildup pin */
    buildupPinStartSize:   number;
    /** Step between each consecutive buildup pin size */
    buildupPinStepSize:    number;

    /** Suggested height of pin stack */
    stackHeight:  number;
    /** Height of control shear above change shear, used to determine control key bitting */
    controlShear: number;


    bottomSizes:  PinDataJsonEntrySize[];
    buildupSizes: PinDataJsonEntrySize[];
}

/** Pin sizr entry */
interface PinDataJsonEntrySize {
    /** Name/number of pin length */
    name: number;
    /** Length of pin, in inches */
    size: number;
}