const commands = require("commands")
const uxp = require('uxp');
const fs2 = require("uxp").storage.localFileSystem;
const fs = require("uxp").storage.formats.binary;
const {Rectangle, Color} = require("scenegraph"); 
const { ImageFill } = require("scenegraph");
// const aFile = fs.getFileForOpening({types:["png"]});
// const userFolder =  fs.getFolder();  // folder picker
// const aFile =  fs.getFileForOpening();
// const anotherFile = fs.getFileForSaving("hello.txt"); 

 // const tempFolder =  fs2.getTemporaryFolder();
// const pluginFolder =  fs.getPluginFolder();
// const pluginDataFolder = fs.getDataFolder();


function xhrBinary(url) {                                       // [1]
    return new Promise((resolve, reject) => {                   // [2]
        const req = new XMLHttpRequest();                       // [3]
        req.onload = () => {
            if (req.status === 200) {
                try {
                    const arr = new Uint8Array(req.response);   // [4]
                    resolve(arr);                               // [5]
                } catch (err) {
                    reject(`Couldnt parse response. ${err.message}, ${req.response}`);
                }
            } else {
                reject(`Request had an error: ${req.status}`);
            }
        }
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = "arraybuffer";                       // [6]
        req.send();
    });
}


function applyImagefill(selection, file) {                             // [1]
    const imageFill = new ImageFill(file);                             // [2]
    selection.items[0].fill = imageFill;                               // [3]
}

async function downloadImage(selection, jsonResponse) {


	try {
        const photoUrl = jsonResponse.urls.regular;
        await console.log(photoUrl)                                     // [2]
        const photoObj = await xhrBinary(photoUrl);                                // [3]
        const tempFolder = await fs2.getTemporaryFolder();                          // [4]
        const tempFile = await tempFolder.createFile("tmp",{'overwrite': 'true'});  // [5]
        // selection.items[0].fill = new ImageFill(tempFile)
        await tempFile.write(photoObj);            // [6]
        applyImagefill(selection, tempFile);                                       // [7]
    } catch (err) {
        console.log("erroraa")
        console.log(err.message);
    }

}


function applyImage(selection) {
    if (selection.items.length) {                                   // [1]
        // const url = "https://dog.ceo/api/breeds/image/random";      // [2]
        const url = "https://api.unsplash.com/photos/random/?client_id=aa680189197e0e6e6d4360482f287914d12990d2340d348d2882bc4cebd18950"
        return fetch(url)                                           // [3]
            .then(function (response) {
                return response.json();                             // [4]
            })
            .then(function (jsonResponse) {
                return downloadImage(selection, jsonResponse);      // [5]
            });
    } else {
        console.log("Please select a shape to apply the downloaded image.");
    }
}

module.exports = {
    commands: {
    	photoGraber:applyImage,
    }
};