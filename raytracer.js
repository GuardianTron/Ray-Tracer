"use strict";
import { Sphere } from "./libraries/shapes.js";
import { Vector3D } from "./libraries/vector.js";
import { canvasToViewport } from "./libraries/raytrace.js";
import { Color } from "./libraries/color.js";
import { Camera } from "./libraries/camera.js";
import { Rasterizer } from "./libraries/rasterizer.js";

const canvas = document.getElementById("ray_canvas");
const origin = new Vector3D(0,0,0);

const shapes = [
    new Sphere(new Vector3D(0,-1,3),1, new Color(255,0,0)),
    new Sphere(new Vector3D(2,0,4),1, new Color(0,0,255)),
    new Sphere(new Vector3D(-2,0,4),1,new Color(0,255,0))
];



const controls = document.getElementById('config');

const submit_btn = document.getElementById('render_btn');
const width_slider = controls.elements['view_width'];
const height_slider = controls.elements['view_height'];
const distance_slider = controls.elements['distance'];


width_slider.addEventListener('input',slideHandlerMaker('view_width_out'));
height_slider.addEventListener('input',slideHandlerMaker('view_height_out'));
distance_slider.addEventListener('input',slideHandlerMaker('distance_out'));



function slideHandlerMaker(outputId) {
    const outputElement = document.getElementById(outputId);
    return function(event){
        outputElement.value = event.target.value;
    };
}

controls.addEventListener('submit',(e)=>{
    e.preventDefault();
    const camera = new Camera(origin,0,0,0);
    camera.viewWidth = Number(controls.elements['view_width'].value);
    camera.viewHeight = Number(controls.elements['view_height'].value);
    camera.distance = Number(controls.elements['distance'].value);
    const pixelsPerFrame = canvas.width * canvas.height/300;

    const rasterizer = new Rasterizer(canvas,camera,shapes);

    function animate(timestep){
        for(let i = 0; i < pixelsPerFrame && !rasterizer.doneProcessing(); i++){
            rasterizer.rasterizePixel();
        }
        rasterizer.drawImage();
        if(!rasterizer.doneProcessing()){
            window.requestAnimationFrame(animate);
        }
    }

    window.requestAnimationFrame(animate);


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


