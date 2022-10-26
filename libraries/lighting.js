"use strict";
import { Vector3D } from "./vector.js";
import { Shape } from "./shapes.js";


export default class Light{

    constructor(intensity){


        this.intensity = intensity;

    }

    get intensity(){
        return this._intensity;
    }

    set intensity(intensity){
        if(isNaN(intensity)){
            throw new TypeError("Intensity values must be a number.");
        }
        if(intensity < 0 || intensity > 1){
            throw new RangeError("Intensity values must be between zero and one inclusive.");
        }
        this._intensity = intensity;
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

    getDirection(endPoint){
        if(!(endPoint instanceof Vector3D)){
            throw new TypeError("Endpoint must be an instance of Vector3D");
        }
        return this.position.subtract(endPoint);


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

}

class RTShaderBase{



    evaluate(light,intersectionPoint,normal,viewDirection=null){
        return 1;
    }

    _getLightDirection(light,intersectionPoint){
        let direction = null;
        if(light instanceof PointLight){
            direction = light.getDirection(intersectionPoint);
        }
        else if (light instanceof DirectionalLight){
            direction = light.direction;
        }
        return direction;

    }

    

}

class BookDiffuseShader extends RTShaderBase{

    evaluate(light,intersectionPoint,normal,viewDirection=null){
        let direction = this._getLightDirection(light,intersectionPoint);

        if(!direction){
            return 1;
        }

        return Math.max(normal.cosineBetween(direction),0);

        

    }
}

class BookSpecularShader extends RTShaderBase{

    constructor(exponent=1){
        super();
        this.exponent = exponent;
    }

    get exponent(){
        return this._exponent;
    }

    set exponent(exp){
        if(isNaN(exp)){
            throw new TypeError("Exponents must be a number.");
        }
        this._exponent = exp;
    }

    evaluate(light,intersectionPoint,normal,viewDirection){
        let lightDirection = this._getLightDirection(light,intersectionPoint);
        
        //ambient lighting. Doesn't affect specular intensity
        if(!lightDirection) return 0;
        
        
        const reflection = lightDirection.subtract(normal.multiplyByScalar(2*normal.dotProduct(lightDirection)));
        const angle = Math.max(0,reflection.cosineBetween(viewDirection));
        return Math.pow(angle,this.exponent);
        
        

    }
}


export {Light,PointLight,DirectionalLight,RTShaderBase,BookDiffuseShader, BookSpecularShader};