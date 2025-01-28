declare module "*.vue" {
    const content: import("vue").Component;
    export default content;
}
declare interface Window {
    mouse: [number, number];
    dragging: boolean;
}