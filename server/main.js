const Koa = require('koa');
const Fs = require('fs');

const App = new Koa();

let strHtml = "";

App.use(async (ctx, next) => {
    await next;
    ctx.response.type = 'text/html';

    ctx.response.body = '<h1>Hello, koa2!</h1>';
})

App.use(async (ctx,next) => {
    await next;
    Fs.readFileSync
})

App.listen(3000);



