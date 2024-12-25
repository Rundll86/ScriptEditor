declare module "*.vue" {
    const content: import("vue").VueElement;
    export default content;
}