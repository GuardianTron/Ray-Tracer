"use strict";

export class Color{

    /**
     * 
     * @param {Number} r - Red channel value 0-255
     * @param {Number} g - Green channel value 0-255
     * @param {Number} b - Blue channel value 0-255
     */

    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    _testValue(value){
        if(isNaN(value)){
            throw new TypeError("Values must be of type number.");
        }

        if(value < 0 || value > 255){
            throw RangeError("Valid values must be in the range 0 to 255 inclusive.");
        }

        if(value != Math.floor(value)){
            throw TypeError("Values must be positive integers.");
        }
    }


    get r(){
        return this._r;
    }

    set r(r){
        this._testValue(r);
        this._r = r;
    }

    get g(){
        return this._g;
    }

    set g(g){
        this._testValue(g);
        this._g = g;
    }

    get b(){
        return this._b;
    }

    set b(b){
        this._testValue(b);
        this._b = b;
    }

    /**
     * Scales all channels by the given intensity.
     * @param {Number} intensity 
     * @returns Color
     */

    scaleByIntensity(intensity){
        const r = this._scaleChannelByIntensity(intensity,this.r);
        const g = this._scaleChannelByIntensity(intensity,this.g);
        const b = this._scaleChannelByIntensity(intensity,this.b);
        return new Color(r,g,b);
        
    }

    /**
     * Ensures that scaling produces an integer between 0 and 255
     * @param {Number} intensity 
     * @param {Number} channel 
     * @returns 
     */

    _scaleChannelByIntensity(intensity,channel){
        let scaled = intensity * channel;
        //ensure channel is integer between 0 and 255;
        scaled = Math.max(0,scaled);
        scaled = Math.min(255,scaled);
        return Math.round(scaled);
    }
}

export default Color;