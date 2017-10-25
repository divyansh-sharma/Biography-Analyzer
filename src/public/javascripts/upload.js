$('.next-btn').on('click', function (){
$('html,body').animate({
        scrollTop: $("#panel-body1").offset().top},
        'slow');
});
$('.next-btn2').on('click', function (){
$('html,body').animate({
        scrollTop: $("#panel-body2").offset().top},
        'slow');
});
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('#bar1').text('0%');
    $('#bar1').width('0%');
	
});
$('.result-btn').on('click', function (){
	
    var techwords=$('#techkeywords').val();
	var emowords=$('#emokeywords').val();
	var data={"techkeywords":techwords,"emokeywords":emowords};
	$('#loading').css("display","block");
	
	 $.ajax({
      url: '/result',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data){
          console.log('keyword transfer successful!\n');
		  //alert(JSON.stringify(data,null,3));
		  $('#loading').hide();
		//console.log(JSON.stringify(data,null,3));
		var trans_data=data[3].translated_data;
		trans_data=trans_data.toLowerCase();
		var keywords=data[0].keywords;
		var profiles=data[1].profiles;
		var tones=data[2].tones;
		var emotions=[],language=[],social=[];
		for(var i=0;i<5;i++)
		emotions.push(tones[i]);
	    for(;i<8;i++)
		language.push(tones[i]);
	    for(;i<13;i++)
		social.push(tones[i]);
		//console.log(profiles);
		var personality=[],needs=[],values=[];
		for(var i=0;i<10;i++)
		personality.push(profiles[i]);
	    for(;i<13;i++)
		needs.push(profiles[i]);
	    for(;i<16;i++)
		values.push(profiles[i]);
		$('#tones').css("display","block");
		$('#tones').css("height","600px");
		$('#emotional').css("width","390px");
		$('#emotional').css("height","500px");
		$('#emotional').css("marginLeft","20px");
		$('#emotional').css("float","left");
		var top_emotions=[];
		var likely_emotions=[];
		 Morris.Bar({
  element: 'emotional',
  data: 
    emotions
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Emotional Tones'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_emotions.push(row.label);return "green";}
else if(row.y >0.75) {top_emotions.push(row.label);return "red";}
else return "blue";
}
}
});
top_emotions = [...new Set(top_emotions)];
likely_emotions=[...new Set(likely_emotions)];
//console.log(top_emotions);
//console.log(likely_emotions);
$('#language').css("width","390px");
$('#language').css("height","500px");
$('#language').css("float","left");
var top_language=[];
var likely_language=[];
Morris.Bar({
  element: 'language',
  data: 
    language
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Language Tones'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_language.push(row.label);return "green";}
else if(row.y >0.75) {top_language.push(row.label);return "red";}
else return "blue";
}
}
});
top_language = [...new Set(top_language)];
likely_language=[...new Set(likely_language)];
$('#social').css("width","390px");
$('#social').css("height","500px");
$('#social').css("float","left");
$('#social').css("marginLeft","20px");
var top_social=[];
var likely_social=[];
Morris.Bar({
  element: 'social',
  data: 
    social
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Social Tones'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_social.push(row.label); return "green";}
else if(row.y >0.75) {top_social.push(row.label);return "red";}
else return "blue";
}
}
});
top_social = [...new Set(top_social)];
likely_social=[...new Set(likely_social)];
$('#persona').css("display","block");
$('#persona').css("height","600px");
$('#personality').css("width","500px");
$('#personality').css("height","500px");
$('#personality').css("float","left");
var top_persona=[];
var likely_persona=[];
Morris.Bar({
  element: 'personality',
  data: 
    personality
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Personality'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_persona.push(row.label);return "green";}
else if(row.y >0.75) {top_persona.push(row.label);return "red";}
else return "blue";
}
}
});
top_persona = [...new Set(top_persona)];
likely_persona=[...new Set(likely_persona)];
$('#needs').css("width","390px");
$('#needs').css("height","500px");
$('#needs').css("float","left");
var top_needs=[];
var likely_needs=[];
 Morris.Bar({
  element: 'needs',
  data: 
    needs
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Needs'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_needs.push(row.label);return "green";}
else if(row.y >0.75) {top_needs.push(row.label);return "red";}
else return "blue";
}
}
});
top_needs = [...new Set(top_needs)];
likely_needs=[...new Set(likely_needs)];
$('#values').css("width","390px");
$('#values').css("height","500px");
$('#values').css("float","left");
var top_values=[];
var likely_values=[];
 Morris.Bar({
  element: 'values',
  data: 
    values
  ,
  
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Values'],
  xLabelAngle: 60,
  barColors: function (row, series, type) {
//console.log("--> "+row.label, series, type);
if(series.key=="score"){
if(row.y > 0.5 && row.y <0.75) {likely_values.push(row.label);return "green";}
else if(row.y >0.75) {top_values.push(row.label);return "red";}
else return "blue";
}
}
});
top_values = [...new Set(top_values)];
likely_values=[...new Set(likely_values)];
var all_top_traits=top_emotions.join()+","+likely_emotions.join()+","+top_language.join()+","+likely_language.join()+","+top_needs.join()+","+likely_needs.join()+","+top_persona.join()+","+likely_persona.join()+","+top_social.join()+","+likely_social.join()+","+top_values.join()+","+likely_values.join();
all_top_traits=all_top_traits.toLowerCase();
var non_tech_keys=keywords.emokeywords.toLowerCase().split(',');
var tech=keywords.techkeywords.toLowerCase().split(',');
var total_tech_matches=0;
var total_non_tech_matches=0;
for(var fi=0;fi<tech.length;fi++)
{   var regex = new RegExp("\\b" + tech[fi] + "\\b");
	var matches=trans_data.match(regex);
	if(matches!=null)
		total_tech_matches+=matches.length;
		
}
for(var ni=0;ni<non_tech_keys.length;ni++)
{var regex = new RegExp("\\b" + non_tech_keys[ni] + "\\b");
 var matches=all_top_traits.match(regex);
 if(matches!=null)
    total_non_tech_matches+=matches.length;
 var matches = trans_data.match(regex);
 if(matches!=null)
	 total_non_tech_matches+=matches.length;
}
//console.log("tech match "+total_tech_matches);
//console.log("non tech match "+total_non_tech_matches);

var percentmatch=((total_non_tech_matches+total_tech_matches)/(non_tech_keys.length+tech.length))*100;
var matchtext;
if(percentmatch>30 && percentmatch<=40)
	matchtext="Good Match";
else if(percentmatch>40 && percentmatch<=60)
	matchtext="Great Match";
else if(percentmatch>60 && percentmatch<=80)
	matchtext="Excellent Match";
else if(percentmatch>80)
	matchtext="Perfect Match";
else
	matchtext="This is not exactly what you might be looking for.Please review Tone and Personality insights for greater details.";

$("#persona").after('</br></br><h2>Matches</h2></br></br><p>Match Result :'+matchtext+'</p>');

$('html,body').animate({
        scrollTop: $("#tones").offset().top},
        'slow');
      } 

,
	    xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('#bar2').text(percentComplete + '%');
            $('#bar2').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('#bar2').html('Done');
            }

          }

        }, false);

        return xhr;
      }
	   });
	 
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
		  
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('#bar1').text(percentComplete + '%');
            $('#bar1').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('#bar1').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});