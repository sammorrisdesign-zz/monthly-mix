var fs = require('fs-extra');
var glob = require('glob');
var home = require('os').homedir();
var Client = require('ssh2-sftp-client');
var sftp = new Client();
var files = [];

var config = require('../config.json').server;
    config.port = '22';
    config.privateKey = fs.readFileSync(home + '/.ssh/id_rsa');

sftp.connect(config).then(() => {
    console.log('connected to SFTP');
    return sftp.rmdir('/var/www/monthly.mx/public_html/', true)
}).then(() => {
    console.log('remote site nuked');
    return uploadFiles();
}).catch((err) => {
    console.log(err, 'catch error');
});

function uploadFiles() {
    files = glob.sync('.build/**/*');

    uploadNextItem();
}

function uploadNextItem() {
    if (files === undefined || files.length == 0) {
        sftp.end();
        console.log('site deployed!')
        return;
    }

    var path = files.shift();
    var paths = path.split('/');
    var fileName = paths.pop();
    var isFile = fileName.includes('.');
    var remotePath = '/var/www/monthly.mx/public_html/' + path.replace('.build/', '');

    console.log('uploading ' + path.replace('.build/', ''));

    if (isFile) {
        sftp.fastPut(path, remotePath).then(() => {
            uploadNextItem();
        }).catch((err) => {
            console.log(err, 'catch error');
        });
    } else {
        sftp.mkdir(remotePath, true).then(() => {
            uploadNextItem();
        }).catch((err) => {
            console.log(err, 'catch error');
        });
    }
}