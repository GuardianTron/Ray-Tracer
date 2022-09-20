"use strict";
import { Sphere } from "./libraries/shapes.js";
import { Vector3D } from "./libraries/vector.js";
import { TraceRay,  canvasToViewport } from "./libraries/raytrace.js";
import { Color } from "./libraries/color.js";

const canvas = document.getElementById("ray_canvas");
const origin = new Vector3D(0,0,0);

const shapes = [
    new Sphere(new Vector3D(0,-1,3),1, new Color(255,0,0)),
    new Sphere(new Vector3D(2,0,4),1, new Color(0,0,255)),
    new Sphere(new Vector3D(-2,0,4),1,new Color(0,255,0))
];

const controls = document.getElementById('config');
const submit_btn = document.getElementById('render_btn');
controls.addEventListener('submit',(e)=>{
    e.preventDefault();

    const viewWidth = Number(controls.elements['view_width'].value);
    const viewHeight = Number(controls.elements['view_height'].value);
    const distance = Number(controls.elements['distance'].value);
    console.log("Rendering", viewWidth,viewHeight,distance);
    rasterize(canvas,viewWidth,viewHeight,origin,distance,shapes);
    console.log('Finished');
});



function rasterize(canvas,viewWidth,viewHeight,origin,distance,shapes){
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const imageData = ctx.createImageData(canvas.width,canvas.height);
    for(let x = 0; x < canvas.width; x++){
        for(let y = 0; y < canvas.height; y++){
            const viewportRay = canvasToViewport(x,y,canvas.width,canvas.height,viewWidth,viewHeight,distance);
            let color = TraceRay(origin,viewportRay,shapes);
            if(color){

                drawPixel(x,y,imageData,color);
            }
        }
    }
    ctx.putImageData(imageData,0,0);
}


function drawPixel(x,y,imageData,color){

    const d = imageData.data;
    const index = 4*(y * imageData.width + x);
    d[index] = color.r;
    d[index + 1] = color.g;
    d[index + 2] = color.b;
    d[index + 3] = 255;

}
