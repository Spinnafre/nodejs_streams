import axios from 'axios'

import {Writable,PassThrough,Readable, Duplex} from 'stream'

const AP1 = "http://localhost:3000" 
const AP2 = "http://localhost:4000"

const responses = await Promise.all([
    axios({
        url:AP1,
        method:"GET",
        responseType: "stream"
    }),
    axios({
        url:AP2,
        method:"GET",
        responseType: "stream"
    }),
])

const results = responses.map(({data})=>data)

const writable = new Writable({
    write(chunk,enc,cb){
        const data = chunk.toString()
        console.log('DATA -> ',data)
        cb(null,data)
    }
})

function merge(streams){
    let tunnel = new PassThrough()

    return streams.reduce((acc,current,index,items)=>{
        current.pipe(acc,{end:false})
        
        current.on('end',()=> items.every((item)=>item.ended) && acc.end())

        return acc
    },tunnel)
}

merge(results)
    .pipe(writable)

