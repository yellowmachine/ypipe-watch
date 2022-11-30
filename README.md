# ypipe-watch

watch plugin for ypipe

Example:
```js
const {compile} = require("ypipe")
const { w } = require("ypipe-watch");

const t = "w'[a|b]c";
    
const f = compile(t, {
        namespace: {a, b, c},
        plugins: {w: w(["*.js"])}
    });

async function main(){
    await f();
}

main();
```