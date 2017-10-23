/**
 * Sample controller
 */
import TestService from '../services/TestService';


export default {
  testMethod,helloWorld,getFiles,uploadFiles,getResults,refresh
};

/**
 * Get test
 * @param {Object} req
 * @param {Object} res
 */
function refresh(){
	var fs= require('fs');
	var path = require('path');
	var fnames=[];
	fnames=fs.readdirSync(path.resolve(__dirname, 'uploads/'));
	for (var i=0; i<fnames.length; i++) {
	fs.unlinkSync(path.resolve(__dirname, 'uploads/'+fnames[i]));
    console.log('successfully deleted file '+path.resolve(__dirname, 'uploads/'+fnames[i]));

}
}
unction translate(fildata,lansrc,langdes){
	var watson = require('watson-developer-cloud');
  var language_translator = watson.language_translator({
  username: '32835e5a-e472-4c16-ab0c-b702f9ca852a',
  password: 'MUG44fhNWSpT',
  url:'https://gateway.watsonplatform.net/language-translator/api/',
  version: 'v2'
});
return new Promise(function(resolve, reject) {
	language_translator.translate({
    text: filedata,
    source: langsrc,
    target: langdes
  }, function(err, translation) {
    if (err)
      console.log(err)
    else
      resolve(translation);
});
});
}
function identifyLanguage(filedata){
	var watson = require('watson-developer-cloud');
var language_translator = watson.language_translator({
  username: '32835e5a-e472-4c16-ab0c-b702f9ca852a',
  password: 'MUG44fhNWSpT',
  url:'https://gateway.watsonplatform.net/language-translator/api/',
  version: 'v2'
});
return new Promise(function(resolve, reject) {
language_translator.identify({ text: filedata},
  function(err, identifiedLanguages) {
    if (err)
      console.log(err)
    else
      resolve(identifiedLanguages);
});
});	
}
function analyzeTone(filedata){
	
	var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
    var tone_analyzer = new ToneAnalyzerV3({
    username: 'cd4e8f70-e70a-4bb5-843c-105aa21b55e5',
    password: 'qm8cDxSAX0a6',
    version_date: '2016-05-19'
});
return new Promise(function(resolve, reject) {

  var params = {
  // Get the text from the JSON file.
   text: filedata,
   tones : 'emotion',
   sentences: false
   };  
   tone_analyzer.tone(params, function(error, tones) {
  if (error)
    console.log('error:', error);
  else
  {//console.log(JSON.stringify(response, null, 2));
   resolve(tones);
  }
  });


});

}
function analyzePersonality(filedata){
	
	var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
   var personality_insights = new PersonalityInsightsV3({
  username: '7c029f0f-8caa-4ace-8e51-223a19113c17',
  password: 'nrwRQz14YOkN',
  version_date: '2016-05-19'
});
return new Promise(function(resolve, reject) {

 var params = {
  // Get the content items from the JSON file.
  text: filedata,
  headers: {
    'accept-language': 'en',
    'accept': 'application/json'
  }
}; 
   personality_insights.profile(params, function(error, profiles) {
  if (error)
    console.log('Error:', error);
  else
    //console.log(JSON.stringify(response, null, 2));
    resolve(profiles);
  }
);


});

}
async function helloWorld(req, res) {
  const result = await TestService.helloWorld();
  console.log("i m here");
  res.json(result);
  
}
/*function readFileContents(dirname){
	var fs=require('fs');
	var path=require('path');
	return new Promise(function(resolve, reject) {
		var fdata=[];
		fs.readdir(path.resolve(__dirname, 'uploads/'), function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
		
		 fs.readFile(path.resolve(path.resolve(__dirname, 'uploads/'), items[i]), 'utf-8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  fdata.push(data);
  resolve(fdata);
  //console.log(filedata); //logs values to the console
  
});
   
    
		}
	
	
}); 
	
	});
} */

async function getResults(req,res){
var fs= require('fs');
var path = require('path');
console.log(JSON.stringify(req.body));
var filedata = [];
var translated_data=[];
var fnames=[];
var blahhh=[];
/*readFileContents(path.resolve(__dirname, 'uploads/'))
.then(function(fdata){
	console.log(fdata); //print all file contents
})
.catch(function(err) {
     console.log(err);
   }); */
fnames=fs.readdirSync(path.resolve(__dirname, 'uploads/'));
for (var i=0; i<fnames.length; i++) {
        console.log(fnames[i]);
		console.log(path.resolve(__dirname, 'uploads/'+fnames[i]));
		filedata.push(fs.readFileSync(path.resolve(__dirname, 'uploads/'+fnames[i]),'utf-8'));
}
console.log(filedata); // filedata is now a array of file contents
/*for (var i=0; i<filedata.length; i++) {
translated_data.push(translate(filedata[i]));
} */
var tpromises=[];
var ppromises=[];
var ilpromises=[];
for(i=0;i<filedata.length;i++)
{
 ilpromises.push(identifyLanguage(filedata[i]));	
}
Promise.all(ilpromises).then(function(identifiedLanguages){
	console.log("done");
	console.log(JSON.Stringify(identifiedLanguages));
});
for(i=0;i<filedata.length;i++)
{ 
 tpromises.push(analyzeTone(filedata[i]));
}
Promise.all(tpromises).then(function(tones) {
    console.log("done");
	return res.json(tones);
	//console.log(response);
	//console.log(JSON.stringify(tones)); //use tones here
	
	
});


/*
for(i=0;i<filedata.length;i++)
{ 
 ppromises.push(analyzePersonality(filedata[i]));
}
Promise.all(ppromises).then(function(profiles) {
    console.log("done");
	
	//console.log(response);
	//console.log(JSON.stringify(profiles)); //use tones here
	
}); 
*/
//personality=analyzePersonality(fildata);
}
/*fs.readdir(path.resolve(__dirname, 'uploads/'), function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
		 fs.readFile(path.resolve(path.resolve(__dirname, 'uploads/'), items[i]), 'utf-8',await function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  filedata.push(data);
  
  //console.log(filedata); //logs values to the console
});
    }
	
}); */
async function uploadFiles(req,res){
var path = require('path');
var formidable = require('formidable');
var form = new formidable.IncomingForm();
var fs = require('fs');
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

}
async function getFiles(req,res) {
  refresh();
  var path = require('path');
  res.sendFile(path.join(__dirname, 'views/index.html'));
}
async function testMethod(req, res) {
  const result = await TestService.testMethod();
  res.json(result);
}
