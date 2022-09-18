"use strict";

class Color{

    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    _testValue(value){
        if(isNan(value)){
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
}