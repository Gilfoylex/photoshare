'use strict'

const Sqlite = require('sqlite3').verbose();

const Fs = require('fs');



const db = new Sqlite.Database('./data.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS t_visit (ID  INTEGER PRIMARY KEY,'
        + 'ip TEXT,'
        + 'dt TEXT'
        + ')'
    );

    db.run('CREATE TABLE IF NOT EXISTS t_images (ID  INTEGER PRIMARY KEY,'
        + 'path TEXT,'
        + 'des TEXT,'
        + 'like INT,'
        + 'dislike INT'
        + ')');
})

async function insertAn(filename) {
    await insert(filename);
}

function insertData() {
    Fs.readdir('../ui/images', (err, filenames) => {
        filenames.forEach((filename) => {
            if (filename != '.DS_Store') {
                insertAn('./images/' + filename);
            }
        })
    })
}

function insert(filename) {
            return new Promise((res, rej) => {
                db.run('insert into t_images (path, des, like, dislike) values (?,?,?,?)', filename, 'Shot By YJX', 0, 0, (err) => {

                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                })
            })
        }

insertData();



