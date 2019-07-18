const Koa = require('koa');
const Utils = require('./utils.js');
const Router = require('koa-router');
const KoaStatic = require('koa-static');
const BodyParser = require('koa-bodyparser')
const path = require('path')
const Dbop = require('./dbop.js')

//Dbop.Open('./test.sqlite');
Dbop.Open('./data.db');

const App = new Koa();

App.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);

    await next();
});

var strHtml = "";

let home = new Router()
home.get('/', async (ctx) => {
    Dbop.NewVistite(ctx.request.ip);
    ctx.body = strHtml
});

home.get('/getalldata', async (ctx) => {
    let allKeys = [];
    allKeys = await Dbop.GetAllKeys();
    allKeys = Utils.convertKVtoVarry(allKeys, 'ID');
    allKeys.sort(()=>{
        return .5 - Math.random();
    })
    let ImageKeys = [];
    let counts = 10;
    if (allKeys.length > counts)
    {
        ImageKeys = allKeys.slice(allKeys.length-counts, allKeys.length);
        allKeys = allKeys.slice(0, allKeys.length-counts);
    }
    else
    {
        ImageKeys = allKeys;
        allKeys = [];
    }

    console.log('sss'+ allKeys.length +'xxx' + allKeys);

    let Images = await Dbop.GetImages(ImageKeys);
    ctx.response.type = "json";
    let json = JSON.stringify({
        allKeys: allKeys,
        images: Images
    })
    ctx.response.body = json;
});

home.post('/getimages', async (ctx)=>{
    let postData = ctx.request.body;
    console.log(postData);
    let images = await Dbop.GetImages(postData.imagkeys);
    let resJson = JSON.stringify({
        images: images
    })
    ctx.response.type = 'json';
    ctx.response.body = resJson;
})

App.use(BodyParser());

App.use(home.routes());

const staticPath = '../ui';
App.use(KoaStatic(path.join(__dirname, staticPath)));

const main = async () => {
    strHtml = await Utils.readFileAsync('../ui/index.html', 'utf-8');
    App.listen(80);
}

main();




