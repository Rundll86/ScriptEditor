(function (Scratch) {
    class MyExtension {
        getInfo() {
            return {
                name: "My extension",
                id: "myext",
                blocks: $blocks$
            };
        };
        $methods$
    };
    Scratch.extensions.register(new MyExtension);
})(Scratch)