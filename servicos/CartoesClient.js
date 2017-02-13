/**
 * Created by root on 12/02/17.
 */

var restify = require('restify');

function CartoesClient() {
    this._client = restify.createJsonClient({
        url: 'http://localhost:3000',
        version: '~1.0'
    });
}

CartoesClient.prototype.autoriza = function(cartao, callback) {
    this._client.post('/restApi/cartoes/autoriza', cartao, callback);
}

module.exports = function(){
    return CartoesClient;
};
