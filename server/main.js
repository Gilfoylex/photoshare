const Koa = require('koa');
const Utils = require('./utils.js');
const Router = require('koa-router');
const KoaStatic = require('koa-static');
const path = require('path')

const App = new Koa();

App.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);

    await next();
});

var strHtml = "";

let home = new Router()
home.get('/', async (ctx) => {
    ctx.body = strHtml
});

home.get('/getalldata', async (ctx) => {
    console.log("fuck")
    ctx.response.type = "json";
    ctx.response.body = {"allkeys": [1,2,3,4,5,6]};
});

App.use(home.routes());

const staticPath = '../ui';
App.use(KoaStatic(path.join(__dirname, staticPath)));

const main = async () => {
    strHtml = await Utils.readFileAsync('../ui/index.html', 'utf-8');
    App.listen(8080);
}

main();




