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
	var dir=path.resolve(__dirname, 'uploads');
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
	var fnames=[];
	fnames=fs.readdirSync(path.resolve(__dirname, 'uploads/'));
	for (var i=0; i<fnames.length; i++) {
	fs.unlinkSync(path.resolve(__dirname, 'uploads/'+fnames[i]));
    //console.log('successfully deleted file '+path.resolve(__dirname, 'uploads/'+fnames[i]));

}
}
function translate(filedata,langsrc,langdes){
	var watson = require('watson-developer-cloud');
  var language_translator = watson.language_translator({
  username: '<your-username>',
  password: '<your-password>',
  url:'https://gateway.watsonplatform.net/language-translator/api/',
  version: 'v2'
});
return new Promise(function(resolve, reject) {
	if(langsrc=='en')
		resolve({
  translations: [{
    translation: filedata
  }],
  word_count: null,
  character_count: null
});
	else
	{
	language_translator.translate({
    text: filedata,
    source: langsrc,
    target: langdes
  }, function(err, translation) {
    if (err)
      console.log(err)
    else
	{  //console.log(translation);
		resolve(translation);}
});
} //else over
});
}
function identifyLanguage(filedata){
	var watson = require('watson-developer-cloud');
var language_translator = watson.language_translator({
 username: '<your-username>',
  password: '<your-password>',
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
  username: '<your-username>',
  password: '<your-password>',
    version_date: '2016-05-19'
});
return new Promise(function(resolve, reject) {

  var params = {
  // Get the text from the JSON file.
   text: filedata,
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
 username: '<your-username>',
  password: '<your-password>',
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
/*readFileContents(path.resolve(__dirname, 'uploads/'))
.then(function(fdata){
	console.log(fdata); //print all file contents
})
.catch(function(err) {
     console.log(err);
   }); */
   /*for (var i=0; i<filedata.length; i++) {
translated_data.push(translate(filedata[i]));
} */
async function getInsights(req,callback){
var fs= require('fs');
var path = require('path');
var dir=path.resolve(__dirname, 'saved');
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.writeFile(path.resolve(__dirname, 'saved/keywords.json'), JSON.stringify(req.body,null,3),'utf8', (err) => {
			if (err) throw err;
			//console.log('The file keywords has been saved!');
				});
var filedata = [];
var fnames=[];  
fnames=fs.readdirSync(path.resolve(__dirname, 'uploads/'));
for (var i=0; i<fnames.length; i++) {
        //console.log(fnames[i]);
		//console.log(path.resolve(__dirname, 'uploads/'+fnames[i]));
		filedata.push(fs.readFileSync(path.resolve(__dirname, 'uploads/'+fnames[i]),'utf-8'));
}
//console.log(filedata); // filedata is now a array of file contents
//console.log(filedata);
var ilpromises=[];
for(i=0;i<filedata.length;i++)
{
 ilpromises.push(identifyLanguage(filedata[i]));	
}
Promise.all(ilpromises).then(function(identifiedLanguages){
	//console.log("done");
	//console.log(JSON.stringify(identifiedLanguages));
	
	var total=identifiedLanguages.length;
	//console.log(total);
	var recognisedLang=[];
	for(var j=0;j<total;j++)
	 recognisedLang.push(identifiedLanguages[j].languages[0].language);
	//identified_lang_obj.languages[]
	return recognisedLang;
	}).then(function(recognisedLang){
		//console.log(recognisedLang);
		var tlpromises=[];
		for(i=0;i<recognisedLang.length;i++)
			tlpromises.push(translate(filedata[i],recognisedLang[i],'en'));	
		Promise.all(tlpromises).then(function(translation){
			var total=translation.length;
			//console.log(total);
			var translated_data=[];
			for(var j=0;j<total;j++)
				translated_data.push(translation[j].translations[0].translation);
			return translated_data;
		}).then(function(translated_data){
			//console.log(translated_data);
			var total_trans_data=[];
			for(var loop=0;loop<translated_data.length;loop++)
			{
				total_trans_data.push(translated_data[loop]);
			}
			fs.writeFileSync(path.resolve(__dirname, 'saved/translated_data.txt'), total_trans_data.join(),'utf8');
			var tpromises=[];
			for(var i=0;i<translated_data.length;i++) 
				tpromises.push(analyzeTone(translated_data[i]));
			Promise.all(tpromises).then(function(tones) {
			//console.log(JSON.stringify(tones,null,3));
			fs.writeFile(path.resolve(__dirname, 'saved/tones.json'), JSON.stringify(tones,null,3),'utf8', (err) => {
			if (err) throw err;
			//console.log('The file tones has been saved!');
			callback();
				});
			});
			//will run parallelly ???
			var ppromises=[];
			for(var i=0;i<translated_data.length;i++) 
				ppromises.push(analyzePersonality(translated_data[i]));
			Promise.all(ppromises).then(function(profiles) {
			//console.log(JSON.stringify(profiles,null,3));
			fs.writeFile(path.resolve(__dirname, 'saved/profiles.json'), JSON.stringify(profiles,null,3),'utf8', (err) => {
			if (err) throw err;
			//console.log('The file profiles has been saved!');
				});
			});
			
		  });
		  
	});	

}
/*
we want function 2 to only start when 1 has finished,callback means after you are done your async things call this callback function
so here after function 1 does all the async things and we call the callback,it will call the function2
$('a.button').click(function(){
    if (condition == 'true'){
        function1(someVariable, function() {
          function2(someOtherVariable);
        });
    }
    else {
        doThis(someVariable);
    }
});


function function1(param, callback) {
  ...do stuff
  callback();
} 
*/
async function wrapper(req)
{
return new Promise(function(resolve,reject){
	getInsights(req,function(){ //we want getinsights to finish before it moves to inside function
	var fs= require('fs');
	var path = require('path');
	//console.log("i mhere");
	var fnames=[];
	var response=[];
	var data;
	fnames=fs.readdirSync(path.resolve(__dirname, 'saved/'));
	console.log(fnames);
	console.log(fnames.length);
	for (var i=0; i<fnames.length; i++) {
        //console.log(i);
		//console.log(path.resolve(__dirname, 'saved/'+fnames[i]));
		var data=fs.readFileSync(path.resolve(__dirname, 'saved/'+fnames[i]),'utf-8');
		if(fnames[i]=="keywords.json"){
			data=JSON.parse(data);
			//console.log("in keywords json");
			response.push({keywords:data
			});
		}
		else if(fnames[i]=="profiles.json"){
			data=JSON.parse(data);
			//console.log("in profiles json");
			//console.log(data[0]);
		 var imagination=0,intellect=0,achievement_striving=0,dutiful=0,self_discipline=0,self_efficacy=0,cheerful=0,outgoing=0,cooperation=0,uncompromising=0,trust=0,worry=0,stress=0,challenge=0,practicality=0,structure=0,openness_to_change=0,self_enhancement=0,self_transcedence=0;
		 for(var j=0;j<data.length;j++) //file 1,file 2,...
		 {
			var personalityy=data[j].personality;
			//console.log(personalityy);
			for(var k=0;k<personalityy.length;k++)
			{
				var common=personalityy[k].children;
				switch(k){
					case 0:
					imagination+=common[3].percentile;
					
				    intellect+=common[4].percentile;
					break;
					case 1:
					achievement_striving+=common[0].percentile;
					//console.log("imagination "+achievement_striving);
					dutiful+=common[2].percentile;
					self_discipline+=common[4].percentile;
					self_efficacy+=common[5].percentile;
					break;
					case 2:
					cheerful+=common[2].percentile;
					outgoing+=common[4].percentile;
					break;
					case 3:
					cooperation+=common[1].percentile;
					uncompromising+=common[3].percentile;
					trust+=common[5].percentile;
					break;
					case 4:
					worry+=common[1].percentile;
					stress+=common[5].percentile;
					break;
				}
				
				
			}
			//console.log(data[i]);
			var needss=data[j].needs;
			challenge+=needss[0].percentile;
			practicality+=needss[8].percentile;
			structure+=needss[11].percentile;
			var valuess=data[j].values;
			openness_to_change+=valuess[1].percentile;
			self_enhancement+=valuess[3].percentile;
			self_transcedence+=valuess[4].percentile;
		 }
		 imagination/=data.length;
		 intellect/=data.length;
		 console.log("before "+achievement_striving);
		 achievement_striving/=data.length;
		 console.log("after "+achievement_striving);
		 dutiful/=data.length;
		 self_discipline/=data.length;
		 self_efficacy/=data.length;
		 cheerful/=data.length;
		 outgoing/=data.length;
		 cooperation/=data.length;
		 uncompromising/=data.length;
		 trust/=data.length;
		 openness_to_change/=data.length;
		 self_enhancement/=data.length;
		 self_transcedence/=data.length;
		 stress/=data.length;
		 worry/=data.length;
		 challenge/=data.length;
		 practicality/=data.length;
		 structure/=data.length;
		 
		 response.push(
		 {profiles:[
		          {
                     score: imagination,
                     tone_name: "Imagination"
                  },  
                  {
                     score: intellect,
                     tone_name: "Intellect"
                  },
                  {
                     score: achievement_striving,
                     tone_name: "Achievement Striving"
                  },
                  {
                     score: dutiful,
                     tone_name: "Dutiful"
                  },
                  {
                     score: self_efficacy,
                     tone_name: "Self Efficacy"
                  },
				   {
                     score: cheerful,
                     tone_name: "Cheerful"
                  },  
                  {
                     score: outgoing,
                     tone_name: "Outgoing"
                  },
                  {
                     score: cooperation,
                     tone_name: "Cooperation"
                  },
				   {
                     score: uncompromising,
                     tone_name: "Uncompromising"
                  },  
                  {
                     score: trust,
                     tone_name: "Trust"
                  },
                  {
                     score: challenge,
                     tone_name: "Need Challenge"
                  },
                  {
                     score: practicality,
                     tone_name: "Need Practicality"
                  },
                  {
                     score: structure,
                     tone_name: "Need Structure"
                  },
				  {
                     score: openness_to_change,
                     tone_name: "Open to Change"
                  },
				  {
                     score: self_enhancement,
                     tone_name: "Self Enhancement"
                  },
				  {
                     score: self_transcedence,
                     tone_name: "Self Transcedence"
                  }
			
		]}
		 );
		}
		else if(fnames[i]=="tones.json"){
		data=JSON.parse(data);
		//console.log("in tones json");
		var anger=0,disgust=0,fear=0,joy=0,sadness=0,analytical=0,tentative=0,confident=0,openness_big5=0,conscientiousness_big5=0,extraversion_big5=0,agreeableness_big5=0,emotional_range_big5=0;
		for(var j=0;j<data.length;j++) //file 1,file 2,...
		{
		 var categories=data[j].document_tone.tone_categories;
		 for(var k=0;k<categories.length;k++)
		 {
			var id=categories[k].category_id;
			switch(id){
				case "emotion_tone":
				anger+=categories[k].tones[0].score;	
				disgust+=categories[k].tones[1].score;
				fear+=categories[k].tones[2].score;
				joy+=categories[k].tones[3].score;
				sadness+=categories[k].tones[4].score;
				break;
				
				case "language_tone":
				analytical+=categories[k].tones[0].score;
				confident+=categories[k].tones[1].score;
				tentative+=categories[k].tones[2].score;
				break;
				
				case "social_tone":
				openness_big5+=categories[k].tones[0].score;
				conscientiousness_big5+=categories[k].tones[1].score;
				extraversion_big5+=categories[k].tones[2].score;
				agreeableness_big5+=categories[k].tones[3].score;
				emotional_range_big5+=categories[k].tones[4].score;
				break;
			}
		 } 
		}
		anger/=data.length;
		disgust/=data.length;
		fear/=data.length;
		joy/=data.length;
		sadness/=data.length;
		analytical/=data.length;
		confident/=data.length;
		tentative/=data.length;
		openness_big5/=data.length;
		conscientiousness_big5/=data.length;
		extraversion_big5/=data.length;
		agreeableness_big5/=data.length;
		emotional_range_big5/=data.length;
		response.push({tones:[
		          {
                     score: anger,
                     tone_name: "Anger"
                  },  
                  {
                     score: disgust,
                     tone_name: "Disgust"
                  },
                  {
                     score: fear,
                     tone_name: "Fear"
                  },
                  {
                     score: joy,
                     tone_name: "Joy"
                  },
                  {
                     score: sadness,
                     tone_name: "Sadness"
                  },
				   {
                     score: analytical,
                     tone_name: "Analytical"
                  },  
                  {
                     score: confident,
                     tone_name: "Confident"
                  },
                  {
                     score: tentative,
                     tone_name: "Tentative"
                  },
				   {
                     score: openness_big5,
                     tone_name: "Openness"
                  },  
                  {
                     score: conscientiousness_big5,
                     tone_name: "Conscientiousness"
                  },
                  {
                     score: extraversion_big5,
                     tone_name: "Extraversion"
                  },
                  {
                     score: agreeableness_big5,
                     tone_name: "Agreeableness"
                  },
                  {
                     score: emotional_range_big5,
                     tone_name: "Emotional Range"
                  }
			
		]});
		
		
		}
		else if(fnames[i]=="translated_data.txt"){
		response.push({translated_data:data
		}
		);
		}
	}
	//console.log(filedata);
	resolve(response);
	
}
);
});	
}
async function getResults(req,res){
	Promise.resolve(wrapper(req)).then(function(response){
		res.send(response);
	});
}
/*
for(i=0;i<filedata.length;i++)
{ 
 tpromises.push(analyzeTone(filedata[i]));
}
Promise.all(tpromises).then(function(tones) {
    console.log("done");
	console.log(tones);
	
	
	
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
//personality=analyzePersonality(fildata);*/
//console.log(response);
	//console.log(JSON.stringify(tones)); //use tones here
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
   var dir=path.resolve(__dirname, 'uploads');
	if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, 'uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    //console.log('An error has occured: \n' + err);
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
  var dir=path.join(__dirname,'views');
 
  res.sendFile(path.join(__dirname, 'views/index.html'));
}
async function testMethod(req, res) {
  const result = await TestService.testMethod();
  res.json(result);
}
