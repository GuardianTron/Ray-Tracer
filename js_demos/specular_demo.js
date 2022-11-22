"use strict";
import {Vector2D,Ray,LineSegment} from "./math.js";
import {DemoDrawBase, LightVector, runDemo} from "./demo_base.js";

class SpecularDemoDraw extends DemoDrawBase{

    _calculateSizes(){
        super._calculateSizes();
        const rad = 22.5 / 180 * Math.PI;
        const cameraRay = new Ray(this.normal.start,new Vector2D(Math.cos(rad),-1*Math.sin(rad)));
        this.cameraSegment = new LineSegment(cameraRay,this.normal.length);
    }

    drawNormal = ()=>{
        super.drawNormal();
        this._drawLineSegment(this.cameraSegment,'green');
    }
    
    drawLight = (x,y) =>{
  
        const light = new Light(this.normal,this.surfaceRay,x,y)
        this._drawLineSegment(light.directionRaySegment,"blue");
        this._drawLineSegment(light.reflectedRaySegment,"purple");
        //only draw arc if light is correct side of surface
        if(light.directionRaySegment.unitVector.dotProduct(this.normal.unitVector) > 0) this._drawLightArc(light);

    }

    _drawLightArc(light){
        //calculate start and end angles of vectors relative to surface
        const cameraAngle = Math.acos(this.cameraSegment.unitVector.cosineBetween(this.surfaceRay.direction));
        const reflectedAngle = Math.acos(light.reflectedRaySegment.unitVector.cosineBetween(this.surfaceRay.direction));
        const x = this.normal.start.x;
        const y = this.normal.start.y;
        const isCC = reflectedAngle > cameraAngle;
        const cosine = light.reflectedRaySegment.vector.cosineBetween(this.cameraSegment.vector);
        const intensity = Math.max(0,Math.floor(255*cosine));
        const strokeColor = `rgb(${intensity},${intensity},0)`;
        
        const oldFillColor = this.ctx.fillStyle;
        const oldStrokeColor = this.ctx.oldStrokeColor;
        const oldLineWidth = this.ctx.lineWidth;
        this.ctx.fillStyle = 'rgba(255,255,0,.25)';
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 10;

        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
        this.ctx.arc(x,y,this.normal.length,-1*cameraAngle,-1*reflectedAngle,isCC);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x,y,this.normal.length,-1*cameraAngle,-1*reflectedAngle,isCC);
        this.ctx.stroke();
        this.ctx.fillStyle = oldFillColor;
        this.ctx.strokeStyle = oldStrokeColor;
        this.ctx.lineWidth = oldLineWidth;
    }





}


class Light extends LightVector{

    calculateLightSegments(endX,endY){
        super.calculateLightSegments(endX,endY);
        this._calculateReflectectedLineSegment();

    }

    _calculateReflectectedLineSegment(){
        const normalVec = this.normal.unitVector;
        const lightVec = this.directionRaySegment.vector;
        const lightProjected = normalVec.project(lightVec);
        const reflectedDirection = lightProjected.scale(2).subtract(lightVec);
        this.reflectedRaySegment = new LineSegment(new Ray(this.normal.start,reflectedDirection),reflectedDirection.length);

    }
}


runDemo(SpecularDemoDraw,'specular_demo_container');