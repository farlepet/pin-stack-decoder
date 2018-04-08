/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinDataJson.ts"/>

namespace PinStackMath {
    var buildupPinData: PinDataJsonEntrySize[] | null = null;
    var bottomPinData:  PinDataJsonEntrySize[] | null = null;

    var controlShear: number | null = null;

    export function setBuildupPinData(pinData: PinDataJsonEntrySize[]) {
        buildupPinData = pinData;
    }

    export function setBottomPinData(pinData: PinDataJsonEntrySize[]) {
        bottomPinData = pinData;
    }

    export function setControlShear(shear: number) {
        controlShear = shear;
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


    export function getControlBitting(pins: number[][]): number[] {
        if(controlShear == null) {
            console.error("PinStackMath.getControlBitting: controlShear is NULL!");
            return Array();;
        }

        let ret = Array();

        for(let i = 0; i < pins.length; i++) {
            let sum = 0;
            for(let j = 1; j < pins[i].length; j++) {
                sum += pins[i][j];
            }
            ret[i] = sum - controlShear;
        }

        return ret;
    }

    export function getChangeBittings(pins: number[][]): number[][] {
        let ret = Array();

        for(let i = 0; i < pins.length; i++) {
            let sum = 0;
            let n = 0;
            let j = pins[0].length - 1;
            let end = (controlShear === 0) ? 1 : 2;

            for(; j >= end; j--) {
                if(i == 0) ret[n] = Array();
                sum += pins[i][j];
                ret[n][i] = sum;
                n++;
            }
        }

        return ret;
    }
}