"use strict";

export default class Vector3D{

    constructor(x=0,y=0,z=0){
        this._vecAsArray = Array(3);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get x(){
        return this._vecAsArray[0];
    }

    set x(x){
        if(isNaN(x)){
            throw new TypeError('X must be type Number.');
        }
        this._vecAsArray[0] = x;
    }

    get y(){
        return this._vecAsArray[1];
    }


    set y(y){
        if(isNaN(y)){
            throw new TypeError('y must be type Number.');
        }
        this._vecAsArray[1] = y;
    }

    get z(){
        return this._vecAsArray[2];
    }

    set z(z){
        if(isNaN(z)){
            throw new TypeError('z must be type Number.');
        }
        this._vecAsArray[2] = z;
    }

    _vectorTypeOrError(vec2){
        if(!(vec2 instanceof Vector3D)){
            throw new TypeError("Parameter must be of type Vector3D.");
        }

    }

    /**
     * Returns an new array representation of the vector.
     * @returns Array 
     */

    toArray(){
        return [this.x,this.y,this.z];
    }

    /**
     * Calculates the dot product of two vectors.
     * @param {Vector3D} vec2 
     * @returns Number
     */

    dotProduct(vec2){
        this._vectorTypeOrError(vec2);
        
        const vec2Array = vec2.toArray();
        let dp = 0;
        for(let i = 0; i < 3; i++){
            dp += this._vecAsArray[i] * vec2Array[i];
        }

        return dp;
    }
    
    /**
     * Calculates the length of a vector
     * @returns Number
     */
    length(){
        let dp = this.dotProduct(this);
        return Math.sqrt(dp);
    }


    /**
     * Adds second Vector3D to current instance and returns sum as a new Vector3D
     * @param {Vector3D} vec2 
     * @returns Vector3D
     */    
    add(vec2){
        this._vectorTypeOrError(vec2);
        const resultArray = [];
        const vec2Array = vec2.toArray();
        for(let i = 0; i < 3; i++){
            resultArray.push(this._vecAsArray[i] + vec2Array[i]);
        }
        return new Vector3D(...resultArray);

    }

    /**
     * Multiplies the vector by a scalar and return result as new Vector3D
     * @param {*} scalar 
     * @returns 
     */
    multiplyByScalar(scalar){
        if(isNaN(scalar)){
            throw new TypeError("Scalars must be of type number.");
        }
        const resultArray = [];
        for(let i = 0; i< 3; i++){
           resultArray.push(this._vecAsArray * scalar);
        }

        return new Vector3D(...resultArray);
    }

    /**
     * Subtract parameter vector from self and returns result as new Vector.
     * @param {Vector3D} vec2 
     * @returns Vector3D
     */

    subtract(vec2){
        this._vectorTypeOrError(vec2);
        const negVec2 = vec2.multiplyByScalar(-1);
        return this.add(negVec2);
    }
    
}