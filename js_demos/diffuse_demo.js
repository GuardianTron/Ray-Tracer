"use strict";
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
        this.vecOrigin = new Vector2D(vecOriginX,vecOriginY)
        this.ctx.lineWidth = 2;
     
    }

    _drawLine = (startX,startY,endX,endY,color) => {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startX,startY);
        this.ctx.lineTo(endX,endY);
        this.ctx.stroke();
    }

    drawNormal =() =>{
        const startX = this.vecOrigin.x;
        const startY = this.vecOrigin.y;

        this._drawLine(startX,startY,startX,startY - this.vecLength,'black');

        

        
    }

    drawVectorToward = (endX,endY) =>{
        let len = new Vector2D(endX - this.vecOrigin.x,endY - this.vecOrigin.y);
        len.normalize().scale(this.vecLength);


        const vecEnd = this.vecOrigin.add(len);
        this._drawLine(this.vecOrigin.x,this.vecOrigin.y,vecEnd.x,vecEnd.y,'blue');

        //draw "light"
        const lenPerp = len.getPerp();
        lenPerp.normalize().scale(this.vecLength*.15);
        const lightStart = vecEnd.subtract(lenPerp);
        const lightEnd = vecEnd.add(lenPerp);
        this._drawLine(lightStart.x,lightStart.y,lightEnd.x,lightEnd.y,'green');

    }

    

    clear = ()=>{
        this.ctx.clearRect(0,0,this.width,this.height);
    }




}

class Vector2D{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    
    get x(){
        return this._x;
    }

    set x(x){
        this._length = NaN;
        this._x = x;
    }

    get y(){
        return this._y;
    }

    get length(){
        if(isNaN(this._length)){
            this._length = Math.sqrt(this.x * this. x + this.y * this.y);
        }
        return this._length;
    }

    

    set y(y){
        this._length = NaN;
        this._y = y;
    }

    normalize(){
        const length= this.length;
        this.x /= length;
        this.y /= length;
        return this;
    }

    scale(scalar){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    add(vec2){
        const newX = this.x + vec2.x;
        const newY = this.y + vec2.y;
        return new Vector2D(newX,newY);
    }

    subtract(vec2){
        const newX = this.x - vec2.x;
        const newY = this.y - vec2.y;
        return new Vector2D(newX,newY);
    }

    getPerp(){
        return new Vector2D(this.y,this.x * -1);
    }

    copy(){
        return new Vector2D(this.x,this.y);
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

