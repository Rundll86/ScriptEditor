declare module "*.vue" {
    const content: import("vue").Component;
    export default content;
}
declare module "*.png" {
    const content: string;
    export default content;
}
declare interface Window {
    mouse: [number, number];
    dragging: boolean;
}