export function declareGlobalVaribles(obj: { [key: string]: any }) {
    Object.keys(obj).forEach((key) => {
        Object.defineProperty(window, key, {
            value: obj[key]
        });
    });
};