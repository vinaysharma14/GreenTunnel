'use strict';

const { HTTP } = require('./http-parser');
const dnstls = require('dns-over-tls');
const { promisify } = require('util');


function isStartOfHTTPPacket(rawInput) {

    // valid methods (for http request)
    const firstWord = rawInput.split(/\s+/)[0];
    if(HTTP.validMethods.includes(firstWord.toUpperCase()))
        return true;

    // like HTTP/1.1 (For http response)
    const httpWord = firstWord.split('/')[0];
    if(httpWord.toLowerCase() === 'http')
        return true;

    return false;
}

function chunks(buffer, chunkSize) {
    var result = [];
    var len = buffer.length;
    var i = 0;

    while (i < len)
        result.push(buffer.slice(i, i += chunkSize));

    return result;
}

function dnsOverTLSAsync(hostname) {
    return dnstls.query(hostname)
        .then((res) => {
            for(let id in res.answers) {
                const answer = res.answers[id];
                if (answer.type === 'A' && answer.class === 'IN')
                    return answer.data;
            }
        })
        .catch((err) => {
            return err;
        })
}

module.exports = { isStartOfHTTPPacket, chunks, dnsOverTLSAsync };