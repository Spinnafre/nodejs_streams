import net from 'net'

net.createServer(socket=>socket.pipe(process.stdout)).listen(3333)

// Executar em outro terminal
// node -e "process.stdin.pipe(require('net').connect(1340))"