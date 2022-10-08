"use strict";
import { canvasToViewport } from "./raytrace.js"

export class Rasterizer{

    constructor(canvasElement, camera, shapes = []){
        this.shapes = shapes;
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');
        this.camera = camera;
        this.reset();
    }

    reset = () =>{
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.imageData = this.context.createImageData(this.canvas.width,this.canvas.height);
        this.currentX = 0;
        this.currentY = 0;

    }

    doneProcessing = () =>{
        return this.currentY > this.canvas.height;
    }

    rasterizePixel = () =>{
        
        if(!this.doneProcessing()){

            const viewportRay = canvasToViewport(this.currentX,this.currentY,this.canvas.width,this.canvas.height,this.camera.viewWidth,this.camera.viewHeight,this.camera.distance);
            const color = this.camera.traceRay(viewportRay,this.shapes);
            if(color){
                drawPixel(this.currentX,this.currentY,this.imageData,color);
            }
        }
        
        //iterative step
        this.currentX++;
        if(this.currentX > this.canvas.width){
            this.currentX = 0;
            this.currentY++;
        }



    }

    drawImage = ()=>{
        this.context.putImageData(this.imageData,0,0);
    }

}

/**
 * Puts color data into ImageData's array.
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {ImageData} imageData 
 * @param {Color} color 
 */

function drawPixel(x,y,imageData,color){

    const d = imageData.data;
    const index = 4*(y * imageData.width + x);
    d[index] = color.r;
    d[index + 1] = color.g;
    d[index + 2] = color.b;
    d[index + 3] = 255;

}
