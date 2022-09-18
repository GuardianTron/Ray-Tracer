"use strict";
import { Shape } from "./shapes";
import { Vector3D } from "./vector";

function TraceRay(origin,direction,shapes){
    let tMin = Infinity;
    let color = null;
    for( const shape of shapes){
        const ts = shape.intersectsRayAt(origin,direction);
         for( const t of ts){
            if(t < tMin){
                t = tMin;
                color = shape.color;
            }
         }
    }
    return color;
}