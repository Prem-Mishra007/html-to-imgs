const express = require('express');
const app = express();
const Handlebars=require('handlebars')
const bodyParser=require('body-parser');
const path = require('path');
const fs=require('fs')
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];
const {Cluster}= require('puppeteer-cluster');
(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 1,
        puppeteerOptions:{
            headless: true,
            userDataDir: './userData',
            args: minimal_args
        }
    });
    await cluster.task(async ({ page, data: data }) => {
        var sTime=Date.now()
        // const htmlContent=(Buffer.from(data.html,'base64')).toString('ascii');
        // const cssContent=(Buffer.from(data.css,'base64')).toString('ascii');
        const templateStr = fs.readFileSync(path.resolve(__dirname+'/templates/handlebar', data.template+'.hbs')).toString('utf8')
 
        var eTime=Date.now()
        console.log(`Decoding Time= ${eTime-sTime} `)
        const content=data.content;
        var sTime=Date.now();
        const template = Handlebars.compile(templateStr, { noEscape: true })
        const pageContent=template(content);
        var eTime=Date.now()
        console.log(`Compilation Time= ${eTime-sTime} `)
        page.setViewport({
            width:1080,
            height:1920,
            deviceScaleFactor:1
        })
        var sTime=Date.now();
        await page.setContent(pageContent);
        const cssPath=path.resolve(__dirname+'/templates/css',data.template+'.css')
        // const cssStr = fs.readFileSync(path.resolve(__dirname+'/templates/css', 'temp1.css')).toString('utf8')
 
        // await page.addStyleTag({content:cssStr});
        await page.addStyleTag({path:cssPath})
        var eTime=Date.now()
        console.log(`Page Loading Time= ${eTime-sTime} `)
        //await page.addStyleTag({path:"public/css/bio.css"});
        const randId = Math.floor(Math.random() * 1000000);
        const pathName=randId+'.jpeg';
        var sTime=Date.now();
        const screen = await page.screenshot({path: pathName,fullPage:true});
        var eTime=Date.now()
        console.log(`SS Time= ${eTime-sTime} `)
        return screen;
    });
    app.post('/getSS', async function (req, res) {
        const data = req.body.data;
        if (!data) {
            return res.end('Please specify url like this: ?url=example.com');
        }
        try {
            var sTime=Date.now();
            const screen = await cluster.execute(data);
            var eTime=Date.now()
            console.log(`Total SS Time= ${eTime-sTime} `)
            // respond with image
            res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': screen.length
            });
            res.end(screen);
        } catch (err) {
            // catch error
            res.end('Error: ' + err.message);
        }
    });

    app.listen(port, function () {
        console.log(`Screenshot server listening on port ${port}.`);
    });
})();