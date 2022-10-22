"use strict";
import { Vector3D } from "./vector.js";


export default class Light{

    constructor(intensity){


        this.baseIntensity = intensity;

    }

    get baseIntensity(){
        return this._intensity;
    }

    set baseIntensity(intensity){
        if(isNaN(intensity)){
            throw new TypeError("Intensity values must be a number.");
        }
        if(intensity < 0 || intensity > 1){
            throw new RangeError("Intensity values must be between zero and one inclusive.");
        }
        this._intensity = intensity;
    }

    getIntensity(surfaceNormal,intersectionPoint){
        if(! (surfaceNormal instanceof Vector3D)){
            throw new TypeError("Surface Normals must be an instance of Vector3D");
        }
        if(! (intersectionPoint instanceof Vector3D)){
            throw new TypeError("Intersections points for rays must be an instance of Vector3D");
        }
        

        return this.baseIntensity;
    }


}

class PointLight extends Light{
    constructor(intensity,position){
        super(intensity);
        this.position = position;

    }

    get position(){
        return this._position;
    }

    set position(position){
        if(!(position instanceof Vector3D)){
            throw new TypeError("Positions must be instances of Vector3D");
        }

        this._position = position;
    }

    getIntensity(surfaceNormal,intersectionPoint){
        let intensity = super.getIntensity(surfaceNormal,intersectionPoint);
        const lightDirection = this.position.subtract(intersectionPoint);
        intensity *= lightDirection.cosineBetween(surfaceNormal);
        return intensity;


    }
}

class DirectionalLight extends Light{

    constructor(intensity,direction){
        super(intensity);
        this.direction = direction;
    }

    get direction(){
        return this._direction;
    }

    set direction(direction){
        if(!(direction instanceof Vector3D)){
            throw new TypeError("Direction must be an instance of Vector3D");
        }
        this._direction = direction;
    }

    getIntensity(surfaceNormal,intersectionPoint){
        let intensity = super.getIntensity(surfaceNormal,intersectionPoint);
        intensity *= this.direction.cosineBetween(surfaceNormal);
        console.log(intensity);
        return intensity;
    }
}

export {Light,PointLight,DirectionalLight};