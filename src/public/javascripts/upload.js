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
		console.log(JSON.stringify(data,null,3));
		var profiles=data[1].profiles;
		var tones=data[2].tones;
		var emotions=[],language=[],social=[];
		for(var i=0;i<5;i++)
		emotions.push(tones[i]);
	    for(;i<8;i++)
		language.push(tones[i]);
	    for(;i<13;i++)
		social.push(tones[i]);
		console.log(profiles);
		var personality=[],needs=[],values=[];
		for(var i=0;i<10;i++)
		personality.push(profiles[i]);
	    for(;i<13;i++)
		needs.push(profiles[i]);
	    for(;i<16;i++)
		values.push(profiles[i]);
		
		  Morris.Bar({
  element: 'emotional',
  data: 
    emotions
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Emotional Tones'],
  xLabelAngle: 60
});

Morris.Bar({
  element: 'language',
  data: 
    language
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Language Tones'],
  xLabelAngle: 60
});

Morris.Bar({
  element: 'social',
  data: 
    social
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Social Tones'],
  xLabelAngle: 60
});
 Morris.Bar({
  element: 'personality',
  data: 
    personality
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Personality'],
  xLabelAngle: 60
});
 Morris.Bar({
  element: 'needs',
  data: 
    needs
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Needs'],
  xLabelAngle: 60
});
 Morris.Bar({
  element: 'values',
  data: 
    values
  ,
  xkey: 'tone_name',
  ykeys: ['score'],
  labels: ['Values'],
  xLabelAngle: 60
});
$('#emotional').css("display","block");
$('#language').css("display","block");
$('#social').css("display","block");
$('#personality').css("display","block");
$('#needs').css("display","block");
$('#values').css("display","block");
$('html,body').animate({
        scrollTop: $("#personality").offset().top},
        'slow');
      },
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