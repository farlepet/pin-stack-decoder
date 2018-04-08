/// <reference path="./PinStackDecoder.ts"/>

var decoder : PinStackDecoder;

$("document").ready(() => {
    decoder = new PinStackDecoder();
    console.info("Created PinStackDecoder");

    decoder.init();
    console.info("Initialized PinStackDecoder");
})