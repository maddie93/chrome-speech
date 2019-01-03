var setMood = function (rating) {
  rate.style.display = "none";
  feedback.style.display = "inherit";
  var opinion = "good";
  switch(rating) {
    case 0: opinion = "terrible"; break;
    case 1: opinion = "ok"; break;
    case 2: opinion = "good"; break;
    case 3: opinion = "awesome"; break;
  }
  postData(opinion);
}

var resetFeedback = function() {
  rate.style.display = "inherit";
  feedback.style.display = "none";
}
var stats;
var getData = function() {
  fetch('https://shipit-d1d3.restdb.io/rest/feedback', {headers: {"x-apikey": "5c2e8ccd66292476821c9cb3"}})
  .then(function(response) {
     return response.json();
   })
   .then(function(myJson) {
     console.log(JSON.stringify(myJson));
     stats = myJson[0];
     updateStats();
   });
}
var updateStats = function() {
  terrible.innerHTML = stats["terrible"];
  ok.innerHTML = stats["ok"];
  good.innerHTML = stats["good"];
  awesome.innerHTML = stats["awesome"];
}
var postData = function (opinion) {
  var data = {}
  data[opinion] = stats[opinion] == undefined ? 1 : parseInt(stats[opinion]) + 1;

  var uri = "https://shipit-d1d3.restdb.io/rest/feedback/" + stats._id;
  fetch(uri, {
  method: 'PUT', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json',
    "x-apikey": "5c2e8ccd66292476821c9cb3"
  }
}).then(res => res.json())
.then(function(response){
  console.log('Success:', JSON.stringify(response));
  stats = response[0];
  //updateStats();
})
.catch(error => console.error('Error:', error));
}
