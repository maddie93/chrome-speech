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
var stats = {
  "terrible": 0,
  "ok": 0,
  "good": 0,
  "awesome": 0
};

var getData = function() {
  fetch('https://shipit-d1d3.restdb.io/rest/feedback', {headers: {"x-apikey": "5c2e8ccd66292476821c9cb3"}})
  .then(function(response) {
     return response.json();
   })
   .then(function(myJson) {
     console.log(JSON.stringify(myJson));
     updateStats(myJson);
   });
}

var updateStat = function(type) {
  return fetch('https://shipit-d1d3.restdb.io/rest/feedback?q={"'+type+'": true}', {headers: {"x-apikey": "5c2e8ccd66292476821c9cb3"}})
  .then(function(response) {
     return response.json();
   })
   .then(function(myJson) {
     stats[type] = myJson.length;
     return stats[type];
   });
}
var updateStats = function(response) {
  updateStat("terrible").then(response => {terrible.innerHTML = response;});
  updateStat("ok").then(response => {ok.innerHTML = response;});
  updateStat("good").then(response => {good.innerHTML = response;});
  updateStat("awesome").then(response => {awesome.innerHTML = response});
}
var postData = function (opinion) {
  var data = {}
  //data[opinion] = stats[opinion] == undefined ? 1 : parseInt(stats[opinion]) + 1;
  data[opinion] = true;
  var uri = "https://shipit-d1d3.restdb.io/rest/feedback";
  fetch(uri, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json',
    "x-apikey": "5c2e8ccd66292476821c9cb3"
  }
}).then(res => {updateStats(); return res.json();})
.then(function(response){
  console.log('Success:', JSON.stringify(response));
})
.catch(error => console.error('Error:', error));
}
