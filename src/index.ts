import { watch as chwatch } from 'chokidar';
import { emitKeypressEvents } from 'node:readline';

import { FD, Next, Data} from 'ypipe';

export const DEBUG = {v: false};

emitKeypressEvents(process.stdin);
try{
    process.stdin.setRawMode(true);
}catch(err){
    console.log('this is for jest tests');
}


export const w = (files: string[]) => (next: Next, pipe: FD[], data: Data ) => {

    const quit = data.ctx.close;

    const q = 'q';
    const h = (ch: string) => {
        if(ch === q){
            close();
        }
    };
    process.stdin.on('keypress', h);        

    let resolve: (null|((arg0: (any)) => void)) = null;
    let reject: (null|(() => void)) = null;

    const p: Promise<any> = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    let exited = false;
    function close(err = false){
        if(!exited){
            quit();
            exited = true;
            process.stdin.pause();
            process.stdin.removeListener("keypress", h);
            if(err){
                if(reject) reject();
            }
            else if(resolve) resolve(data.data);
            if(watcher)
                watcher.close();
        }
        return true;
    }

    async function exitedRun(){
        while(!exited){   
            await run();
        }
    }

    async function run(){
        try{
            data = {data: data.data, ctx: {close}};
            await next(pipe, data);
            // eslint-disable-next-line no-console
            console.log("Press " + q + " to quit!");
        }catch(err){
            //
        }
    }

    let watcher: null | ReturnType<typeof chwatch> = null;
    if(!DEBUG.v){
        watcher = chwatch(files, {ignoreInitial: true}).
            on('all', (event, path) => {
                // eslint-disable-next-line no-console
                //console.log(event, path);
                run();
            });
        run();
    }else{
        exitedRun();
    }

    return p;
};
