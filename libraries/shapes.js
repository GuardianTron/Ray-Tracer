 "use strict";

import Vector3D from "./vector.js";
import Color from "./color.js";
import { RTShaderBase, BaseMaterial } from "./lighting.js";

 class Shape{

    constructor(diffuseShader=null,specularShader=null,material=null){
        if(!diffuseShader){
            diffuseShader = new RTShaderBase();
        }

        if(!specularShader){
            specularShader = new RTShaderBase();
        }

        if(!material){
            material = new BaseMaterial(0);
        }
        this.diffuse = diffuseShader;
        this.specular = specularShader;
        this.material = material;
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

    get material(){
        return this._material;
    }

    set material(material){
        if(!(material instanceof BaseMaterial)){
            throw new TypeError("Materials must be an instace of BaseMaterial");
        }
        this._material = material;
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

    constructor(center,radius,color,diffuseShader = null, specularShader = null, material=null){
        super(diffuseShader,specularShader,material);
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

    /**
     * Returns surface normal.
     * @param {Vector3D} surfacePoint - Intersection point in scene space. 
     * @returns Vector3D
     */
    getNormal(surfacePoint){
        if(!(surfacePoint instanceof Vector3D)){
            throw new TypeError("Surface point must be an instance of Vector3D");
        }
        return surfacePoint.subtract(this.center).normalize();
    }

    /**
     * Calulates shape's intersection point
     * @param {Vector3D} originPoint - Start of ray in scene space. 
     * @param {Vector3D} directionVector - Ray's direction vector. 
     * @returns Vector3D - Intersection point in scene space.
     */

    intersectsRayAt(originPoint,directionVector){
        super.intersectsRayAt(originPoint,directionVector);

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

 class ShapeContainer{

    constructor(){
        this._shapes = [];
    }

    addShape(shape){
        if(!(shape instanceof Shape)) throw new TypeError("Only objects of type Shape may be added.");
        this._shapes.push(shape);
    }

    clear(){
        this._shapes = [];
    }

    closestIntersectionWithRay(origin,direction,tEpsilon=0.001){
        let tMin = Infinity;
        let closestShape = null;
        for(const shape of this._shapes){
            const ts = shape.intersectsRayAt(origin,direction);
            for(const t of ts){
                if(t >= tEpsilon && t < tMin){
                    tMin = t;
                    closestShape = shape;
                }
            }
        }
        return {tMin: tMin, intersectedShape: closestShape};
    }

    testRayIntersection(origin,direction,tMax,tEpsilon = 0.001){

        for(const shape of this._shapes){
            const ts = shape.intersectsRayAt(origin,direction);
            for(const t of ts){
                if(t > tEpsilon && t < tMax) return true;
            }
        }
        return false;
    }

    [Symbol.iterator](){
        let i = 0;
        return {
            next: ()=>{
                return {
                    value: this._shapes[i++],
                    done: (i >= this._shapes.length)
                }
            }
        }
    }

 }
 export {Shape,Sphere, ShapeContainer};