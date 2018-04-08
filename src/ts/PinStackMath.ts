/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinDataJson.ts"/>

namespace PinStackMath {
    var buildupPinData: PinDataJsonEntrySize[] | null = null;
    var bottomPinData:  PinDataJsonEntrySize[] | null = null;

    export function setBuildupPinData(pinData: PinDataJsonEntrySize[]) {
        buildupPinData = pinData;
    }

    export function setBottomPinData(pinData: PinDataJsonEntrySize[]) {
        bottomPinData = pinData;
    }

    function getNearestPinNumber(pinData: PinDataJsonEntrySize[], size: number): number {
        for(let i = 1; i < pinData.length; i++) {
            if(size < (pinData[i].size + pinData[i - 1].size) / 2.0) {
                return pinData[i - 1].name;
            }
        }
        return pinData[pinData.length - 1].name;
    }

    export function buildupSizeToNumber(size: number): number {
        if(buildupPinData != null) {
            return getNearestPinNumber(buildupPinData, size);
        } else {
            console.error("PinStackMath.buildupSizeToNumber: buildupPinData is NULL!");
            return 0;
        }
    }

    export function bottomSizeToNumber(size: number): number {
        if(bottomPinData != null) {
            return getNearestPinNumber(bottomPinData, size);
        } else {
            console.error("PinStackMath.bottomSizeToNumber: bottomPinData is NULL!");
            return 0;
        }
    }
}