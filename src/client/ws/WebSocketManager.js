const WS = require('ws');
const { encode, decode } = require('msgpack-lite');

class WebSocketManager {
    constructor(client, { url, handshakeTimeout } = {}) {
        this.client = client;
        this._pings = [];
        this.url = typeof url === 'string' ? url : 'wss://social.krunker.io/ws';
        this.handshakeTimeout = typeof handshakeTimeout === 'number' ? handshakeTimeout : 10000;
    }
    get ping() {
        return this._pings.reduce((a, b) => a + b, 0) / this._pings.length;
    }
    request(toSend, bufferData, callback, mult = false) {
        const ws = new WS(this.url, { handshakeTimeout: this.handshakeTimeout });
        const start = Date.now();
        return new Promise((res, rej) => {
            ws.onopen = () =>
                ws.send(
                    encode(toSend).buffer,
                );
            ws.onerror = err => {
                ws.terminate();
                rej(err);
            };

            ws.onmessage = async buffer => {
                const data = bufferData(decode(new Uint8Array(buffer.data)));
                this._pings.push(Date.now() - start);
                let r;
                try {
                    r = await callback(data);
                }
                catch (e) {
                    ws.close();
                    return rej(e);
                }
                if (!mult) {
                    ws.close();
                    return res(r);
                }
                if (r) {
                    ws.close();
                    res(r);
                }
            };
        });
    }
}

module.exports = WebSocketManager;