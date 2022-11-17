"use strict";
import {Vector2D,Ray} from './math.js';
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
        this.vecLength = Math.min(this.height - 2 * verticalMargin,this.width/2 - horizontalMargin) ;
        const vecOriginY = this.height - verticalMargin;
        this.normalRay = new Ray(new Vector2D(vecOriginX,vecOriginY),new Vector2D(0,-1)); //ray in canvas space
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

    drawNormal =() =>{

        this._drawRay(this.normalRay,this.vecLength,'black');
        this._drawRay(this.surfaceRay,this.width,'black');
        

        

        
    }

    drawVectorToward = (endX,endY) =>{
        const vecOrigin = this.normalRay.origin;
        let len = new Vector2D(endX - vecOrigin.x,endY - vecOrigin.y);
        const lightRay = new Ray(vecOrigin,len)
        const lightRayEnd = lightRay.getEndPoint(this.vecLength);
        this._drawLine(vecOrigin.x,vecOrigin.y,lightRayEnd.x,lightRayEnd.y,'blue');

        //draw "light"
        const lenPerp = len.getPerp();
        const lightBar = new Ray(lightRayEnd,lenPerp);
        const barLength = this.vecLength * .15;
        const lightStart = lightBar.getEndPoint(barLength);
        const lightEnd = lightBar.getEndPoint(-1*barLength);
        this._drawLine(lightStart.x,lightStart.y,lightEnd.x,lightEnd.y,'green');
        
        //draw light on surface
        const leftLightRay = new Ray(lightStart,len);
        const rightLightRay = new Ray(lightEnd,len);

        const leftRaySurfaceInterceptParam = leftLightRay.getIntersectionParameter(this.surfaceRay);
        const rightRaySurfaceInterceptParam = rightLightRay.getIntersectionParameter(this.surfaceRay);
        if(!(isNaN(leftRaySurfaceInterceptParam) || isNaN(rightRaySurfaceInterceptParam))){
            const leftSurfacePoint = leftLightRay.getEndPoint(leftRaySurfaceInterceptParam);
            const rightSurfacePoint = rightLightRay.getEndPoint(rightRaySurfaceInterceptParam);


            this._drawLine(lightStart.x,lightStart.y,leftSurfacePoint.x,leftSurfacePoint.y,'green');
            this._drawLine(lightEnd.x,lightEnd.y,rightSurfacePoint.x,rightSurfacePoint.y,'green');

            let intensity = Math.floor(255 * len.cosineBetween(this.normalRay.direction));
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






const drawer = new DiffuseDemoDraw(canvas);
drawer.drawNormal();
drawer.drawVectorToward(0,0)
canvas.addEventListener('mousemove',(e)=>{
    drawer.clear();
    drawer.drawNormal();
    const boundingRect = canvas.getBoundingClientRect();
    drawer.drawVectorToward(e.clientX-boundingRect.left,e.clientY - boundingRect.top);
    
});

