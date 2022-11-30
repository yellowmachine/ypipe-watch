import { w } from '..';
import { g, compile, type Data } from 'ypipe';

test("run w'^'[b,c]x", async ()=>{

    const a = g("a");
    const b = g("b");
    const c = (data: Data) => {data.ctx.close(false);};
    const x = g("x");

    const t = "w'^'[b,a|c]x";
    const cmp = compile(t, {
        namespace: {a, b, c, x},
        plugins: {w: w(["*.js"])}
    });

    const result = await cmp("");
    expect(result).toEqual("ax");
});