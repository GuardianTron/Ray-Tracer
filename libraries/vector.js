"use strict";

export class Vector3D{

    constructor(x=0,y=0,z=0){

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get x(){
        return this._x;
    }

    set x(x){
        if(isNaN(x)){
            throw new TypeError('X must be type Number.');
        }
        this._length = NaN;
        this._x = x;
    }

    get y(){
        return this._y;
    }


    set y(y){
        if(isNaN(y)){
            throw new TypeError('y must be type Number.');
        }
        this._length = NaN;
        this._y = y;
    }

    get z(){
        return this._z;
    }

    set z(z){
        if(isNaN(z)){
            throw new TypeError('z must be type Number.');
        }
        this._length = NaN;
        this._z = z;
    }

    _vectorTypeOrError(vec2){
        if(!(vec2 instanceof Vector3D)){
            throw new TypeError(`Parameter must be of type Vector3D. ${typeof vec2}`);
        }

    
    }

    _copyVectorToSelf(vec2){
        this.x = vec2.x;
        this.y = vec2.y;
        this.z = vec2.z;
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
        
        let dp = this.x * vec2.x + this.y * vec2.y + this.z * vec2.z;

        return dp;
    }
    
    /**
     * Calculates the length of a vector
     * @returns Number
     */
    length(){
        if(isNaN(this._length)){
            this._length = Math.sqrt(this.dotProduct(this));
        }
        return this._length;

    }

    cosineBetween(vec2){
        this._vectorTypeOrError(vec2);
        return this.dotProduct(vec2)/(this.length()*vec2.length());
    }

    getUnit(){
        return this.multiplyByScalar(1/this.length());
    }


    /**
     * Adds second Vector3D to current instance and returns sum as a new Vector3D
     * @param {Vector3D} vec2 
     * @returns Vector3D
     */    
    add(vec2){
        this._vectorTypeOrError(vec2);
        const x = this.x + vec2.x;
        const y = this.y + vec2.y;
        const z = this.z + vec2.z;
        return new Vector3D(x,y,z);
    
    }

    normalize(){
        const length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
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
        const x = this.x * scalar;
        const y = this.y * scalar;
        const z = this.z * scalar;
        return new Vector3D(x,y,z);
    }

    /**
     * Subtract parameter vector from self and returns result as new Vector.
     * @param {Vector3D} vec2 
     * @returns Vector3D
     */

    subtract(vec2){
        this._vectorTypeOrError(vec2);
        const x = this.x - vec2.x;
        const y = this.y - vec2.y;
        const z = this.z - vec2.z;
        return new Vector3D(x,y,z);
    }



    /**
     * Adds second vector to self and stores results to self.
     * @param {Vector3D} vec2 
     */
    addSelf(vec2){
       this._copyVectorToSelf(this.add(vec2)); 
    }

    /**
     * Multiplies the vector by scalar and store results to self.
     * @param {Number} scalar 
     */

    multiplySelfByScalar(scalar){
        this._copyVectorToSelf(this.multiplyByScalar(scalar));
        return this;
    }

    /**
     * Subtracts second vector from self and stores results to self.
     * @param {Vector3D} vec2 
     */

    subtractSelf(vec2){
        this._copyVectorToSelf(this.subtract(vec2));
        return this;
    }
    
}
export default Vector3D;