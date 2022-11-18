"use strict";
import { Vector2D, Ray, LineSegment } from './math.js';
const holder = document.getElementById('diffuse_demo_container');
const canvas = document.createElement('canvas');
canvas.width = holder.offsetWidth;
canvas.height = holder.offsetHeight;
holder.appendChild(canvas);

const ctx = canvas.getContext('2d');

class DiffuseDemoDraw {

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        const vecOriginX = Math.floor(this.width / 2)
        const verticalMargin = Math.floor(this.height / 10);
        const horizontalMargin = Math.floor(this.width / 10);
        const vecLength = Math.min(this.height - 2 * verticalMargin, this.width / 2 - horizontalMargin);
        const vecOriginY = this.height - verticalMargin;
        this.normal = new LineSegment(new Ray(new Vector2D(vecOriginX, vecOriginY), new Vector2D(0, -1)), vecLength); //ray in canvas space
        this.surfaceRay = new Ray(new Vector2D(0, vecOriginY), new Vector2D(1, 0));
        this.ctx.lineWidth = 2;

    }

    _drawLine = (startX, startY, endX, endY, color) => {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
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


    drawNormal = () => {

        this._drawLineSegment(this.normal, 'black');
        this._drawRay(this.surfaceRay, this.width, 'black');





    }

    drawLight = (endX, endY) => {

        const light = new Light(this.normal, this.surfaceRay, endX, endY);
        this._drawLineSegment(light.directionRaySegment, 'blue');

        //draw "light emitter"
        this._drawLineSegment(light.lightBar.leftSegment, 'green');
        this._drawLineSegment(light.lightBar.rightSegment, 'green');

        //draw left and right rays
        if (light.leftRaySegment) this._drawLineSegment(light.leftRaySegment, 'green');
        if (light.rightRaySegment) this._drawLineSegment(light.rightRaySegment, 'green');

        //draw light on surface
        this._drawLineSegment(light.lightBar.leftSegment, 'green');
        this._drawLineSegment(light.lightBar.rightSegment, 'green');

        if (light.leftIntersection && light.rightIntersection) {
            let intensity = Math.floor(255 * light.directionRaySegment.ray.direction.cosineBetween(this.normal.ray.direction));
            intensity = Math.max(0, intensity);
            const shineColor = `rgb(${intensity},${intensity},0)`;
            const oldWidth = this.ctx.lineWidth;

            this.ctx.lineWidth = 10;
            this._drawLine(light.leftIntersection.x, light.leftIntersection.y, light.rightIntersection.x, light.rightIntersection.y, shineColor);
            this.ctx.lineWidth = oldWidth;
        }






    }



    clear = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
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

class Light {

    constructor(normalLineSegment, surfaceRay, endX, endY, max_length = 600) {
        this.normal = normalLineSegment;
        this.surfaceRay = surfaceRay;
        this.leftRaySegment = null;
        this.rightRaySegment = null;
        this.max_length = max_length;
        this.calculateLightSegments(endX, endY);
    }

    calculateLightSegments(endX, endY) {
        this._calcLightDirectionSegment(endX, endY);
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
        const perp = this.directionRaySegment.ray.direction.getPerp();
        this.lightBar = new LightBar(new Ray(this.directionRaySegment.end, perp), this.normal.length * .3);


    }

    _calcRightRay() {
        const lightRay = new Ray(this.lightBar.rightEnd, this.directionRaySegment.ray.direction);
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
        const lightRay = new Ray(this.lightBar.leftEnd, this.directionRaySegment.ray.direction);
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










const drawer = new DiffuseDemoDraw(canvas);
drawer.drawNormal();
drawer.drawLight(0, 0)
canvas.addEventListener('mousemove', (e) => {
    drawer.clear();
    drawer.drawNormal();
    const boundingRect = canvas.getBoundingClientRect();
    drawer.drawLight(e.clientX - boundingRect.left, e.clientY - boundingRect.top);

});

