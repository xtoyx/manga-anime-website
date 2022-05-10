const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { Console } = require('console');
const e = require('express');
const { exit } = require('process');
const chalk = require('chalk');
let obj = []
let links = []
let i = true;
const arr = []
const arr_names = []
let DontRemuse=false;
chalk.level = 1;
const error = chalk.bold.red;
const warning = chalk.hex('#FFA500');
const GoodTogo=chalk.bold.green;
const Public_dir = '../backend(data)/manga-reader'
    

const notworkingfornow=()=>{
    let FilesWithNames=[];
        if (fs.existsSync(Public_dir)) {
            var files = fs.readdirSync(Public_dir);
                for (let i = 0; i < files.length; i++) {
                    try {
                        fs.readFile(`${Public_dir}/${files[i]}`, 'utf8', (err, jsonString) => {
                            if (err) {
                                console.log("Error reading file from disk:", err)
                                return
                            }
                            let data2 = JSON.parse(jsonString)
                            let array1 = {
                                name: files[i].trim().replace('.json', ''),
                                data: data2,
                            }
                            FilesWithNames.push(array1.name)
                        })
                    } catch (err) {
                        console.log('Error parsing JSON string:', err)
                    }
                }
                console.log('Done reading from files')
        }
        console.log(FilesWithNames)
}

async function getPriceFeed() {
    try {
        const siteUrl = 'https://mangareader.tv/'

        const { data } = await axios({
            method: 'GET',
            url: siteUrl,
        })
       
        const $ = cheerio.load(data)
        for (let i = 3; i < 56; i++) {
            let elemSelect = `div.d47:nth-child(${i}) > div:nth-child(2) > div:nth-child(1)`
            var html = $(elemSelect).html()
            var $2 = cheerio.load(html)
            arr.push(html)
            var str = $2(html).text()
            str = str.replace(/%/gi, '')
            arr_names.push(str)
        }
        arr.map(item => {
            var href = item.match(/href="([^"]*)/)[1]; // this get the href
            links.push(`${siteUrl}${href}`)

        })
        return links;

    } catch (e) {
        if(error.response && error.response.status === 503){
            console.log(error('Something Went Wrong In Server sadly'))
        }
        else {
            console.log(error('Getting First Href :'+e))
        }
    }
}
const downloadFile = async(fileUrl, NameofMange, y, i) => {
    const dir1 = Public_dir
    NameofMange = NameofMange.trim()
    const dir2 = `${dir1}/${NameofMange}`
    const dir3 = `${dir2}/chapter-${y}`
    if (!fs.existsSync(dir3)) {
        fs.mkdirSync(dir3, { recursive: true });
    }
    try {
        //does exist
        if (!fs.existsSync(`./${dir3}/${i}.jpg`)) {
            const response = await fetch(fileUrl);
            const buffer = await response.buffer();
            fs.writeFile(`./${dir3}/${i}.jpg`, buffer, () =>
                console.log(GoodTogo('finished downloading! Page', i)));
        } else {
            console.log(warning('Aleardy downloading! Page', i));
        }
    } catch (error2) { console.log(error('error', error2)) }

};

async function GetDescription(name) {
    try {

       let nameu = name.trim().replace(/\s/g, "_")
        const siteUrl = `https://manganato.com/search/story/${nameu}`
    
        const { data } = await axios({
            method: 'GET',
            url: siteUrl,
        })
        const $5 = cheerio.load(data)
        let nameequeal = $5('.item-right >h3 > a').html()
        if(nameequeal === name.trim()){
            let reflinka = $5('.item-right > h3').html().match(/href="([^"]*)/)[1]
            const {data} = await axios({
                method: 'GET',
                url: reflinka,
            })
            const $6 = cheerio.load(data)
            const DescriptionGet =$6('.panel-story-info-description').html().replace('<h3>Description :</h3>','').trim();
            return DescriptionGet;
        }
    }catch (error2) {
        if(error2.response.status === 400){
            console.log(error('not allowed'))
        } else {
            console.log(error('error', error2));
        }
    }
}

