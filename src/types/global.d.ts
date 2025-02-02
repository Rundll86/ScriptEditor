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
    isDesktop: true | void;
    desktopApi: {
        getProjects: () => Promise<string[]>;
        saveProject: (name: string, data: string) => Promise<void>;
        createProject: (name: string, path: string) => Promise<boolean>;
        isProjectExist: (name: string) => Promise<boolean>;
        openDialog: (filename: string) => Promise<string>;
        readProject: (name: string) => Promise<any>;
        refresh: () => void;
        toggleDevtool: () => void;
    };
}