"use strict";
import { Shape, ShapeContainer } from "./shapes.js";
import { Vector3D } from "./vector.js";
import { Color } from "./color.js";
import { Light,OccludableLight} from "./lighting.js";


/**
 * Represents the camera
 * Provides methods for tracing individual rays within the 
 * Camera's space.
 */

export default class Camera{

    /**
     * 
     * @param {Vector3D} origin 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} distance 
     */
    constructor(origin, width,height,distance){
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.distance = distance;
        this.enableAmbient = true;
        this.enableDiffuse = true;
        this.enableSpecular = true;
        this.enableShadows = true;
        this.recursionDepth = 3;
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

    get enableAmbient(){
        return this._enableAmbient;
    }

    set enableAmbient(value){
        this._enableAmbient = Boolean(value);
    }

    get enableDiffuse(){
        return this._enableDiffuse;
    }

    set enableDiffuse(value){
        this._enableDiffuse = Boolean(value);
    }

    get enableSpecular(){
        return this._enableSpecular;
    }

    set enableSpecular(value){
        this._enableSpecular = Boolean(value);
    }

    get enableShadows(){
        return this._enableShadows;
    }

    set enableShadows(value){
        this._enableShadows = Boolean(value);
    }

    get recursionDepth(){
        return this._recursionDepth;
    }

    set recursionDepth(depth){
        if(isNaN(depth)){
            throw new TypeError("Recursion depth must be a number.");
        }
        if(depth < 0){
            throw new RangeError("Recursion depth must be zero or greater.");
        }
        this._recursionDepth = depth;
    }

    traceRay(directionRay,shapeContainer, lights=[],recursionDepth=3){
        return this._traceRay(directionRay,shapeContainer, lights,this.origin,recursionDepth,1);
    }

    /**
     * Traces ray in camera space
     * @param {Vector3D} directionRay -- Direction ray in camera space. 
     * @param {Array[Shape]} shapes -- An array of shapes 
     * @returns Color
     */
    _traceRay(directionRay,shapeContainer,lights=[],rayStart = null,recursionDepth = 3,tEpsilon=1){
        const {tMin, intersectedShape} = shapeContainer.closestIntersectionWithRay(rayStart,directionRay,tEpsilon);
 
        if(intersectedShape){
            //apply lighting
            const intersectionPoint = rayStart.add(directionRay.multiplyByScalar(tMin));
            let intensity = 0;
            const viewDirection = directionRay.multiplyByScalar(1);
            const normal = intersectedShape.getNormal(intersectionPoint);

            for(const light of lights){
                if(light instanceof OccludableLight){
                    if(this._enableShadows && light.testForShadow(intersectionPoint,shapeContainer)) continue;

                    const diffuseMultiplier =  intersectedShape.diffuse.evaluate(light,intersectionPoint,normal);
                    const specularMultiplier = intersectedShape.specular.evaluate(light,intersectionPoint,normal,viewDirection);

                    if(this.enableDiffuse) intensity += light.intensity * diffuseMultiplier;
                    if(this.enableSpecular) intensity += light.intensity * specularMultiplier;
                    

                }
                else if(this.enableAmbient){
                    intensity += light.intensity;
                }
                

            }
            
            let localColor =  intersectedShape.color.scaleByIntensity(intensity);
            let retColor = localColor;
            if(intersectedShape.material.reflectance > 0 && recursionDepth > 0){
                const reflectedVector = intersectedShape.material.getReflectedVector(viewDirection,normal);
                let reflectedColor = this._traceRay(reflectedVector,shapeContainer,lights,intersectionPoint,recursionDepth - 1,.001);
                const reflectance = intersectedShape.material.reflectance;
                localColor = localColor.scaleByIntensity(1-reflectance);
                reflectedColor = reflectedColor.scaleByIntensity(reflectance);
                retColor = localColor.add(reflectedColor);
            
            }
            return retColor;

        }
        return new Color(0,0,0);

        }

    

    /**
     * Project pixel from canvas into camera space.
     * @param { Number } x -- X in canvas coordinates 
     * @param { Number } y -- Y in canvas coordinates
     * @param { Number } canvasWidth 
     * @param { Number } canvasHeight 
     * @returns Vector3D
     */

    canvasToViewPort = (x,y,canvasWidth,canvasHeight) => {
        /* x and y use screen coordinates.  First convert to cartesian 
         * coordinates with origin at center and y increasing upward instead
         * of downward.
         * Note: Resultant vector is in camera space, not world space.
         */

        x = x - canvasWidth/2;
        y = canvasHeight/2 - y;
        return new Vector3D(x*this.viewWidth/canvasWidth, y*this.viewHeight/canvasHeight,this.distance);

    }

    /**
     * Condensed method that converts canvas points to camera space
     * and then traces the ray.
     * @param { Number } x -- X in canvas coordinates 
     * @param { Number } y -- Y in canvas coordinates
     * @param { Number } canvasWidth 
     * @param { Number } canvasHeight 
     * @param { Array[Shapes}  shapes 
     * @returns Color
     */
    getPixelColor = (x,y,canvasWidth,canvasHeight,shapeContainer,lights=[])=>{
        const viewportRay = this.canvasToViewPort(x,y,canvasWidth,canvasHeight);
        return this.traceRay(viewportRay,shapeContainer,lights,this.recursionDepth);
    }




}

export { Camera };