 "use strict";

import Vector3D from "./vector.js";
import Color from "./color.js";
import { RTShaderBase } from "./lighting.js";

 class Shape{

    constructor(diffuseShader=null,specularShader=null){
        if(!diffuseShader){
            diffuseShader = new RTShaderBase();
        }

        if(!specularShader){
            specularShader = new RTShaderBase();
        }
        this.diffuse = diffuseShader;
        this.specular = specularShader;
    }

    get diffuse(){
        return this._diffuseShader;
    }

    set diffuse(shader){
        if(! (shader instanceof RTShaderBase)){
            throw new TypeError("Shaders must be an of RTShaderBase");
        }
        this._diffuseShader = shader;
    }

    get specular(){
        return this._specularShader;
    }

    set specular(shader){
        if(!(shader instanceof RTShaderBase)){
            throw new TypeError("Shaders must be an instance of RTShaderBase");
        }
        this._specularShader = shader;
    }

    /**
     * Calculates the parametric intersectons with the ray being cast.
     * @param {Vector3D} originPoint 
     * @param {Vector3D} rayVector 
     * @returns Array
     */
    intersectsRayAt(originPoint,rayVector){
        if(! (originPoint instanceof Vector3D)){
            throw new TypeError("Origin Point must be instance of Vector3D");
        }

        if( ! (rayVector instanceof Vector3D)){
            throw new TypeError("Ray Vector must be instance of Vector3D");
        }
        return [];
    }
 }

 class Sphere extends Shape{

    /**
     * 
     * @param {Vector3D} center -- The object's center.
     * @param {Number} radius  -- The object's radius.
     * @param {Color} color -- The object's color.
     */

    constructor(center,radius,color,diffuseShader = null, specularShader = null){
        super(diffuseShader,specularShader);
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
    
    get color(){
        return this._color;
    }

    set color(color){
        if(!(color instanceof Color)){
            throw TypeError("Colors must be instance of Color.");
        }
        this._color = color;
    }
    get center(){
        return this._center;
    }

    set center(vector){
        if(! (vector instanceof Vector3D)){
            throw new TypeError("Center must be an instance of Vector3D");
        }
        this._center = vector;
    }

    get radius(){
        return this._radius;
    }

    set radius(radius){
        if(isNaN(radius)){
            throw new TypeError("Radius must be of type Number");
        }
        this._radius = radius;
    }

    getNormal(surfacePoint){
        if(!(surfacePoint instanceof Vector3D)){
            throw new TypeError("Surface point must be an instance of Vector3D");
        }
        return surfacePoint.subtract(this.center).getUnit();
    }

    intersectsRayAt(originPoint,vector){
        super.intersectsRayAt(originPoint,vector);
        const directionVector = vector.subtract(originPoint);
        const centerToOriginVector = originPoint.subtract(this.center);
        //quadratic forumula constants for intersection.
        const a = directionVector.dotProduct(directionVector);
        const b = 2 * centerToOriginVector.dotProduct(directionVector);
        const c = centerToOriginVector.dotProduct(centerToOriginVector) - Math.pow(this.radius,2);

        const disc = b*b - 4*a*c;

        // no intersection
        if(disc < 0){
            return [Infinity,Infinity];
        }

        //intersections
        const discSQRT = Math.sqrt(disc);
        const t1 = (-b - discSQRT)/(2*a);
        const t2 = (-b + discSQRT)/(2*a);
        return [t1,t2];



    }

    
 }
 export {Shape,Sphere};