"use strict";
import { Sphere } from "./libraries/shapes.js";
import { Vector3D } from "./libraries/vector.js";
import { TraceRay,  canvasToViewport } from "./libraries/raytrace.js";
import { Color } from "./libraries/color.js";

const canvas = document.getElementById("ray_canvas");
const viewHeight = 1;
const viewWidth = 1;
const distance = 1;
const origin = new Vector3D(0,0,0);

const shapes = [
    new Sphere(new Vector3D(0,-1,3),1, new Color(255,0,0)),
    new Sphere(new Vector3D(2,0,4),1, new Color(0,0,255)),
    new Sphere(new Vector3D(-2,0,4),1,new Color(0,255,0))
];

rasterize(canvas,viewWidth,viewHeight,origin,distance,shapes);

function rasterize(canvas,viewWidth,viewHeight,origin,distance,shapes){
    const ctx = canvas.getContext('2d');
    for(let x = 0; x < canvas.width; x++){
        for(let y = 0; y < canvas.height; y++){
            const viewportRay = canvasToViewport(x,y,canvas.width,canvas.height,viewWidth,viewHeight,distance);
            let color = TraceRay(origin,viewportRay,shapes);
            if(color){

                drawPixel(x,y,ctx,color);
            }
        }
    }
}


function drawPixel(x,y,ctx,color){
    const id = ctx.createImageData(1,1);
    const d = id.data;
    d[0] = color.r;
    d[1] = color.g;
    d[2] = color.b;
    d[3] = 255;
    ctx.putImageData(id,x,y);
}
