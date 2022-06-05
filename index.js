const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const qrcodeTerminal = require('qrcode-terminal');
var ffmpeg = require('fluent-ffmpeg');
const { Client, LegacySessionAuth, RemoteAuth } = require('whatsapp-web.js');
const express = require('express')
const app = express()
const configs = require("./config");
const { MessageMedia } = require('whatsapp-web.js');
let qrcode = require('qrcode');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

//"whatsapp-web.js": "^1.16.4"

var sessionData;

const url = 'https://www.manoramaonline.com/';


var grps = configs.wa_grp_id.split(',');
var mgrps = configs.m_wa_grp_id.split(',');

var Full_News = '';
var Full_News_M = '';
var Heading = '';
var Heading_M = '';
var ImgLink = '';
var ImgLink_M = '';


//var client;

//if(configs.session != ''){
//	client = new Client({
//    	puppeteer: { headless: true, args: ['--no-sandbox'], },
//	authStrategy: new LegacySessionAuth({
//		session: JSON.parse(configs.session)
//	}),
//    	ffmpegPath: require('@ffmpeg-installer/ffmpeg').path
// });
//}else {
//	client = new Client({
//	    	puppeteer: { headless: true, args: ['--no-sandbox'], },
//		authStrategy: new LegacySessionAuth(),
//	    	ffmpegPath: require('@ffmpeg-installer/ffmpeg').path
//	 });
//}

mongoose.connect(configs.mogodb_uri).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
		puppeteer: { headless: true, args: ['--no-sandbox'], },
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncMs: 300000
        })
    });


var final_session;

app.get('/', (req, res) => {
	console.log(`Click Open App or Go here: http://${configs.app_name}.herokuapp.com/  \nAnd scan QR code on your WhatsApp web\nIf you already done this, then ignore it.`)
	client.on('qr', qrCode => {
		qrcodeTerminal.generate(qrCode, {small: true});
		console.log(`Click Open App or Go here: http://${configs.app_name}.herokuapp.com/  \nAnd scan QR code on your WhatsApp web.\nIf you already done this, then ignore it.`)
		var code = qr.image(qrCode, { type: 'svg' });
	  	res.type('svg');
	  	code.pipe(res);
	});
});

client.on('authenticated', (session) => {
    sessionData = session;
    console.log(JSON.stringify(session));
	final_session = JSON.stringify(session);
	fs.writeFile('session.json', final_session, 'utf8', function (){console.log("Json Created")});
});

client.on("auth_failure", () => {
	console.error(
		  "There is a problem in authentication, please re-enter session and try again."
	);
  });

client.on('ready', () => {
	    console.log('Client is ready!');
    let info = client.info;
    let num = info['me']['user']+'@s.whatsapp.net';
	    client.sendMessage(num, "*Bot Started*");
	client.sendMessage(num, final_session);
	client.sendMessage(num, "*Copy Above code and past it in heroku SESSION field*");
});
	

client.initialize();

