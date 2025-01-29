export class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };
    clone() {
        return new Vector(this.x, this.y);
    };
    translated(offset: Vector) {
        const newVector = this.clone();
        newVector.x += offset.x;
        newVector.y += offset.y;
        return newVector;
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
export interface SelectOption {
    label: string;
    jumpTo: string;
};
export interface ScriptNodeGenerated {
    type: ScriptNodeType;
    jumpTo: string | null;
    position: Vector;
    output?: string;
    emoji?: string;
    content?: string;
    options?: SelectOption[];
    src?: string;
    scriptId?: string;
};
export interface AssetDescriptor {
    data: ArrayBuffer | null;
    type: string;
    previewing: boolean;
    get dataUrl(): string;
};
export interface ScriptAssetGenerated {
    data: string;
    type: string;
};
export interface CharacterSetting {
    setting: boolean,
    avatar: Record<string, string>, // 心情 -> 头像
    currentAvatar: string
};