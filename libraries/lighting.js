"use strict";
import { Vector3D } from "./vector.js";
import { Shape } from "./shapes.js";
const EPSILON = 0.001;

/**
 * Base class for light. 
 * Represent ambient lighting.
 */
export default class Light{

    /**
     * 
     * @param {Number} intensity - Light's intensity value.
     */

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

    testForShadow(intersectionPoint,shapes=[]){
        return false;
    }



}

/** 
 * Base class for lights that can cast shadows
 */

class OccludableLight extends Light{

    /**
     * Tests if an object is blocking the light.
     * @param {Vector3D} intersectionPoint 
     * @param {Shape[]} shapes 
     * @returns Boolean
     */

    testForShadow(intersectionPoint,shapes=[]){
        return false;
    }
}


/**
 * Represents a points light.
 */

class PointLight extends OccludableLight{

    /**
     * 
     * @param {Number} intensity - Light's intensity value.
     * @param {Vector3D} position - Position of light in scene space.
     */
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

    /**
     * Calculates the direction vector of a light 
     * ray from the light to the surface.
     * @param {Vector3D} endPoint 
     * @returns Vector3D
     */
    getDirection(endPoint){
        if(!(endPoint instanceof Vector3D)){
            throw new TypeError("Endpoint must be an instance of Vector3D");
        }
        return this.position.subtract(endPoint);


    }

    testForShadow(intersectionPoint,shapes=[]){
        let intersectsShape = false;
        const direction = this.getDirection(intersectionPoint);
        for( const shape of shapes){
            const intersectionParams = shape.intersectsRayAt(intersectionPoint,direction);
            for(const intersection of intersectionParams){
                
                if(intersection >= EPSILON && intersection < 1){
                        
                    intersectsShape = true;
                    break;
                }
            }
            
        }
        return intersectsShape;
    }

}

/**
 * Implements directional lighting.
 */

class DirectionalLight extends OccludableLight{

    /**
     * 
     * @param {Number} intensity - Light's intensity value 
     * @param {Vector3D} direction - Orientation of light rays.
     */
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


    testForShadow(intersectionPoint,shapes=[]){

        let intersectsShape = false;

        for(const shape of shapes){
            const intersectionParams = shape.intersectsRayAt(intersectionPoint,this.direction);
            for( const intersection of intersectionParams){

                if(intersection >= EPSILON && intersection < Infinity){
                    intersectsShape = true;
                    break;
                }
            }
        }
        return intersectsShape;
    }

}

/**
 * Base class for shaders.
 */

class RTShaderBase{

    /**
     * Calcutes shading.
     * @param {Light} light - Light instance 
     * @param {Vector3D} intersectionPoint - Point in scene space light hits surface.
     * @param {Vector3D} normal - Surface Normal 
     * @param {Vector3D} viewDirection - Direction from intersection to camera.
     * @returns Number -Intensity value.
     */


    evaluate(light,intersectionPoint,normal,viewDirection=null){
        return 1;
    }

    /**
     * Abstracts obtaining light direction from different light sources
     * @param {Light} light 
     * @param {Vector3D} intersectionPoint - Point where light strikes surface. 
     * @returns 
     */

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

/**
 * Basic Diffuse Shader
 */

class BookDiffuseShader extends RTShaderBase{

    evaluate(light,intersectionPoint,normal,viewDirection=null){
        let direction = this._getLightDirection(light,intersectionPoint);

        if(!direction){
            return 1;
        }

        return Math.max(normal.cosineBetween(direction),0);

        

    }
}

/**
 * Basic Specular shader for highlights.
 * 
 */

class BookSpecularShader extends RTShaderBase{

    /**
     * 
     * @param {Number} exponent - Determines narrowness of highlight with higher values generating more concentrated highlights. 
     */
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

        //make sure not behind surface
        if(lightDirection.dotProduct(normal) <= 0) return 0;
        
        
        const reflection = lightDirection.subtract(normal.multiplyByScalar(2*normal.dotProduct(lightDirection)));
        const angle = Math.max(0,reflection.cosineBetween(viewDirection));
        return Math.pow(angle,this.exponent);
        
        

    }
}


export {Light,OccludableLight,PointLight,DirectionalLight,RTShaderBase,BookDiffuseShader, BookSpecularShader};