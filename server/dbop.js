'use strict'

const Moment = require('moment');
const Sqlite = require('sqlite3').verbose();
const Utils = require('./utils.js')

// const db =  new Sqlite.Database('./test.sqlite')
// db.run('CREATE TABLE test (ID INT )', ()=>{
//     db.run('INSERT INTO test(ID) VALUES (1)', ()=>{
//         db.get('select id from test', (err, rows) => {
//             console.log(rows)
//         })
//     });
// });

var dbop = {};

dbop.Open = (dbname) => {
    this.db = new Sqlite.Database(dbname);
}

dbop.NewVistite = (strIp) => {
    let dt = Moment().format('YYYYMMDD HHMMSS');
    this.db.run('INSERT INTO t_visit (ip, dt) VALUES (?,?)', strIp, dt)
}

dbop.GetAllKeys = () => {
    return new Promise((reslove, reject) => {
        this.db.all('select id from t_images order by like desc', (err, rows)=>{
            if (err)
            {
                console.log('error')
                reject (err);
            }
            else
            {
                console.log(rows)
                reslove(rows);
            }
        })
    })
}

dbop.GetImages= (keys) => {
    console.log(keys.join(','));
    return new Promise((reslove, reject) => {
        this.db.all('select path, des from t_images where id in (' + Utils.genQuesStr(keys.length) +')', keys, (err, rows)=> {
            if (err)
            {
                reject(err);
            }
            else
            {
                console.log(rows);
                reslove(rows);
            }
        })
    })
}

module.exports = dbop;