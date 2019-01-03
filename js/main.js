var recognizing = false;
var langs =
[['English',         ['en-US']],
 ['Polski',          ['pl-PL']]]

 // for (var i = 0; i < langs.length; i++) {
 //   select_language.options[i] = new Option(langs[i][0], i);
 // }
 select_language.selectedIndex = 0;

 const synth = window.speechSynthesis;

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
   synth.speak(utterThis);
 }

 var startButton = function (event) {
   console.log("start!!!!");
   console.log(recognizing);
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

   var count = (speech.innerHTML.match(/kurwa/g) || []).length;
   var prev = parseInt(licznik.innerHTML);
   licznik.innerHTML = prev > count ? prev : count;
 };

 recognition.onend = function() {
   recognizing = false;
 };
