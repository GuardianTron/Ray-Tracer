"use strict";
import { Shape } from "./shapes.js";
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

    /**
     * Traces ray in camera space
     * @param {Vector3D} directionRay -- Direction ray in camera space. 
     * @param {Array[Shape]} shapes -- An array of shapes 
     * @returns Color
     */
    traceRay(directionRay,shapes=[],lights=[],rayStart = null,recursionDepth = 3,tEpsilon=1){
        if(!rayStart) rayStart = this.origin;
        const {tMin, intersectedShape} = this.testIntersection(directionRay,rayStart,shapes,tEpsilon);
        if(intersectedShape){
            //apply lighting
            const intersectionPoint = rayStart.add(directionRay.multiplyByScalar(tMin));
            let intensity = 0;
            const viewDirection = directionRay.multiplyByScalar(1);
            const normal = intersectedShape.getNormal(intersectionPoint);

            for(const light of lights){
                if(light instanceof OccludableLight){
                    if(this._enableShadows && light.testForShadow(intersectionPoint,shapes)) continue;

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
                let reflectedColor = this.traceRay(reflectedVector,shapes,lights,intersectionPoint,recursionDepth - 1,.001);
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
     * Performs test for intersection between ray and shapes
     * @param {Vector3D} directionRay 
     * @param {Shape[]} shapes 
     * @returns {Number, Shape}
     */

    testIntersection(directionRay,rayStart,shapes=[],tEpsilon=0.001){
        //note: t >=0.001 is to stop objects from intersecting themselves.
        let tMin = Infinity;
        let intersectedShape = null;
        for( const shape of shapes){
            const ts = shape.intersectsRayAt(rayStart,directionRay);
            for( const t of ts){
                if(t >= tEpsilon && t < tMin){
                    tMin = t;
                    intersectedShape = shape;
                }
            }
        }
        return {tMin: tMin, intersectedShape: intersectedShape};
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
    getPixelColor = (x,y,canvasWidth,canvasHeight,shapes=[],lights=[])=>{
        const viewportRay = this.canvasToViewPort(x,y,canvasWidth,canvasHeight);
        return this.traceRay(viewportRay,shapes,lights);
    }




}

export { Camera };