'use strict';

const { Tabletojson: tabletojson } = require('tabletojson');
const fs = require('fs');
const path = require('path');
const util = require('util')
const cheerio = require('cheerio');
const { ChildProcess } = require('child_process');
const { attr } = require('cheerio/lib/api/attributes');
const internal = require('stream');


// const html = fs.readFileSync(path.resolve(__dirname, 'html/orario.html'), { encoding: 'UTF-8' });
// const converted = tabletojson.convert(html);

// let keys

// let converted1 = converted.slice(1, converted.length - 19)

// converted1.forEach(function(value) {
//     console.log(value[0]);
// });



// console.log(util.inspect((converted[5])));
// fs.writeFileSync('html/tabella.json', JSON.stringify(converted));



let $ = cheerio.load(fs.readFileSync('html/orario_nuovo.html'));

// fs.writeFileSync('html/cheerio.json', util.inspect($('#tableContainer > table > tbody ').toArray()[0]));

// $('#tableContainer > table > tbody ').toArray().map(item => {
//     // if (item.type.toString() == 'text') console.log(item.data);
//     console.log(item.children);
// });


let matricola = 10768054

let giono = '';
let aula = { 'indirizzo': '', 'link': '', 'abbreviazione': '' }
let lezioni = []

let settimana = {}

$('#tableContainer > table > tbody > tr > td ').each(function(index, element) {

    // var year = $(this).attribs;
    // var attributo = year //.attribs.class


    // console.log(element.attribs.class);

    let righeVuote = 0
    let ore, inizio, fine

    if (element.attribs.class == ' data') {
        giorno = $(element).text()
    }
    if (element.attribs.class == 'dove' && element.children.length > 1) {
        // console.log(element.children[1]);

        aula['indirizzo'] = element.children[1].attribs['title']
        aula['link'] = element.children[1].attribs['href'] // presupponendo che sia sempre il secondo child ad avere il <a> 
        aula['abbreviazione'] = element.children[1].firstChild.data.trim()

        // console.log(aula);
    }

    if (element.attribs.class.toString().includes('css_prima_riga')) righeVuote += 15

    if (element.attribs.class.toString().includes('slot')) {

        ore = element.attribs.class.split(" ")[0].charAt(4) // slot3/slot2
            // lezioni.push({ 'corso': $(element).text().split("(dal ").map(riga => { return riga.trim() })[0] })

        // console.log($(element).text().split("(dal ").map(riga => { return riga.trim() })[0]);
        // console.log(element.children[1].children[0]);

        let corso = element.children[1].children[0].data.trim()

        let info = element.children[1].children[0].parent.attribs.title.split("<br>")

        let tipologia = info[1].split("al ")[0].split(" ")[0]

        let squadra = info[1].split("al ")[0].split(" ")[1]

        let inizioSplit = info[1].split("al ")
        inizioSplit.shift()
        let dal = new Date(inizioSplit[0].split("/")[2], inizioSplit[0].split("/")[1], inizioSplit[0].split("/")[0])
        let al = new Date(inizioSplit[1].split("/")[2].substr(0, 4), inizioSplit[1].split("/")[1], inizioSplit[1].split("/")[0])

        // console.log(corso);
        // console.log(tipologia);
        // console.log(squadra)
        // console.log(dal);
        // console.log(al);

        if (matricola % 2 == 0 && parseInt(squadra.charAt(squadra.length)) == 2) {

            lezioni.push({ 'dove': aula, 'corso': corso, 'tipologia': tipologia, 'inizio': dal, 'fine': al })

        } else {

            lezioni.push({ 'dove': aula, 'corso': corso, 'tipologia': tipologia, 'inizio': dal, 'fine': al })

        }

        // console.log(righeVuote);
        // console.log($(element).text().split("lezione").map(riga => { return riga.trim() })[1].split("al").map(data => { if (data.includes('/')) return data }));


        // console.log('\n\n*****************************\n\n');
        console.log(lezioni);
        // process.exit(1);


    }


});