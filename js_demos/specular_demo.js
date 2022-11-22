"use strict";
import {Vector2D,Ray,LineSegment} from "./math.js";
import {DemoDrawBase, LightVector, runDemo} from "./demo_base.js";

class SpecularDemoDraw extends DemoDrawBase{
    
    drawLight = (x,y) =>{
        const canvasDiagnal = (new Vector2D(this.canvas.width,this.canvas.height)).length;
        const light = new Light(this.normal,this.surfaceRay,x,y)
        this._drawLineSegment(light.directionRaySegment,"blue");
        this._drawLineSegment(light.reflectedRaySegment,"purple");

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