"use strict";
import Light from '../libraries/lighting.js';
import {Vector2D,Ray,LineSegment} from './math.js';
const holder = document.getElementById('diffuse_demo_container');
const canvas = document.createElement('canvas');
canvas.width = holder.offsetWidth;
canvas.height = holder.offsetHeight;
holder.appendChild(canvas);

const ctx = canvas.getContext('2d');

class DiffuseDemoDraw{

    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        const vecOriginX = Math.floor(this.width/2)
        const verticalMargin = Math.floor(this.height/10);
        const horizontalMargin = Math.floor(this.width/10);
        const vecLength = Math.min(this.height - 2 * verticalMargin,this.width/2 - horizontalMargin) ;
        const vecOriginY = this.height - verticalMargin;
        this.normal = new LineSegment(new Ray(new Vector2D(vecOriginX,vecOriginY),new Vector2D(0,-1)),vecLength); //ray in canvas space
        this.surfaceRay = new Ray(new Vector2D(0,vecOriginY),new Vector2D(1,0));
        this.ctx.lineWidth = 2;
     
    }

    _drawLine = (startX,startY,endX,endY,color) => {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startX,startY);
        this.ctx.lineTo(endX,endY);
        this.ctx.stroke();
    }

    _drawRay = (ray,length,color) => {
        const end = ray.getEndPoint(length);
        const start = ray.origin;
        this._drawLine(start.x,start.y,end.x,end.y,color);
    }

    _drawLineSegment(lineSegment,color){
        const start = lineSegment.start;
        const end = lineSegment.end;
        this._drawLine(start.x,start.y,end.x,end.y,color);
    }


    drawNormal =() =>{

        this._drawLineSegment(this.normal,'black');
        this._drawRay(this.surfaceRay,this.width,'black');
        

        

        
    }

    drawVectorToward = (endX,endY) =>{
        const vecOrigin = this.normal.start;
        let len = new Vector2D(endX - vecOrigin.x,endY - vecOrigin.y);
        const lightRay = new Ray(vecOrigin,len)
        const lightRayLine = new LineSegment(lightRay,this.normal.length);
        this._drawLineSegment(lightRayLine,'blue');

        //draw "light"
        const lenPerp = len.getPerp();
        const lightBar = new LightBar(new Ray(lightRayLine.end,lenPerp), this.normal.length * .3);
        this._drawLineSegment(lightBar.leftSegment,'green');
        this._drawLineSegment(lightBar.rightSegment,'green');
        
        //draw light on surface
        const leftLightRay = new Ray(lightBar.leftEnd,len);
        const rightLightRay = new Ray(lightBar.rightEnd,len);

        const leftRaySurfaceInterceptParam = leftLightRay.getIntersectionParameter(this.surfaceRay);
        const rightRaySurfaceInterceptParam = rightLightRay.getIntersectionParameter(this.surfaceRay);
        if(!(isNaN(leftRaySurfaceInterceptParam) || isNaN(rightRaySurfaceInterceptParam))){
            const leftSurfacePoint = leftLightRay.getEndPoint(leftRaySurfaceInterceptParam);
            const rightSurfacePoint = rightLightRay.getEndPoint(rightRaySurfaceInterceptParam);

            /**
             * Fix:
             * if intercept params both negative, draw light as here.
             * if one param positive, use it's light bar to calc endpoint instead.
             */

            this._drawLine(lightBar.leftEnd.x,lightBar.leftEnd.y,leftSurfacePoint.x,leftSurfacePoint.y,'green');
            this._drawLine(lightBar.rightEnd.x,lightBar.rightEnd.y,rightSurfacePoint.x,rightSurfacePoint.y,'green');

            let intensity = Math.floor(255 * len.cosineBetween(this.normal.ray.direction));
            intensity = Math.max(0,intensity);
            const shineColor = `rgb(${intensity},${intensity},0)`;
            const oldWidth = this.ctx.lineWidth;
        
            this.ctx.lineWidth = 10;
            this._drawLine(leftSurfacePoint.x,leftSurfacePoint.y,rightSurfacePoint.x,rightSurfacePoint.y,shineColor);
            this.ctx.lineWidth = oldWidth;

        } 



        

    }

    

    clear = ()=>{
        this.ctx.clearRect(0,0,this.width,this.height);
    }

}

class LightBar{
    constructor(ray,length){
        const halfLength = length/2;
        this._leftSegment = new LineSegment(ray,halfLength);
        this._rightSegment = new LineSegment(ray,-1 * halfLength);   
    }

    get leftSegment(){
        return this._leftSegment;
    }

    get rightSegment(){
        return this._rightSegment;
    }

    get leftEnd(){
        return this._leftSegment.end;
    }

    get rightEnd(){
        return this._rightSegment.end;
    }


}










const drawer = new DiffuseDemoDraw(canvas);
drawer.drawNormal();
drawer.drawVectorToward(0,0)
canvas.addEventListener('mousemove',(e)=>{
    drawer.clear();
    drawer.drawNormal();
    const boundingRect = canvas.getBoundingClientRect();
    drawer.drawVectorToward(e.clientX-boundingRect.left,e.clientY - boundingRect.top);
    
});

