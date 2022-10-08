"use strict";
import { Sphere } from "./libraries/shapes.js";
import { Vector3D } from "./libraries/vector.js";
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
