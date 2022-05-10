const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');
const e = require('express');
const { exit } = require('process');
const chalk = require('chalk');
chalk.level = 1;
const error = chalk.bold.red;
const warning = chalk.hex('#FFA500');
const GoodTogo=chalk.bold.green;
const Public_dir = '../backend(data)/manga-reader'
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
var arr=[];
async function getPriceFeed() {
    try {
        const siteUrl = 'https://www.asurascans.com/manga/?order=update'

        const { data } = await axios({
            method: 'GET',
            url: siteUrl,
        })
        const $ = cheerio.load(data)
        for(let i=1;i<20;i++){
            arr.push($(`div.bs:nth-child(${i}) > div:nth-child(1)`).html().match(/href="([^"]*)/)[1])
            }
        return arr;
    } catch (e) {
        if(e.response && e.response.status === 503){
            console.log(error('Something Went Wrong In Server sadly'))
        }
        else {
            console.log(error('Getting First Href :'+e))
        }
    }
}

async function writeToFile(value, link, chaptersNames, chapter_links, pagesLink, picturelink, geners, ReadingDirection, Author, Status, YearOfRealease,AlternativeNames,DescriptionGet) {
    const dir1 = Public_dir
    if (!fs.existsSync(dir1)) {
        fs.mkdirSync(dir1, { recursive: true });
    }
    const dir2 = `${dir1}/${ value.trim() }.json `
    let CombinedData = []
    const keys = [{
        'NameofManga': value.trim(),
        'linktoManga': link,
        'Geners': geners,
        'Picturelink': picturelink,
        'ReadingDirection': ReadingDirection,
        'Author': Author,
        'Status': Status,
        'YearofRelease': YearOfRealease,
        'Description':DescriptionGet,
        'AlternativeNames':AlternativeNames
    }]
    CombinedData.push(keys)
    chaptersNames.forEach(function(chapterName, index2) {
            const keys = [{
                'chaptersName': chapterName.trim(),
                'chapterslink': chapter_links[index2],
                'pagesLink': pagesLink[index2],
            }]
            CombinedData.push(keys)
        })
        //write to a file
    if (fs.existsSync(dir2)) { //does
        fs.readFile(dir2, 'utf8', (err, jsonString) => {
            if (err) {
                console.log(error("Error reading file from disk:", err))
                return
            }
            try {
                const customer = JSON.parse(jsonString)
                if (Object.keys(customer).length < Object.keys(CombinedData).length) {
                    let data = JSON.stringify(CombinedData);
                    fs.writeFileSync(dir2, data);
                    console.log(GoodTogo('Finished Transfering Links to File', `${value.trim()}`))
                } else {
                    console.log(GoodTogo('Already Upadted', `${ value.trim() }`))
                }
            } catch (err) {
                console.log(error('Error parsing JSON string:', err))
            }
        })
    } else {
        let data = JSON.stringify(CombinedData);
        fs.writeFileSync(`${Public_dir}/${ value.trim().replace('?', '').replace('!', '') }.json`, data);
        console.log(GoodTogo('Finished Transfering Links to File', `${ value.trim() }`))
    }

}

async function imhere2(obj2, arr_name, link, ReadingDirection, Author, Status, YearOfRealease,AlternativeNames,DescriptionGet){
    let links_pages = {} //obj
    let y = 0;
    const dir2 = `${Public_dir}/${arr_name.trim()}`
    var StopNow=false;
    console.log(GoodTogo('Getting all the links From Auras Scans', arr_name.trim()))
    if (fs.existsSync(dir2)) { //does
        fs.readFile(dir2, 'utf8', (err, jsonString) => {
            if (err) {
                console.log(error("Error reading file from disk:", err))
                return
            }
            try {
                const customer = JSON.parse(jsonString)
                if (Object.keys(customer).length >= obj2['1'].length) {
                    console.log(GoodTogo('Faster'))
                    StopNow=true;
                    return;
                }
            } catch (err) {
                console.log(error('Error parsing JSON string:', err))
            }
        })
    }
    if(!StopNow) {
            for (const chapter_link of obj2['1']) {
                try{

                    const { data } = await axios({
                        method: 'GET',
                        url: chapter_link,
                    })
                    const $3 = cheerio.load(data);
                    function getImages(string) {
                        const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
                        const images = [];
                          let img;
                          while ((img = imgRex.exec(string))) {
                               images.push(img[1]);
                          }
                        return images;
                      }
                      
                   let src_list=(getImages($3('#readerarea').html()))
                   var index = src_list.indexOf('https://www.asurascans.com/wp-content/uploads/2021/04/page100-10.jpg');
                    if (index !== -1) {
                        src_list.splice(index, 1);
                    }
                   links_pages[y] = src_list

                   y++;

                } catch (error2) { 
                    if(error2.response.status === 503){
                        console.log(error('Stopped / Server Down'))
                    } else {
                    console.log(error('there an error in pages \n', error2))
                    }
                }
        }
    }
    await writeToFile(arr_name.trim(), link, obj2[0], obj2[1], links_pages, obj2[2], obj2[3], ReadingDirection, Author, Status, YearOfRealease,AlternativeNames , DescriptionGet)
}
module.exports = async function() {
    let hello = getPriceFeed()
    hello.then(async function okwaiting(links){
        try{
            links.map((link,index)=>{
                setTimeout(async ()=>{
                    const { data } = await axios({
                        method: 'GET',
                        url: link,
                    })
                    console.log(GoodTogo('getting Links From Asura Scans'))
                    const $2 = cheerio.load(data);
                    const NameofManga=($2('.entry-title').html())
                   const Status=($2('div.imptdt:nth-child(1) > i:nth-child(1)').html())
                   const Description=($2(`.entry-content > p`).html());
                   const Author=$2('div.flex-wrap:nth-child(5) > div:nth-child(1) > span:nth-child(2)').html();
                   
                   const src=$2('.thumb').html().match(/src="([^"]*)/)[1]
                   var YearOfRealease='';
                   if($2('div.flex-wrap:nth-child(7) > div:nth-child(1) > span:nth-child(2) > time:nth-child(1)').html() !== null){
                        YearOfRealease=$2('div.flex-wrap:nth-child(7) > div:nth-child(1) > span:nth-child(2) > time:nth-child(1)').html()
                   }
                   let i=1;
                   var geners=[];
                   var ele;
                   while(ele !==null){
                       ele=$2(`.mgen > a:nth-child(${i})`).html()
                       i++;
                       if(ele !==null){
                           geners.push(ele)
                       }
                    }
                    ele='';
                    var ele2='';
                    i=1;
                    var Chapter_Links=[],Chapter_names=[];
                    while(ele !==null){
                        ele=$2(`.clstyle > li:nth-child(${i}) > div > div`).html()
                        ele2=$2(`.clstyle > li:nth-child(${i}) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > span:nth-child(1)`).html()
                        if(ele !==null){
                            Chapter_Links.push(ele.match(/href="([^"]*)/)[1])
                            Chapter_names.push(ele2)
                        }
                        i++;
                    }
                    let obj2 = {
                        '0': Chapter_names.reverse(),
                        '1': Chapter_Links.reverse(),
                        '2': src ,
                        '3': geners,
                    }
                    await imhere2(obj2, NameofManga, link, '', Author, Status, YearOfRealease,'',Description)
                    await console.log(GoodTogo('moving to next Manga'))
                },5000)
            })  
        }catch(error2){
            if(error2.response && error2.response.status === 503){
                console.log(error('Something Went Wrong In Server sadly'))
            }
            else {
                console.log(error('Getting First links :'+error2))
            }
        }
    })
}