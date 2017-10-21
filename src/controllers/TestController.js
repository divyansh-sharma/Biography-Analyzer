/**
 * Sample controller
 */
import TestService from '../services/TestService';


export default {
  testMethod,helloWorld,getFiles,uploadFiles,getResults
};

/**
 * Get test
 * @param {Object} req
 * @param {Object} res
 */
async function helloWorld(req, res) {
  const result = await TestService.helloWorld();
  console.log("i m here");
  res.json(result);
  
}

async function getResults(req,res){
var fs= require('fs');
var path = require('path');
console.log(JSON.stringify(req.body));
var filedata = [];

fs.readdir(path.resolve(__dirname, 'uploads/'), function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
		fs.readFile(path.resolve(path.resolve(__dirname, 'uploads/'), items[i]), 'utf-8',function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  filedata.push(data);
  
  //console.log(filedata); //logs values to the console
});
    }
	
});
console.log(filedata); //empty array,i want file data here for further processing

}
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
  var path = require('path');
  res.sendFile(path.join(__dirname, 'views/index.html'));
}
async function testMethod(req, res) {
  const result = await TestService.testMethod();
  res.json(result);
}
