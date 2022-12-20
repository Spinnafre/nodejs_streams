import { createWriteStream } from 'fs';
import {Readable,Transform,PassThrough,Duplex} from 'stream'


class Throttle extends Duplex {
    /*
    * Class constructor will receive the injections as parameters.
    */
    constructor(time) {
        super();
        this.delay = time;
    }
    _read() {}
    
    // Writes the data, push and set the delay/timeout
    _write(chunk, encoding, callback) {
        this.push(chunk);
        setTimeout(callback, this.delay);
    }
  
    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

const readableStream = new Readable({
    read:function(){
        for(let i = 0;i<10;i++){
            const user = {id:i,name:`DX-${Date.now()}`}
            this.push(JSON.stringify(user))
        }
        this.push(null)
    }
})

const parseToCsv = new Transform({
    transform:function(chunk,encoding,cb){
        const user = JSON.parse(chunk)
        const row = `${user.id},${user.name}\n`
        cb(null,row)
    }
})

const setHeader = new Transform({
    transform: function(chunk,encoding,cb){
        this.counter = this.counter ?? 0
        if(!this.counter){
            this.counter++
            cb(null,`id,name\n`.concat(chunk))
        }else{
            cb(null,chunk)
        }
    }
})

const tunnel = new PassThrough()
const throttle = new Throttle(2)

tunnel.on('data',(chunk)=>{
    console.log('Recebido >>> ',chunk.toString())
})

readableStream
    .pipe(parseToCsv)
    .pipe(setHeader)
    .pipe(tunnel)
    .pipe(createWriteStream('myCsv.csv'))

