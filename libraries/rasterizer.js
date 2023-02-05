"use strict";

import { ShapeContainer } from "./shapes.js";

/**
 * Responsible for rasterizing the scene to canvas
 */
export class Rasterizer{

    /**
     * 
     * @param {Canvas} canvasElement 
     * @param {Camera} camera 
     * @param {Array[Shape]} shapes 
     */

    constructor(canvasElement, camera, shapes = [], lights = []){
        this.shapes = shapes;
        this.lights = lights;
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');
        this.camera = camera;
        this.shapes = new ShapeContainer();
        for(const shape of shapes){
            this.shapes.addShape(shape);
        }
        this.reset();
    }

    /**
     * Creates a blank canvas to draw image and
     * sets starting point back to beginning of canvas.
     */

    reset = () =>{
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.imageData = this.context.createImageData(this.canvas.width,this.canvas.height);
        this.currentX = 0;
        this.currentY = 0;

    }

    /**
     * Tests if the scene is fully rendered.
     * @returns Boolean
     */
    doneProcessing = () =>{
        return this.currentY > this.canvas.height;
    }

    /**
     * Rasterizes a single pixel of the scene onto the canvas buffer.
     */

    rasterizePixel = () =>{
        
        if(!this.doneProcessing()){

            const color = this.camera.getPixelColor(this.currentX,this.currentY,this.canvas.width,this.canvas.height,this.shapes,this.lights);
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

    /**
     * Draws the scene buffer to the canvas.
     */
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
