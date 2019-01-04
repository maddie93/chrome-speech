var recognizing = false;
var langs =
[['English',         ['en-US']],
 ['Polski',          ['pl-PL']]]


 // for (var i = 0; i < langs.length; i++) {
 //   select_language.options[i] = new Option(langs[i][0], i);
 // }
 select_language.selectedIndex = 0;

const synth = window.speechSynthesis;
var accessible_voices = [];
synth.onvoiceschanged = function() {
  accessible_voices = synth.getVoices();
  for (var i = 0; i < accessible_voices.length; i++) {
    var voice = accessible_voices[i];
    console.log(voice);
    select_voice.options[i] = new Option(voice.name + " ("+voice.lang+")", i);
    if (voice.lang == "pl-PL") {
      select_voice.value = i;
    }
  }
}

 if (!('webkitSpeechRecognition' in window)) {
   console.log("NIE DA RADY");
 } else {
   var recognition = new webkitSpeechRecognition();



   recognition.continuous = true;
   recognition.interimResults = true;
   recognition.onstart = function() {
     recognizing = true;
   };
 }

 var readIt = function (event) {
   var utterThis = new SpeechSynthesisUtterance(speech.textContent);
   utterThis.lang = select_language.value;
   utterThis.pitch = pitch.value / 10;
   utterThis.rate = rate.value / 10;
   utterThis.voice = accessible_voices[select_voice.value];
   console.log(utterThis);
   synth.speak(utterThis);
 }
 var assess = function(event) {
  var str = speech.textContent.toLowerCase();
  console.log(str);
  var no = (str.match(/kurwa|pierdolę|pierdolony|huj|jebany|spierdalaj|jebie|cipa|dupa|zjebane/g)||[]).length;
  var numberOfWords = str.split(/\s+/).length - 2;
  var percent = ((no/numberOfWords)*100).toFixed(1);
  console.log(numberOfWords);
  var ocena = '';
  if(percent>75){
    ocena = 'twoja wypowiedź jest bardzo wulgarna, popracuj nad uprzejmoscią ';
    document.getElementById('sad-face').style.display='block';
  }else if(percent >25 && percent <=50){
    ocena = 'wypowiadasz się całkiem przyzwoicie ';
    document.getElementById('no-expression').style.display='block';

  }else if(percent>50 && percent<=75){
    ocena = 'twoja wypowiedź może nie zostać zbyt dobrze odebrana';
    document.getElementById('disappointed').style.display='block';

  }else {
    ocena = 'wypowiadasz się niezwykle kulturanlnie';
    document.getElementById("heart-element").style.display='block';
  }
  var text = 'Powiedziałeś brzydkie słowo ' + no + ' na '+numberOfWords+' wypowiedzianych słów co, co stanowi ' + percent + ' procent wszystkich wypowiedzianych przez ciebie słów ';
  console.log(str);
  var syntetize = new SpeechSynthesisUtterance(text+ ocena);
  syntetize.lang = select_language.value;
  syntetize.pitch = pitch.value/10;
  syntetize.rate = rate.value/10;
  syntetize.voice = accessible_voices[select_voice.value];
  synth.speak(syntetize);
  console.log(text);

 }

 var startButton = function (event) {
   console.log("start!!!!");
   console.log(recognizing);
   Array.from(document.getElementsByClassName('em')).forEach(element => {
     element.style.display='none';
   });
   document.getElementById("heart-element").style.display='none';

   if (recognizing) {
     recognition.stop();
     start_speaking.innerHTML = 'OK MÓWIĘ';
     return;
   }
   final_transcript = '';
   recognition.lang = select_language.value;
   console.log(select_language);
   console.log(recognition);
   recognition.start();
   ignore_onend = false;
   final_span.innerHTML = '';
   interim_span.innerHTML = '';
   start_speaking.innerHTML = 'STOP';
 }

 var two_line = /\n\n/g;
 var one_line = /\n/g;
 function linebreak(s) {
   return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
 }

 var first_char = /\S/;
 function capitalize(s) {
   return s.replace(first_char, function(m) { return m.toUpperCase(); });
 }

 recognition.onresult = function(event) {
   var interim_transcript = '';
   for (var i = event.resultIndex; i < event.results.length; ++i) {
     if (event.results[i].isFinal) {
       final_transcript += event.results[i][0].transcript;
     } else {
       var transcript_tmp = event.results[i][0].transcript;
       interim_transcript += transcript_tmp;
     }
   }
   final_transcript = capitalize(final_transcript);
   final_span.innerHTML = linebreak(final_transcript);
   interim_span.innerHTML = linebreak(interim_transcript);

   var count = (speech.innerHTML.match(/kurwa|pierdolę|pierdolony|huj|jebany|spierdalaj|jebie|cipa|dupa|zjebane/g) || []).length;
   var prev = parseInt(licznik.innerHTML);
   licznik.innerHTML = prev > count ? prev : count;
 };

 recognition.onend = function() {
   recognizing = false;
 };

 var setPitch = function() {
   pitch_value.innerHTML = pitch.value / 10;
 }

 var setRate = function() {
   rate_value.innerHTML = rate.value / 10;
 }
