module.exports = function (io, streams) {

    io.on('connection', function (client) {
        console.log('-- ' + client.id + ' joined --');
        client.emit('id', client.id);

        client.on('message', function (details) {
            var otherClient = io.sockets.connected[details.to];

            if (!otherClient) {
                return;
            }
            delete details.to;
            details.from = client.id;
            otherClient.emit('message', details);
        });

        //transfer text information
        client.on('text', function (msg) {
            var xxx = io.sockets.connected;
            /*var otherClient = io.sockets.connected[msg.to];

             if (!otherClient) {
             return;
             }
             delete msg.to;
             msg.from = client.id;
             otherClient.emit('text', msg);*/

            var otherClient = io.sockets.connected;
            for (var key in otherClient) {
                if (key != client.id) {
                    msg.from = client.id;
                    otherClient[key].emit('text', msg);
                }
            }

        });

        client.on('readyToStream', function (options) {
            console.log('-- ' + client.id + ' is ready to stream --');

            streams.addStream(client.id, options.name);
        });

        client.on('update', function (options) {
            streams.update(client.id, options.name);
        });

        function leave() {
            console.log('-- ' + client.id + ' left --');
            streams.removeStream(client.id);
        }

        client.on('disconnect', leave);
        client.on('leave', leave);
    });
};