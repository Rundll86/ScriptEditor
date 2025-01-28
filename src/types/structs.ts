export class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };
};
export type ScriptNodeType = "talk" | "select" | "image" | "video" | "script";
export interface ScriptNode {
    name: string;
    next: string | null;
    position: Vector;
    type: ScriptNodeType;
    data: {
        // talk & select
        talker?: string;
        feeling?: string;
        content?: string;
        // select only
        options: {
            label: string;
            next: string | null;
        }[];
        // image & video
        src?: string;
        // script
        scriptId?: string;
    };
};
export interface NodeUpdater {
    (): void
};
export interface ScriptNodeNext {
    data?: ScriptNode;
    el: HTMLElement
};