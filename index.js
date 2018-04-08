'use strict';
const port = process.env.PORT || 5000;
const Hapi = require('hapi');
var twilio = require('twilio');

var accountSid = 'ACfef52098b92bec50dae763c8119b1062'; // Your Account SID from www.twilio.com/console
var authToken = '5cc17d4ba63d933e755a362a983d42a5';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

// client.messages.create({
//     body: 'Hello from Node',
//     to: '+12345678901',  // Text this number
//     from: '+12345678901' // From a valid Twilio number
// })
// .then((message) => console.log(message.sid));

const server = Hapi.server({
    port: port,

});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
       return h.file('./public/hello.html');
    }

});

server.route({
    method: 'GET',
    path: '/response',
    handler: (request, h) => {

    //console.log(request);
    let resource_name;
    let resource_contact;

    if(request.query.Body.includes("Alcohol addiction")){
        resource_name = "Alcohol Addiction Center";
        resource_contact = "1-844-261-0347";
    }

    if(request.query.Body.includes("Domestic violence")){
        resource_name = "Domestic Violence Help Center";
        resource_contact = "1-877-988-5559";
    }

    if(request.query.Body.includes("Drug abuse")){
        resource_name = "Drug Abuse Help Center";
        resource_contact = "1-877-367-2510";
    }
    
        //console.log(request.query.From);
        client.messages.create({
        body: ( "Please call " + resource_name + " at " + resource_contact),
        to: request.query.From,  // Text this number
        from: '+12019037154' // From a valid Twilio number
        }).then((message) => console.log(message.sid));
        console.log( 'Hello, ' + client.accountSid + '!');
        return "OK";
    }
});


const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/hello',
        handler: (request, h) => {

            return h.file('./public/hello.html');
        }
    });

    server.route({
        path: "/resources/{path*}",
        method: "GET",
        handler: {
            directory: {
                path: "./resources",
                listing: false,
                index: false
            }
        }});

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();