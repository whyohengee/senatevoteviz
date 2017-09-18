/*
trying $ajax. Example call:
https://gist.github.com/hedleysmith/15fa60fda5ef4369636a4b23e018dc8f
*/

// PATRIOT Act
$.ajax({
  url: "https://api.propublica.org/congress/v1/107/senate/sessions/1/votes/313.json",
  type: "GET",
  dataType: 'json',
  headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'}
}).done(function(data){
  console.log(data.results.votes.vote);
  // console.log(data.results.votes.vote.positions);
});

// CISA
$.ajax({
  url: "https://api.propublica.org/congress/v1/114/senate/sessions/1/votes/291.json",
  type: "GET",
  dataType: 'json',
  headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'}
}).done(function(data){
  console.log(data.results);
  // console.log(data.results.votes.vote.positions);
});

// FISA Amendment Act 2008
$.ajax({
  url: "https://api.propublica.org/congress/v1/110/senate/sessions/2/votes/168.json",
  type: "GET",
  dataType: 'json',
  headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'}
}).done(function(data){
  console.log(data.results);
  // console.log(data.results.votes.vote.positions);
});



//old call example
$.ajax({
  url: "https://api.propublica.org/congress/v1/107/senate/sessions/1/votes/313.json",
  type: "GET",
  dataType: 'json',
  headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'}
}).done(function(data){
  patriotActData = data; //Making this a global for access throughout
  console.log("PatriotAct");
  console.log(patriotActData);
  // console.log(data.results.votes.vote);
  // console.log(data.results.votes.vote.positions);
});