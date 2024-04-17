const events = require('events');
const request = require('request');


module.exports = class Download extends events.EventEmitter {
    start(url, range, headers, part, ranges) {
        const options = {};
        options.headers = headers || {};
        options.headers.Range = `bytes=${range.start}-${range.end}`;
        console.log('class - ',`bytes=${range.start}-${range.end}`)
        let offset = range.start;
        request
            .get(url, options)
            .on('error', (err) => {
                //console.log('erro - ', part)
                this.emit('error', err);
            })
            .on('data', (data) => {
                this.emit('data', data, offset);
                offset += data.length;
                console.log(`Donwload (Parte ${part}): ${offset}/${range.end}`);
            })
            .on('end', () => {
                //console.log('end - ', part)
                this.emit('end');
            });
            part++
        return this;
    }
}