async function imhere2(obj2, arr_name, link, ReadingDirection, Author, Status, YearOfRealease,AlternativeNames,DescriptionGet) {
    let links_pages = {} //obj
    let y = 0;
    var stopWriting=false;
    const dir2 = `${Public_dir}/${arr_name.trim()}`
        // remove it if u want to put it all in A File Warning (File Will Be too big alot of time to get The links )
        console.log(GoodTogo('Getting all the links ', arr_name.trim()))
        if (fs.existsSync(dir2)) { //does
            fs.readFile(dir2, 'utf8', (err, jsonString) => {
                if (err) {
                    console.log(error("Error reading file from disk:", err))
                    return
                }
                try {
                    const customer = JSON.parse(jsonString)
                    if (Object.keys(customer).length === obj2['1'].length) {
                        console.log(goodTogo('Faster'))
                        stopWriting=true;
                        return;
                    }
                } catch (err) {
                    console.log(error('Error parsing JSON string:', err))
                }
            })
        }
        if(!stopWriting){
            for (const chapter_link of obj2['1']) {
                try {
                    const { data } = await axios({
                        method: 'GET',
                        url: chapter_link,
                    })
                    const $4 = cheerio.load(data)
                    let count_2 = `div.mI`
                    let count_pages = $4(count_2).length // How Many Pages
                    let src_list = [] //array
                    for (let i = 1; i < count_pages + 1; i++) {
                        let page_url_38 = $4(`div.mI:nth-child(${ i })`).html()
                        var src = page_url_38.match(/data-src="([^"]*)/)[1]; // this get the href
                        // let hello213=await downloadFile(src,arr_name,y,i) to download stuff * if you like to
                        src_list.push(src)
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
            await writeToFile(arr_name, link, obj2['0'], obj2['1'], links_pages, obj2['2'], obj2['3'], ReadingDirection, Author, Status, YearOfRealease,AlternativeNames , DescriptionGet)
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



module.exports = async function() {
    let hello = getPriceFeed()
    hello.then(async function helloim(links) {
        for (const link of links) {
            try {
                    const siteUrl = 'https://mangareader.tv/'
                    const { data } = await axios({
                        method: 'GET',
                        url: link,
                    })
                    console.log(GoodTogo('getting Links From Manga'))
                    const $3 = cheerio.load(data)
                    let count_1 = `.d48 > tbody:nth-child(1) > tr > td > i `
                    let count_chapters = $3(count_1).length
                    let chapter_names = []
                    let chapter_links = []
                    let img_where = '.d38'
                    let ReadingDirection, Author, Status, YearOfRealease,AlternativeNames = '';
                    let someExtraStuff = `.d41 > tbody > tr > td`
                    let howmanyisthereforExtraStuff = $3(someExtraStuff).html().length;
                    for (let i123 = 2; i123 <= howmanyisthereforExtraStuff; i123++) {
                        someExtraStuff = `.d41 > tbody > tr:nth-child(${ i123 }) > td:nth-child(2)`
                        if(i123 === 2){
                            AlternativeNames=$3(someExtraStuff).html().split(';')
                        } else if (i123 === 3) {
                            YearOfRealease = $3(someExtraStuff).html()
                        } else if (i123 === 4) {
                            Status = $3(someExtraStuff).html()
                        } else if (i123 === 5) {
                            Author = $3(someExtraStuff).html().replace(/\s/g, "")
                        } else if (i123 === 6) {
                            ReadingDirection = $3(someExtraStuff).html()
                        }
                    }
                    let somewhere_image = $3(img_where).html().match(/src="([^"]*)/)[1]
                    let genres_where = `a.d42 `
                    let genre_count = $3(genres_where).html().length
                    var geners = []
                    for (let i = 1; i < genre_count; i++) {
                        let genres_where1 = `a.d42:nth-child(${ i })`
                        geners.push($3(genres_where1).html())
                    }
                    for (var i = 2; i < count_chapters + 2; i++) {
                        let chapter_name = `.d48 > tbody:nth-child(1) > tr:nth-child(${ i }) > td:nth-child(1) > a `
                        var mmm = $3(chapter_name).html()
                        let chapters_link = `.d48 > tbody:nth-child(1) > tr:nth-child(${i}) > td:nth-child(1)`
                        var html = $3(chapters_link).html()
                        var href = html.match(/href="([^"]*)/)[1]; // this get the href
                        chapter_names.push(mmm) // for name of chapter
                        chapter_links.push(`${siteUrl}${ href }`)
                            //for link of chapter        
                    }
                    let obj2 = {
                        '0': chapter_names,
                        '1': chapter_links,
                        '2': siteUrl + somewhere_image, //this pic of manga
                        '3': geners,
                    }
                    const DescriptionGet=await GetDescription(arr_names[links.indexOf(link)])
                    if(DescriptionGet !== undefined) {
                            await imhere2(obj2, arr_names[links.indexOf(link)], link, ReadingDirection, Author, Status, YearOfRealease,AlternativeNames,DescriptionGet)
                            await console.log(GoodTogo('moving to next Manga'))
                    } else {
                        await imhere2(obj2, arr_names[links.indexOf(link)], link, ReadingDirection, Author, Status, YearOfRealease,AlternativeNames,'')
                        await console.log(GoodTogo('moving to next Manga'))
                    }
            } catch (error2) {
                if(error.response && error2.response.status === 503){
                    console.log(error('Stopped / Server Down'))
                } else {
                    console.log(error('there an error in chapters \n', error2))
                }
            }
        }
    })
};