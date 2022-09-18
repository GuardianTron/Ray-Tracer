"use strict";
import { Shape } from "./shapes.js";
import { Vector3D } from "./vector.js";
import { Color } from "./color.js";

/**
 * Returns the color of the object that first intersects the ray.
 * @param {Vector3D} origin 
 * @param {Vector3D} direction 
 * @param {Array(Shape)} shapes 
 * @returns Color
 */
export function TraceRay(origin,direction,shapes){
    let tMin = Infinity;
    let color = null;
    for( const shape of shapes){
        const ts = shape.intersectsRayAt(origin,direction);
         for( const t of ts){
            if(t >= 1 && t < tMin){
                tMin = t;
                color = shape.color;
            }
         }
    }
    return color;
}

/**
 * Translates canvas space coordinates to color space coordinates.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} canvasWidth 
 * @param {Number} canvasHeight 
 * @param {Number} viewWidth 
 * @param {Number} ViewHeight 
 * @param {Number} distance 
 * @returns Vector3D
 */

export function canvasToViewport(x,y,canvasWidth,canvasHeight,viewWidth,ViewHeight,distance){
    /* x and y use screen coordinates.  First convert to cartesian 
     * coordinates with origin at center and y increasing upward instead
     * of downward.
     */
    x = x - canvasWidth/2;
    y = canvasHeight/2 - y
    return new Vector3D(x*viewWidth/canvasWidth, y*ViewHeight/canvasHeight,distance);
}