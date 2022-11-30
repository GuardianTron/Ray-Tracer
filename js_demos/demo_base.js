"use strict";
import {Vector2D,Ray,LineSegment} from "./math.js";
export default class DemoDrawBase {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        
        this._calculateSizes();



        if(ResizeObserver){
            const observer = new ResizeObserver(this.redraw);
            let element = this.canvas.parentElement;
            if(!element) element = this.canvas;
            observer.observe(element);
        }
        else{
            window.addEventListener('resize',this.redraw);  
        }




    }

    _calculateSizes(){
        
 
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.lineWidth = 2;
        
        const vecOriginX = Math.floor(this.width / 2)
        const verticalMargin = Math.floor(this.height / 10);
        const horizontalMargin = Math.floor(this.width / 10);
        const vecLength = Math.min(this.height - 2 * verticalMargin, this.width / 2 - horizontalMargin);
        const vecOriginY = this.height - verticalMargin;
        this.normal = new LineSegment(new Ray(new Vector2D(vecOriginX, vecOriginY), new Vector2D(0, -1)), vecLength); //ray in canvas space
        this.surfaceRay = new Ray(new Vector2D(0, vecOriginY), new Vector2D(1, 0));

    }

    get width(){
        return this.canvas.width;
    }

    get height(){
        return this.canvas.height;
    }

    

    _drawLine = (startX, startY, endX, endY, color) => {
        const oldColor = this.ctx.strokeStyle;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.strokeStyle = oldColor;
    }

    _drawRay = (ray, length, color) => {
        const end = ray.getEndPoint(length);
        const start = ray.origin;
        this._drawLine(start.x, start.y, end.x, end.y, color);
    }

    _drawLineSegment(lineSegment, color) {
        const start = lineSegment.start;
        const end = lineSegment.end;
        this._drawLine(start.x, start.y, end.x, end.y, color);
    }

    _drawShape(points,color){
        const oldColor = this.ctx.fillColor;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const startPoint = points.unshift();
        this.ctx.moveTo(startPoint.x,startPoint.y);
        for(const point of points){
            this.ctx.lineTo(point.x,point.y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillColor = oldColor;



    }


    drawNormal(){

        this._drawLineSegment(this.normal, 'black');
        this._drawRay(this.surfaceRay, this.width, 'black');





    }

    drawLight = (endX, endY) => {
        //draw code goes here.
        

    }



    clear = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    redraw = () => {
        
        this._calculateSizes();

        this.drawNormal();
        this.drawLight(0,0);


    }

}

class LightVector{

    constructor(normalLineSegment, surfaceRay, endX, endY, max_length = 600) {
        this.normal = normalLineSegment;
        this.surfaceRay = surfaceRay;
        this.leftRaySegment = null;
        this.rightRaySegment = null;
        this.max_length = max_length;
        this.calculateLightSegments(endX, endY);
    }

    calculateLightSegments(endX,endY){
        this._calcLightDirectionSegment(endX,endY);
    }

    _calcLightDirectionSegment(endX, endY) {
        const origin = this.normal.start;
        const dir = new Vector2D(endX - origin.x, endY - origin.y);
        this.directionRaySegment = new LineSegment(new Ray(origin, dir), this.normal.length);
    }



}

function runDemo(demoClass,containerId){
        const container = document.getElementById(containerId);
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        const drawer = new demoClass(canvas);

        function animateDemo(x,y){
            drawer.clear();
            drawer.drawNormal();
            const boundingRect = canvas.getBoundingClientRect();
            drawer.drawLight((x - boundingRect.left)*(canvas.width/boundingRect.width), (y - boundingRect.top)*(canvas.height/boundingRect.height));
        
        }

        animateDemo(0,0);
        if(window.PointerEvent){
            console.log('pointer event');
            canvas.addEventListener('pointermove',(e) =>{
                e.preventDefault();
                if(e.isPrimary) animateDemo(e.x,e.y);
                
            });
        }
        else{ //mouse pointer
            console.log('mouse event');
            canvas.addEventListener('mousemove', (e) => {
                e.preventDefault();
                animateDemo(x,y);

        
            });
        }
        
    }

export {DemoDrawBase,LightVector, runDemo};