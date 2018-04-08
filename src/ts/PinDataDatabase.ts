/// <reference path="./PinDataJson.ts"/>

class PinDataDatabase {
    /** Pin data */
    private pinData: PinDataJson | null = null;

    constructor() {
    }

    public readDatabase(url: string, callback?: () => any) {
        $.getJSON(url, (data: PinDataJson) => {
            console.info("pinDataDatabase.readDatabase success!");
            this.pinData = data;

            if(callback !== undefined) {
                callback();
            }
        }).fail((err) => {
            console.error("pinDataDatabase.readDatabase failed: " + err);
        });

    }

    public nSpecs(): number {
        if(this.pinData !== null) {
            return this.pinData.pindata.length;
        }
        return 0;
    }


    public specName(idx: number): string {
        if(this.pinData !== null) {
            if(idx < this.pinData.pindata.length && idx > 0) {
                return this.pinData.pindata[idx].name;
            } else {
                console.error("pinDataDatabase.keyNames: idx (" + idx + ") out of range!")
            }
        }
        return "";
    }

    public getNames(): string[] {
        let ret: string[] = new Array();

        if(this.pinData !== null) {
            for(let i = 0; i < this.pinData.pindata.length; i++) {
                ret.push(this.pinData.pindata[i].name);
            }
        }

        return ret;
    }


    public getBottomSizes(idx: number): PinDataJsonEntrySize[] {
        let ret: PinDataJsonEntrySize[] = new Array();

        if(this.pinData !== null) {
            if(idx < 0 || idx >= this.pinData.pindata.length) {
                console.error("pinDataDatabase.getSizes(): Index (" + idx + ") out of range!");
            } else {
                if("bottomSizes" in this.pinData.pindata[idx]) {
                    ret = this.pinData.pindata[idx].bottomSizes;
                } else {
                    for(let i = 0; i < this.pinData.pindata[idx].bottomPinSizes; i++) {
                        let depth: PinDataJsonEntrySize = {
                            name: (i + this.pinData.pindata[idx].bottomPinStartNumber),
                            size: this.pinData.pindata[idx].bottomPinStartSize + (this.pinData.pindata[idx].bottomPinStepSize * i)
                        };
                        ret.push(depth);
                    }
                }
            }
        }

        return ret;
    }

    public getBuildupSizes(idx: number): PinDataJsonEntrySize[] {
        let ret: PinDataJsonEntrySize[] = new Array();

        if(this.pinData !== null) {
            if(idx < 0 || idx >= this.pinData.pindata.length) {
                console.error("pinDataDatabase.getSizes(): Index (" + idx + ") out of range!");
            } else {
                if("buildupSizes" in this.pinData.pindata[idx]) {
                    ret = this.pinData.pindata[idx].buildupSizes;
                } else {
                    for(let i = 0; i < this.pinData.pindata[idx].buildupPinSizes; i++) {
                        let depth: PinDataJsonEntrySize = {
                            name: (i + this.pinData.pindata[idx].buildupPinStartNumber),
                            size: this.pinData.pindata[idx].buildupPinStartSize + (this.pinData.pindata[idx].buildupPinStepSize * i)
                        };
                        ret.push(depth);
                    }
                }
            }
        }

        return ret;
    }
}
