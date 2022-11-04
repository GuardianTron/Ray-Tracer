"use strict";
import { Sphere } from "./libraries/shapes.js";
import { Vector3D } from "./libraries/vector.js";
import { Color } from "./libraries/color.js";
import { Camera } from "./libraries/camera.js";
import { Rasterizer } from "./libraries/rasterizer.js";
import { Light, PointLight, DirectionalLight, BookDiffuseShader, BookSpecularShader} from "./libraries/lighting.js";

const canvas = document.getElementById("ray_canvas");
const origin = new Vector3D(0,0,0);

const shapes = [
    new Sphere(new Vector3D(0,-1,3),1, new Color(255,0,0),new BookDiffuseShader(),new BookSpecularShader(500)),
    new Sphere(new Vector3D(2,0,4),1, new Color(0,0,255),new BookDiffuseShader(),new BookSpecularShader(500)),
    new Sphere(new Vector3D(-2,0,4),1,new Color(0,255,0),new BookDiffuseShader(),new BookSpecularShader(10)),
    new Sphere(new Vector3D(0,-5001,0),5000, new Color(255,255,0),new BookDiffuseShader(),new BookSpecularShader(1000))
];

const ambientLight = new Light(0.2);
const pointLight = new PointLight(0.6,new Vector3D(2,1,0));
const directionalLight = new DirectionalLight(0.2,new Vector3D(1,4,4));

const lights = [
    ambientLight,
    pointLight,
    directionalLight
];



const controls = document.getElementById('config');

const width_slider = controls.elements['view_width'];
const height_slider = controls.elements['view_height'];
const distance_slider = controls.elements['distance'];

const ambient_slider = controls.elements['ambient_light'];
const point_slider = controls.elements['point_light'];
const directional_slider = controls.elements['directional_light'];


width_slider.addEventListener('input',slideHandlerMaker('view_width_out'));
height_slider.addEventListener('input',slideHandlerMaker('view_height_out'));
distance_slider.addEventListener('input',slideHandlerMaker('distance_out'));

ambient_slider.addEventListener('input',slideHandlerMaker('ambient_light_out'));
point_slider.addEventListener('input',slideHandlerMaker('point_light_out'));
directional_slider.addEventListener('input',slideHandlerMaker('directional_light_out'));

window.addEventListener('load',(event)=>{
    document.getElementById('view_width_out').value = width_slider.value;
    document.getElementById('view_height_out').value = height_slider.value;
    document.getElementById('distance_out').value = distance_slider.value;
    
    document.getElementById('ambient_light_out').value = ambient_slider.value;
    document.getElementById('point_light_out').value = point_slider.value;
    document.getElementById('directional_light_out').value = directional_slider.value;

    //create square canvas with same width as parent container
    const size = canvas.parentElement.offsetWidth;
    canvas.width = size;
    canvas.height = size;
});



function slideHandlerMaker(outputId) {
    const outputElement = document.getElementById(outputId);
    return function(event){
        outputElement.value = event.target.value;
    };
}

function getScriptDirectory(){
    const url = import.meta.url;
    const lastSlashIndex = url.lastIndexOf('/');
    return url.substring(0,lastSlashIndex+1);
}

async function loadDemo(url){
    const demoHolder = document.getElementById('demo_container');
    try{
        const response = await fetch(getScriptDirectory() + url);
        const htmlText = await response.text();
        demoHolder.innerHTML = htmlText;
        setUpDemo();
    }
    catch(error){
        demoHolder.innerHTML = "<p>Unfortunately, there was an error loading the demo.</p>"
        console.error(error);

    }

}


function setUpDemo(){
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



    document.getElementById('view_width_out').value = width_slider.value;
    document.getElementById('view_height_out').value = height_slider.value;
    document.getElementById('distance_out').value = distance_slider.value;
    
    //create square canvas with same width as parent container
    const size = canvas.parentElement.offsetWidth;
    canvas.width = size;
    canvas.height = size;

    controls.addEventListener('submit',(e)=>{
        e.preventDefault();
        const shouldAnimate = controls.elements['animate'].checked;
        const camera = new Camera(origin,0,0,0);
        camera.viewWidth = Number(controls.elements['view_width'].value);
        camera.viewHeight = Number(controls.elements['view_height'].value);
        camera.distance = Number(controls.elements['distance'].value);

        camera.enableAmbient = controls.elements['ambient_shader'].checked;
        camera.enableDiffuse = controls.elements['diffuse_shader'].checked;
        camera.enableSpecular = controls.elements['specular_shader'].checked;
    
        ambientLight.intensity = Number(ambient_slider.value);
        pointLight.intensity = Number(point_slider.value);
        directionalLight.intensity = Number(directional_slider.value);
        
        const animateDivisor = (shouldAnimate)? 300 : 1;
        const pixelsPerFrame = canvas.width * canvas.height/animateDivisor;
    
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
}

loadDemo('raydemo.html');
















