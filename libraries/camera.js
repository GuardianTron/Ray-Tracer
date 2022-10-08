"use strict";
import { Shape } from "./shapes.js";
import { Vector3D } from "./vector.js";
import { Color } from "./color.js";

export default class Camera{

    constructor(origin, width,height,distance){
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.distance = distance;
    }

    get origin(){
        return this._origin;
    }

    set origin(origin){
        if(!(origin instanceof Vector3D)){
            throw new TypeError("Origin must be an instance of Vector3D");
        }
        this._origin = origin;
    }

    get viewWidth(){
        return this._width;
    }

    set viewWidth(width){
        if(isNaN(width)){
            throw new TypeError("Width must be a Number");
        }
        this._width = width;
    }

    get viewHeight(){
        return this._height;
    }

    set viewHeight(height){
        if(isNaN(height)){
            throw new TypeError('Height must be a Number');
        }
        this._height = height;
    }

    get distance(){
        return this._distance;
    }

    set distance(distance){
        if(isNaN(distance)){
            console.log(typeof distance,distance);
            throw new TypeError('Distance must be a number');
        }
        this._distance = distance;
    }
}

export { Camera };