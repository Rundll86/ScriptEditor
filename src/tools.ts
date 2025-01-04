import { Vector } from "./types/structs";
export function declareGlobalVaribles(obj: { [key: string]: any }) {
    Object.keys(obj).forEach((key) => {
        Object.defineProperty(window, key, {
            value: obj[key]
        });
    });
};
export function bezierCurve(t: number, a: Vector, control1: Vector, control2: Vector, b: Vector): Vector {
    const x = (1 - t) ** 3 * a.x + 3 * (1 - t) ** 2 * t * control1.x + 3 * (1 - t) * t ** 2 * control2.x + t ** 3 * b.x;
    const y = (1 - t) ** 3 * a.y + 3 * (1 - t) ** 2 * t * control1.y + 3 * (1 - t) * t ** 2 * control2.y + t ** 3 * b.y;
    return { x, y };
};
export function circleEquation(p: Vector, circleCenter: Vector, radius: number): boolean {
    return (p.x - circleCenter.x) ** 2 + (p.y - circleCenter.y) ** 2 <= radius ** 2;
};
export function findClosestBezierCircleIntersection(
    a: Vector,
    control1: Vector,
    control2: Vector,
    b: Vector,
    circleCenter: Vector,
    radius: number
): Vector | null {
    let closestIntersection: Vector | null = null;
    let minDistance = Infinity;
    for (let t = 0; t <= 1; t += 0.01) {
        const pointOnBezier = bezierCurve(t, a, control1, control2, b);
        if (circleEquation(pointOnBezier, circleCenter, radius)) {
            const distance = Math.sqrt((pointOnBezier.x - a.x) ** 2 + (pointOnBezier.y - a.y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                closestIntersection = pointOnBezier;
            };
        };
    };
    return closestIntersection;
};
export function calcControl(a: Vector, b: Vector, offsetMulitplier: number = 0.2) {
    const distance = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const offset = distance * offsetMulitplier;
    const control1 = {
        x: a.x + (b.x - a.x) / 3 + offset,
        y: a.y + (b.y - a.y) / 3 - offset
    };
    const control2 = {
        x: b.x - (b.x - a.x) / 3 - offset,
        y: b.y - (b.y - a.y) / 3 + offset
    };
    return { control1, control2 };
};
export function keyMirror(...keys: string[]) {
    const result: any = {};
    keys.forEach(key => {
        result[key] = key;
    });
    return result;
};
export function unused<T>(data: T) { return data; };
export namespace Drawing {
    let stageCanvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    const lineWidth = 3;
    export function initWith(canvas: HTMLCanvasElement) {
        stageCanvas = canvas;
        context = stageCanvas.getContext("2d") as CanvasRenderingContext2D;
        context.lineWidth = lineWidth;
    };
    export function drawArrow(point: Vector, control: Vector, arrowSize: number = 10) {
        const angle = Math.atan2(point.y - control.y, point.x - control.x);
        const arrowLine1 = {
            x1: point.x - arrowSize * Math.cos(angle - Math.PI / 6),
            y1: point.y - arrowSize * Math.sin(angle - Math.PI / 6),
            x2: point.x,
            y2: point.y
        };
        const arrowLine2 = {
            x1: point.x - arrowSize * Math.cos(angle + Math.PI / 6),
            y1: point.y - arrowSize * Math.sin(angle + Math.PI / 6),
            x2: point.x,
            y2: point.y
        };
        context.beginPath();
        context.moveTo(arrowLine1.x1, arrowLine1.y1);
        context.lineTo(arrowLine1.x2, arrowLine1.y2);
        context.moveTo(arrowLine2.x1, arrowLine2.y1);
        context.lineTo(arrowLine2.x2, arrowLine2.y2);
        context.stroke();
    };
    export function straightConnect(a: Vector, b: Vector, withArrow: boolean = true) {
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
        context.closePath();
        if (withArrow) drawArrow(b, a);
    };
    export function straightConnectElement(a: HTMLElement, b: HTMLElement, withArrow: boolean = true) {
        const centerA: Vector = new Vector(a.getBoundingClientRect().left, a.getBoundingClientRect().top);
        centerA.x += (a.clientWidth + lineWidth) / 2;
        centerA.y += (a.clientHeight + lineWidth) / 2;
        const centerB: Vector = new Vector(b.getBoundingClientRect().left, b.getBoundingClientRect().top);
        centerB.x += (b.clientWidth + lineWidth) / 2;
        centerB.y += (b.clientHeight + lineWidth) / 2;
        straightConnect(centerA, centerB, withArrow);
    };
    export function bezierConnect(a: Vector, b: Vector, withArrow: boolean = true) {
        const { control1, control2 } = calcControl(a, b);
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, b.x, b.y);
        context.stroke();
        context.closePath();
        if (withArrow) drawArrow(b, control2);
    };
    export function bezierConnectElement(a: HTMLElement, b: HTMLElement, distMode: "center" | "edge" = "center") {
        const centerA: Vector = new Vector(a.getBoundingClientRect().left, a.getBoundingClientRect().top);
        centerA.x += (a.clientWidth + lineWidth) / 2;
        centerA.y += (a.clientHeight + lineWidth) / 2;
        const centerB: Vector = new Vector(b.getBoundingClientRect().left, b.getBoundingClientRect().top);
        centerB.x += (b.clientWidth + lineWidth) / 2;
        centerB.y += (b.clientHeight + lineWidth) / 2;
        const start: Vector = centerA;
        let end: Vector | null = null;
        if (distMode === "center") {
            end = new Vector(b.getBoundingClientRect().left, b.getBoundingClientRect().top);
            end.x += (b.clientWidth + lineWidth) / 2;
            end.y += (b.clientHeight + lineWidth) / 2;
        } else if (distMode === "edge") {
            const { control1, control2 } = calcControl(centerA, centerB);
            end = findClosestBezierCircleIntersection(centerA, control1, control2, centerB, centerB, b.offsetWidth / 2);
        } else {
            unused<never>(distMode);
        };
        if (start && end) {
            bezierConnect(start, end);
        };
    };
    export function clear() {
        context.beginPath();
        context.clearRect(0, 0, stageCanvas.width, stageCanvas.height);
        context.closePath();
    };
};