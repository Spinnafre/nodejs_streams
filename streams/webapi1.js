import http from 'http'
import { Readable } from 'stream'

// curl http://localhost:3000 | tee  tree.txt
function api1(req,res){
    let count = 0
    const maxItems = 120

    const readable = new Readable({
        read(){
            const everySecond = (intervalContext)=>{
                if(count++<maxItems){
                    this.push(JSON.stringify({id: Date.now(),name:`DAVI - ${count}`})+"\n")
                    return
                }

                clearInterval(intervalContext)
                this.push(null)
            }

            setInterval(function(){everySecond(this)},500)
        }
    })

    readable
        .pipe(res)
}

function api2(req,res){
    let count = 0
    const maxItems = 120

    const readable = new Readable({
        read(){
            const everySecond = (intervalContext)=>{
                if(count++<maxItems){
                    this.push(JSON.stringify({id: Date.now(),name:`ERICK - ${count}`})+"\n")
                    return
                }

                clearInterval(intervalContext)
                this.push(null)
            }

            setInterval(function(){everySecond(this)},500)
        }
    })

    readable
        .pipe(res)
}


http.createServer(api1).listen(3000,()=>console.log('server 1 running at 3000'))
http.createServer(api2).listen(4000,()=>console.log('server 2 running at 4000'))