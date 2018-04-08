"use strict";
/// <reference path="./PinDataJson.ts"/>
var PinDataDatabase = /** @class */ (function () {
    function PinDataDatabase() {
        /** Pin data */
        this.pinData = null;
    }
    PinDataDatabase.prototype.readDatabase = function (url, callback) {
        var _this = this;
        $.getJSON(url, function (data) {
            console.info("pinDataDatabase.readDatabase success!");
            _this.pinData = data;
            if (callback !== undefined) {
                callback();
            }
        }).fail(function (err) {
            console.error("pinDataDatabase.readDatabase failed: " + err);
        });
    };
    PinDataDatabase.prototype.nSpecs = function () {
        if (this.pinData !== null) {
            return this.pinData.pindata.length;
        }
        return 0;
    };
    PinDataDatabase.prototype.specName = function (idx) {
        if (this.pinData !== null) {
            if (idx < this.pinData.pindata.length && idx > 0) {
                return this.pinData.pindata[idx].name;
            }
            else {
                console.error("pinDataDatabase.keyNames: idx (" + idx + ") out of range!");
            }
        }
        return "";
    };
    PinDataDatabase.prototype.getNames = function () {
        var ret = new Array();
        if (this.pinData !== null) {
            for (var i = 0; i < this.pinData.pindata.length; i++) {
                ret.push(this.pinData.pindata[i].name);
            }
        }
        return ret;
    };
    PinDataDatabase.prototype.getBottomSizes = function (idx) {
        var ret = new Array();
        if (this.pinData !== null) {
            if (idx < 0 || idx >= this.pinData.pindata.length) {
                console.error("pinDataDatabase.getSizes(): Index (" + idx + ") out of range!");
            }
            else {
                if ("bottomSizes" in this.pinData.pindata[idx]) {
                    ret = this.pinData.pindata[idx].bottomSizes;
                }
                else {
                    for (var i = 0; i < this.pinData.pindata[idx].bottomPinSizes; i++) {
                        var depth = {
                            name: (i + this.pinData.pindata[idx].bottomPinStartNumber),
                            size: this.pinData.pindata[idx].bottomPinStartSize + (this.pinData.pindata[idx].bottomPinStepSize * i)
                        };
                        ret.push(depth);
                    }
                }
            }
        }
        return ret;
    };
    PinDataDatabase.prototype.getBuildupSizes = function (idx) {
        var ret = new Array();
        if (this.pinData !== null) {
            if (idx < 0 || idx >= this.pinData.pindata.length) {
                console.error("pinDataDatabase.getSizes(): Index (" + idx + ") out of range!");
            }
            else {
                if ("buildupSizes" in this.pinData.pindata[idx]) {
                    ret = this.pinData.pindata[idx].buildupSizes;
                }
                else {
                    for (var i = 0; i < this.pinData.pindata[idx].buildupPinSizes; i++) {
                        var depth = {
                            name: (i + this.pinData.pindata[idx].buildupPinStartNumber),
                            size: this.pinData.pindata[idx].buildupPinStartSize + (this.pinData.pindata[idx].buildupPinStepSize * i)
                        };
                        ret.push(depth);
                    }
                }
            }
        }
        return ret;
    };
    PinDataDatabase.prototype.getStackHeight = function (idx) {
        if (this.pinData == null)
            return 0;
        return this.pinData.pindata[idx].stackHeight;
    };
    PinDataDatabase.prototype.getControlShear = function (idx) {
        if (this.pinData == null)
            return 0;
        if (!("controlShear" in this.pinData.pindata[idx]))
            return 0;
        return this.pinData.pindata[idx].controlShear;
    };
    return PinDataDatabase;
}());
/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinDataJson.ts"/>
var PinStackMath;
/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinDataJson.ts"/>
(function (PinStackMath) {
    var buildupPinData = null;
    var bottomPinData = null;
    var controlShear = null;
    function setBuildupPinData(pinData) {
        buildupPinData = pinData;
    }
    PinStackMath.setBuildupPinData = setBuildupPinData;
    function setBottomPinData(pinData) {
        bottomPinData = pinData;
    }
    PinStackMath.setBottomPinData = setBottomPinData;
    function setControlShear(shear) {
        controlShear = shear;
    }
    PinStackMath.setControlShear = setControlShear;
    function getNearestPinNumber(pinData, size) {
        for (var i = 1; i < pinData.length; i++) {
            if (size < (pinData[i].size + pinData[i - 1].size) / 2.0) {
                return pinData[i - 1].name;
            }
        }
        return pinData[pinData.length - 1].name;
    }
    function buildupSizeToNumber(size) {
        if (buildupPinData != null) {
            return getNearestPinNumber(buildupPinData, size);
        }
        else {
            console.error("PinStackMath.buildupSizeToNumber: buildupPinData is NULL!");
            return 0;
        }
    }
    PinStackMath.buildupSizeToNumber = buildupSizeToNumber;
    function bottomSizeToNumber(size) {
        if (bottomPinData != null) {
            return getNearestPinNumber(bottomPinData, size);
        }
        else {
            console.error("PinStackMath.bottomSizeToNumber: bottomPinData is NULL!");
            return 0;
        }
    }
    PinStackMath.bottomSizeToNumber = bottomSizeToNumber;
    function getControlBitting(pins) {
        if (controlShear == null) {
            console.error("PinStackMath.getControlBitting: controlShear is NULL!");
            return Array();
            ;
        }
        var ret = Array();
        for (var i = 0; i < pins.length; i++) {
            var sum = 0;
            for (var j = 1; j < pins[i].length; j++) {
                sum += pins[i][j];
            }
            ret[i] = sum - controlShear;
        }
        return ret;
    }
    PinStackMath.getControlBitting = getControlBitting;
    function getChangeBittings(pins) {
        var ret = Array();
        for (var i = 0; i < pins.length; i++) {
            var sum = 0;
            var n = 0;
            var j = pins[0].length - 1;
            var end = (controlShear === 0) ? 1 : 2;
            for (; j >= end; j--) {
                if (i == 0)
                    ret[n] = Array();
                sum += pins[i][j];
                ret[n][i] = sum;
                n++;
            }
        }
        return ret;
    }
    PinStackMath.getChangeBittings = getChangeBittings;
})(PinStackMath || (PinStackMath = {}));
/// <reference path="./PinDataDatabase.ts"/>
/// <reference path="./PinStackMath.ts"/>
var PinStackDecoder = /** @class */ (function () {
    /**
     * Constructor, grabs elements from the DOM
     */
    function PinStackDecoder() {
        this.pinData = new PinDataDatabase();
        this.csvFileInput = $("#csvFileInput");
        this.pinSpecSelect = $("#pinSpecSelect");
        this.numStacks = $("#numStacks");
        this.numBuildupPins = $("#numBuildupPins");
        this.measUnitSelect = $("#measUnitSelect");
        this.pinningArea = $(".pinningArea");
        this.pinningTable = $(".pinningTable");
        this.controlBittingTable = $(".controlBittingTable");
        this.changeBittingTable = $(".changeBittingTable");
        this.runCalculationsButton = $("#runCalculations");
        this.pinArray = Array();
        this.pinNumbers = Array();
    }
    /**
     * Reads the keys from the database, creates canvas contexts, and attaches
     * event callbacks.
     */
    PinStackDecoder.prototype.init = function () {
        var _this = this;
        this.pinData.readDatabase("pindata.json", function () { return _this.onPinDataUpdate(); });
        this.csvFileInput.on("change", function () { return _this.onCSVFileSelect(); });
        this.pinSpecSelect.on("change", function () { return _this.onPinSpecChange(); });
        this.numStacks.on("change", function () { return _this.onPinNumberChange(); });
        this.numBuildupPins.on("change", function () { return _this.onPinNumberChange(); });
        this.runCalculationsButton.on("click", function () { return _this.runCalculations(); });
    };
    PinStackDecoder.prototype.onPinDataUpdate = function () {
        var _this = this;
        var specs = this.pinData.getNames();
        specs.forEach(function (val, idx) {
            _this.pinSpecSelect.append($("<option/>", {
                value: idx
            }).text(val));
        });
        this.onPinSpecChange();
    };
    PinStackDecoder.prototype.onPinSpecChange = function () {
        var idx = this.pinSpecSelect.val();
        if (idx !== undefined) {
            var bottom = this.pinData.getBottomSizes(+idx);
            var buildup = this.pinData.getBuildupSizes(+idx);
            var control = this.pinData.getControlShear(+idx);
            PinStackMath.setBottomPinData(bottom);
            PinStackMath.setBuildupPinData(buildup);
            PinStackMath.setControlShear(control);
        }
    };
    PinStackDecoder.prototype.onPinNumberChange = function () {
        this.pinningArea.empty();
        this.pinArray = Array();
        var stacks = this.numStacks.val();
        var buildups = this.numBuildupPins.val();
        if (stacks !== undefined && buildups !== undefined) {
            for (var i = 0; i < 2 + +buildups; i++) {
                for (var j = 0; j < +stacks; j++) {
                    if (i == 0) {
                        this.pinArray[j] = Array();
                    }
                    var elem = $("<input size='6' maxlength='6'/>").addClass("pinInput");
                    this.pinArray[j][i] = elem;
                    this.pinningArea.append(elem);
                }
                this.pinningArea.append("<br/>");
            }
        }
    };
    PinStackDecoder.prototype.runCalculations = function () {
        this.pinNumbers = Array();
        var scaleFactor = this.measUnitSelect.val();
        if (scaleFactor === undefined)
            return;
        for (var i = 0; i < this.pinArray.length; i++) {
            this.pinNumbers[i] = Array();
            for (var j = 0; j < this.pinArray[i].length; j++) {
                var pinLength = this.pinArray[i][j].val();
                if (pinLength !== undefined) {
                    // TODO: Unit conversion, if necessary
                    if (j < this.pinArray[i].length - 1) { // Build-up/driver pin
                        var pin = PinStackMath.buildupSizeToNumber(+pinLength * +scaleFactor);
                        this.pinNumbers[i][j] = pin;
                    }
                    else { // Bottom pin
                        var pin = PinStackMath.bottomSizeToNumber(+pinLength * +scaleFactor);
                        this.pinNumbers[i][j] = pin;
                    }
                }
            }
        }
        this.pinningTable.empty();
        for (var i = 0; i < this.pinNumbers[0].length; i++) {
            var row = $("<tr/>");
            for (var j = 0; j < this.pinNumbers.length; j++) {
                row.append($("<td/>").text(this.pinNumbers[j][i]));
            }
            this.pinningTable.append(row);
        }
        var control = PinStackMath.getControlBitting(this.pinNumbers);
        var changes = PinStackMath.getChangeBittings(this.pinNumbers);
        this.controlBittingTable.empty();
        this.changeBittingTable.empty();
        var controlRow = $("<tr/>");
        for (var i = 0; i < control.length; i++) {
            controlRow.append($("<td/>").text(control[i]));
        }
        this.controlBittingTable.append(controlRow);
        for (var i = 0; i < changes.length; i++) {
            var row = $("<tr/>");
            for (var j = 0; j < changes[i].length; j++) {
                row.append($("<td/>").text(changes[i][j]));
            }
            this.changeBittingTable.append(row);
        }
    };
    PinStackDecoder.prototype.loadCSV = function (csv) {
        var array = Array();
        csv.split(/(?:\r\n|\r|\n)/g).forEach(function (val, row) {
            if (val.length < 1)
                return;
            array[row] = Array();
            val.split(",").forEach(function (val, col) {
                array[row][col] = +val;
            });
        });
        this.numStacks.val(array[0].length);
        this.numBuildupPins.val(array.length - 2);
        this.onPinNumberChange();
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                this.pinArray[j][i].val(array[i][j]);
            }
        }
    };
    PinStackDecoder.prototype.onCSVFileSelect = function () {
        var _this = this;
        var fr = new FileReader();
        fr.onload = function () {
            _this.loadCSV(fr.result);
        };
        fr.readAsText(this.csvFileInput.prop("files")[0]);
    };
    return PinStackDecoder;
}());
/// <reference path="./PinStackDecoder.ts"/>
var decoder;
$("document").ready(function () {
    decoder = new PinStackDecoder();
    console.info("Created PinStackDecoder");
    decoder.init();
    console.info("Initialized PinStackDecoder");
});
