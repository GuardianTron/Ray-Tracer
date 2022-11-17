"use strict";

export default class Vector2D{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    
    get x(){
        return this._x;
    }

    set x(x){
        this._length = NaN;
        this._x = x;
    }

    get y(){
        return this._y;
    }

    get length(){
        if(isNaN(this._length)){
            this._length = Math.sqrt(this.x * this. x + this.y * this.y);
        }
        return this._length;
    }

    

    set y(y){
        this._length = NaN;
        this._y = y;
    }

    dotProduct(vec2){
        return this.x * vec2.x + this.y * vec2.y;
    }

    cosineBetween(vec2){
        return this.dotProduct(vec2)/(this.length * vec2.length);
    }

    normalize(){
        const length= this.length;
        this.x /= length;
        this.y /= length;
        return this;
    }

    scale(scalar){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    add(vec2){
        const newX = this.x + vec2.x;
        const newY = this.y + vec2.y;
        return new Vector2D(newX,newY);
    }

    subtract(vec2){
        const newX = this.x - vec2.x;
        const newY = this.y - vec2.y;
        return new Vector2D(newX,newY);
    }

    getPerp(){
        return new Vector2D(this.y,this.x * -1);
    }

    copy(){
        return new Vector2D(this.x,this.y);
    }




}

class Ray{

    constructor(origin,direction){
        this.origin = origin;
        this.direction = direction;
    }

    get origin(){
        return this._origin;
    }

    set origin(origin){
        this._origin = origin.copy();
    }

    get direction(){
        return this._direction.copy();
    }

    set direction(direction){
        this._direction = direction.copy().normalize();
    }

    getEndPoint(scalar){
        return this._origin.add(this.direction.scale(scalar));
    }

    getIntersectionParameter(ray2){
        const intersectMatrix = Matrix2D.fromVectors(this._direction,ray2.direction.scale(-1));
        
        if(!intersectMatrix.determinant) return NaN;
        
        intersectMatrix.invert();
        const originDiff = ray2.origin.subtract(this.origin);
        const paramVector = intersectMatrix.multiplyVector(originDiff);
        return paramVector.x;

    }



}

class LineSegment{

    constructor(ray,length){
        this.ray = ray;
        this.length = length;
    }
     
    get ray(){
        return this._ray;
    }

    set ray(ray){
        this._end = null;
        this._ray = ray;
    }

    get start(){
        return this.ray.origin;
    }

    set start(start){
        this.ray.origin =start;
        this._end = null; 
    }

    get end(){
        if(!this._end){
            this._end = this.ray.getEndPoint(this.length);
        }
        return this._end;
    }

    set end(end){
        this._end = null;
        let newDirection = end.subtract(this.ray.origin);
        this.length = newDirection.length;
        this.ray.direction = newDirection;
    }

    get length(){
        return this._length;
    }

    set length(length){
        this._end = null;
        this._length = length;
    }
}

class Matrix2D{

    constructor(a,b,c,d){
        this.a = a;
        this.b = b;
        this.c = c; 
        this.d = d;
    }

    get determinant(){
        return this.a*this.d - this.b*this.c;
    }

    scale(scalar){
        this.a*=scalar;
        this.b*=scalar;
        this.c*=scalar;
        this.d*=scalar;
        return this;
    }

    copy(){
        return new Matrix2D(this.a,this.b,this.c,this.d);
    }
    
    invert(){
        const determinant = this.determinant;
        if(!determinant) throw new Error("Matrix is not invertible.");

        const newD = this.a;
        this.a = this.d;
        this.b *= -1;
        this.c *= -1;
        this.d = newD;

        return this.scale(1/determinant);
        


    }

    multiplyVector(vec){
        const x = this.a * vec.x + this.b * vec.y;
        const y = this.c * vec.x + this.d * vec.y;
        return new Vector2D(x,y);
    }


}

Matrix2D.fromVectors = function(vec1,vec2){
    return new Matrix2D(vec1.x,vec2.x,vec1.y,vec2.y);
}

export {Vector2D,Ray,Matrix2D, LineSegment};