client.on('message', async message => {
	console.log(message.from);
	await scrapNews('https://www.manoramaonline.com/');
	await scrapNewsMangalamFull('https://www.mangalam.com/');
	if (Full_News != '') {
		var finalImage = ImgLink;
		var finalNews = Full_News;
		const mediaNews = await MessageMedia.fromUrl(finalImage);
		for (var i = 0; i < grps.length; i++) {
			await client.sendMessage(grps[i], mediaNews, { caption: finalNews })
		}
		Full_News = '';
		ImgLink = '';
		finalNews = '';
	}else {
		client.sendMessage(configs.log_grp, "No Manorama News");
	}

	//Mangalam
	if (Full_News_M != '') {
		var finalImage = ImgLink_M;
		var finalNews = Full_News_M;
		const mediaNews = await MessageMedia.fromUrl(finalImage);
		for (var i = 0; i < mgrps.length; i++) {
			await client.sendMessage(mgrps[i], mediaNews, { caption: finalNews })
		}
		Full_News_M = '';
		ImgLink_M = '';
		finalNews = '';
	}else {
		client.sendMessage(configs.log_grp, "No Mangalam News");
	}
});

});





  async function scrapNews(url){
	var newsHead;
	var newsBody;
	var pageLink;
	var newsImage;
	axios(url).then(async response => {
		const html = response.data;
		const $ = cheerio.load(html);
		var newses = [];
		var imgs = [];
		$('.image-block', html).each(function() {
			var imglink = $(this).find('a').find('img').attr('data-src-mobile');

			imgs.push({
				imglink: imglink
			});
		});
		$('.content-ml-001', html).each(function() {
			var heading = $(this).find('a').attr('title');
			var short = $(this).text();
			var link = $(this).find('a').attr('href');

			newses.push({
				heading: heading,
				short: short,
				link: link
			});
		});
		newsHead = await newses[0].heading.trimStart();
		newsBody = await newses[0].short.trimStart();
		pageLink = await newses[0].link;
		newsImage = await imgs[0].imglink;

		if(Heading == newsHead){
			console.log('No new news');
			Full_News = '';
			ImgLink = '';
		}
		else{
			FullNews = `*${newsHead}* \n\n_${configs.wa_grp}_\n\n_${newsBody}_ \n_Read More:_\n_${pageLink}_`;
			ImgLink = newsImage;
			Heading = newsHead;
			Full_News = FullNews;
		}
	});
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}




app.get('/news-api', (req, res) => {
	axios(url).then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		var newses = [];
		$('.content-ml-001', html).each(function() {
			heading = $(this).find('a').attr('title');
			short = $(this).text().trimStart();
			link = $(this).find('a').attr('href');

			newses.push({
				heading: heading,
				short: short,
				link: link
			});
		});
		console.log(newses[0]);
		var fNewses = [];
		for(var i = 0; i < 5; i++) {
			fNewses.push({
				heading: newses[i].heading,
				short: newses[i].short,
				link: newses[i].link
			});
		}
		res.json(fNewses);
		
	});
	
})
console.log(`Server News API: http://${configs.app_name}.herokuapp.com/news-api`)

app.get('/news', (req, res) => {
	res.sendFile('index.html', { root: '.' });
})
app.listen(process.env.PORT || 5000, () => {console.log(`Server Running Port: http://${configs.app_name}.herokuapp.com/`)})

//Mangalam

async function scrapNewsMangalamFull(url){
	var Full_News_LINK;
	var newsHead;
	axios(url).then(async response => {
		const html = response.data;
		const $ = cheerio.load(html);

		$('.col-md-6.recent-news', html).each(function() {
			link = $(this).find('a').find('h3').parent().attr('href');
			Full_News_LINK = 'https://www.mangalam.com' + link;
			
		});


		$('.col-md-6.recent-news', html).each(function() {
			var heading = $(this).find('a').find('h3').text();
			newsHead = heading;
		});

		if(Heading_M == newsHead){
			console.log('Skipped');
		}else{
			Heading_M = newsHead;
			scrapNewsMangalamDetail(Full_News_LINK);
		}
	})
}


async function scrapNewsMangalamDetail(url){

	var newses = [];

	axios(url).then(async response => {
		const html = response.data;
		const $ = cheerio.load(html);
		$('.col-md-9.col-md-push-3', html).each(function() {
			var image = $(this).find('img').attr('src');
			var heading = $(this).find('h1').text();
			var detail = $(this).find('p').text();

			newses.push({
				heading: heading,
				short: detail,
				link: image
			});
		});

		var Heading_local = await newses[0].heading;
		var Detail_local = await newses[0].short;
		ImgLink_M = await newses[0].link;

		Full_News_M = `*${Heading_local}* \n\n_${configs.wa_grp_m}_\n\n_${Detail_local}_`;
		
	})
}