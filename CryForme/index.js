var datafile =require ('./webscript-manga.js');
var WebScriptForAsuras=require('./webscript-asurascans.js')
var wait_More_Time = 1000;
var wait_More_Time_V2 = 2000;
const fs = require('fs');
async function chk_fn(){
  console.log('Started Reading')
  datafile();
     
    clearInterval(chkh);
    wait_More_Time=1 * 60 * 1000 * 60
    chkh = setInterval(chk_fn, wait_More_Time);
  }

  async function AsuraScansNow(){
    console.log('Started Reading From Asura Scans')
    WebScriptForAsuras()
    clearInterval(Asurascans);
    wait_More_Time_V2=1 * 60 * 1000 * 60
    Asurascans = setInterval(chk_fn, wait_More_Time_V2);
  }
  
  var Asurascans=setInterval(AsuraScansNow, wait_More_Time_V2);
  var chkh = setInterval(chk_fn, wait_More_Time);



var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
const date = new Date();
const timestamp = date.getTime();
var ws = fs.createWriteStream(`logs/${today.toLocaleDateString("en-US",options)}.log`, { 
    'flags'   : 'w',
    'encoding': 'utf8',
    'mode'    : 0666,
});
process.stdout.wr = process.stdout.write;
process.stdout.er = process.stderr.write;
process.stdout.write = function(mes, c) {
    ws.write(mes + '\r\n');
    process.stdout.wr(mes, c)   
};
process.stderr.write = function(mes, c) {
    ws.write(mes + '\r\n');
    process.stdout.er(mes, c)   
};
