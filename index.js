const http = require('http')
const fs = require('fs');
const Download = require('./Download')
let type = 'mp4'
let name = 'a'
let config = {
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    path: `./src/download/video1.mp4`,
    connections: 4
}
//let active = 0

function getRange(size, connections) {
    let sizePerConnections = Math.floor(size / connections)
    let sobras = size % connections

    let sizeRangeArray = new Array(connections)

    for (let i = 0; i < sizeRangeArray.length; i++) {
        sizeRangeArray[i] = sizePerConnections * (i + 1)
    }

    sizeRangeArray[sizeRangeArray.length - 1] += sobras
    return sizeRangeArray
}
function init() {
    http.get(config.url, (res) => {
        let ranges = getRange(res.headers['content-length'], config.connections);
        type = res.headers['content-type'].split('/')[1]
        config.path = `./src/download/${name}.${type}`
        let first = true
        let active = 0
        let initialByte = 0
        res.destroy()
        fs.open(config.path, 'w+', 0o644, async (err, fd) => {
            if(err) {
                console.log('Erro -', err)
            }else {
                while(active < config.connections){
                    let range = 
                        {
                            start: initialByte,
                            end: ranges[active]
                        }
                    
                    new Download()
                    .start(config.url, range, false, active)
                    .on('data', (data, offset) => {
                        fs.write(fd, data, 0, data.length, offset, function(err,writtenbytes) {
                            //console.log('Data: ', data.length)
                        })

                    })
                    initialByte = ranges[active] + 1
                    active++
                }
            }
        })      
    }) 
}
init()


