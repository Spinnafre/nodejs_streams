import {setTimeout} from 'timers/promises'
import {pipeline} from 'stream/promises'
import { PassThrough } from 'stream'


async function * myCustomReadableStream(){
    yield Buffer.from(JSON.stringify({id:0,name:'Davi1'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:1,name:'Davi2'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:2,name:'Davi3'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:3,name:'Davi4'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:4,name:'Davi5'}))
}
async function * myCustomReadableStream2(){
    yield Buffer.from(JSON.stringify({id:0,name:'Zé1'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:1,name:'Zé2'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:2,name:'Zé3'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:3,name:'Zé4'}))
    await setTimeout(1000)
    yield Buffer.from(JSON.stringify({id:4,name:'Zé5'}))
}

async function * myCustomTransformStream(stream){
    for await (const chunk of stream){
        const data = JSON.parse(chunk.toString())
        yield data.name.toUpperCase()
    }
}

const result = []

async function * myCustomWritableStream(stream){
    for await (const chunk of stream){
        result.push(chunk.toString())
    }
}

const myGererators = [myCustomReadableStream(),myCustomReadableStream2()]

async function * both(){
    let progress = 0
    for (let generator of myGererators){
        console.log(`${progress+=50}%`)
        yield * generator
    }
}

const tunnel = new PassThrough()

tunnel.on('data',(chunk)=>{
    console.log(chunk.toString())
})


try {
    const constroller = new AbortController()

    // setImmediate(()=>constroller.abort())

    await pipeline(
        both,
        myCustomTransformStream,
        myCustomWritableStream,
        {signal:constroller.signal}
    )
    console.log(result)
} catch (error) {
    console.log(error)
}