"use strict";
import { Vector2D, Ray, LineSegment } from './math.js';
import { DemoDrawBase, LightVector, runDemo } from "./demo_base.js";


class DiffuseDemoDraw extends DemoDrawBase{

  

    drawLight = (endX, endY) => {

        const light = new Light(this.normal, this.surfaceRay, endX, endY,this.width);

        this._drawLineSegment(light.directionRaySegment, 'blue');

        //draw light

        const points = [
            light.lightBar.leftSegment.end,
            light.lightBar.rightSegment.end,
            ];
        if(light.rightRaySegment){
            points.push(light.rightRaySegment.end);
        }
        else{
            points.push(light.rightIntersection);
        }

        if(light.leftRaySegment){
            points.push(light.leftRaySegment.end);
        }
        else{
            points.push(light.leftIntersection);
        }
        this._drawShape(points,'rgba(255,255,0,0.25)');


        //draw "light emitter"
        this._drawLineSegment(light.lightBar.leftSegment, 'green');
        this._drawLineSegment(light.lightBar.rightSegment, 'green');

        //draw left and right rays
        if (light.leftRaySegment) this._drawLineSegment(light.leftRaySegment, 'green');
        if (light.rightRaySegment) this._drawLineSegment(light.rightRaySegment, 'green');

        //draw light on surface
        this._drawLineSegment(light.lightBar.leftSegment, 'green');
        this._drawLineSegment(light.lightBar.rightSegment, 'green');

        if (light.leftIntersection && light.rightIntersection && light.directionRaySegment.vector.cosineBetween(this.normal.vector) > 0 ) {
            let intensity = Math.floor(255 * light.directionRaySegment.vector.cosineBetween(this.normal.vector));
            intensity = Math.max(0, intensity);
            const shineColor = `rgb(${intensity},${intensity},0)`;
            const oldWidth = this.ctx.lineWidth;

            this.ctx.lineWidth = 10;
            this._drawLine(light.leftIntersection.x, light.leftIntersection.y, light.rightIntersection.x, light.rightIntersection.y, shineColor);
            this.ctx.lineWidth = oldWidth;
        }






    }
}



class LightBar {
    constructor(ray, length) {
        const halfLength = length / 2;
        this._leftSegment = new LineSegment(ray, halfLength);
        this._rightSegment = new LineSegment(ray, -1 * halfLength);
    }

    get leftSegment() {
        return this._leftSegment;
    }

    get rightSegment() {
        return this._rightSegment;
    }

    get leftEnd() {
        return this._leftSegment.end;
    }

    get rightEnd() {
        return this._rightSegment.end;
    }


}

class Light extends LightVector {



    calculateLightSegments(endX, endY) {
        super.calculateLightSegments(endX,endY);
        this._calcLightBar();
        this._calcLeftRay();
        this._calcRightRay();
    }

    _calcLightDirectionSegment(endX, endY) {
        const origin = this.normal.start;
        const dir = new Vector2D(endX - origin.x, endY - origin.y);
        this.directionRaySegment = new LineSegment(new Ray(origin, dir), this.normal.length);
    }

    _calcLightBar() {
        const perp = this.directionRaySegment.vector.getPerp();
        this.lightBar = new LightBar(new Ray(this.directionRaySegment.end, perp), this.normal.length * .3);


    }

    _calcRightRay() {
        const lightRay = new Ray(this.lightBar.rightEnd, this.directionRaySegment.unitVector);
        const interceptParam = lightRay.getIntersectionParameter(this.surfaceRay);
        //ray either not rendered or going in wrong direction, so shorten end
        if (isNaN(interceptParam)) {
            this.rightRaySegment = new LineSegment(lightRay, -1 * this.max_length);
            this.rightIntersection = null;

        }
        else if (interceptParam > 0) {
            this.lightBar.rightSegment.end = this.lightBar.rightSegment.ray.getIntersectionPoint(this.surfaceRay);
            this.rightIntersection = this.lightBar.rightEnd;
        }
        else {
            this.rightRaySegment = new LineSegment(lightRay, interceptParam);
            this.rightIntersection = this.rightRaySegment.end;
        }
    }



    _calcLeftRay() {
        const lightRay = new Ray(this.lightBar.leftEnd, this.directionRaySegment.unitVector);
        const interceptParam = lightRay.getIntersectionParameter(this.surfaceRay);
        //ray either not rendered or going in wrong direction, so shorten end
        if (isNaN(interceptParam)) {
            this.leftRaySegment = new LineSegment(lightRay, -1 * this.max_length);
            this.leftIntersection = null;
        }
        else if (interceptParam > 0) {
            this.lightBar.leftSegment.end = this.lightBar.leftSegment.ray.getIntersectionPoint(this.surfaceRay);
            this.leftIntersection = this.lightBar.leftEnd;
        }

        else {
            this.leftRaySegment = new LineSegment(lightRay, interceptParam);
            this.leftIntersection = this.leftRaySegment.end;
        }
    }
}

runDemo(DiffuseDemoDraw,'diffuse_demo_container');









