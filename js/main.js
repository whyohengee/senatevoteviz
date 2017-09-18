/******************************************************************************
GLOBALS
******************************************************************************/
var body = document.querySelector("body");
var svg;
var svgWidth = 900;
// var svgHeight = 457;
var svgHeight = 557;
var key = function (d) {
	return d.id;
};
var tooltip = document.querySelector("div.tooltip");
var billDetails = document.querySelector(".billDetails")
var billDescription = document.querySelector(".billDescription p");
var billSource = document.querySelector(".billSource a");
var yes_votes = document.querySelector(".voteResults ul li:first-child span");
var no_votes = document.querySelector(".voteResults ul li:nth-child(2) span");
var notvoting_votes = document.querySelector(".voteResults ul li:nth-child(3) span");

//This dataset contains all Senators returned from api call.
var allSenators= [];

var seatingCoordinates = seatingCoordinates();
var notVotePosition = notVotePosition();
var resetDataset = getResetSenators();


/******************************************************************************
This is to prevent scripts from executing before the
page is loaded (namely, <body>). Instead of executing
script, we wait till DOM/resources are ready.
Then call pageLoaded()
******************************************************************************/
//<IE11 check
if (window.attachEvent) {
    window.attachEvent('onload', pageLoaded);
}
else {
    if (window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            pageLoaded();
        };
        window.onload = newonload;
    }
    else {
        window.onload = pageLoaded;
    }
}


/******************************************************************************
pageLoaded
******************************************************************************/
function pageLoaded() {
	svg = d3.select(".senateSeatingContainer")
		.append("svg")
		.attr({
			width: "900px",
			height: "500px",
      class: "svgSeating"
		})

  // Select which bill
  patriotact_btn = document.querySelector("#patriotActBtn");
  patriotact_btn.addEventListener("click", getVoteData, false);

  cisa_btn = document.querySelector("#cisaBtn");
  cisa_btn.addEventListener("click", getVoteData, false);

  fisa2008_btn = document.querySelector("#fisa2008Btn");
  fisa2008_btn.addEventListener("click", getVoteData, false);

  resetSeating = document.getElementById("resetSeating");
  resetSeating.addEventListener("click", resetSenators, false);

	// Show initial layout w/ starting senators
	getStartingSenators();

}

/******************************************************************************
* Remove any tooltips by clicking anywhere on document.body
******************************************************************************/
function removeTooltip() {
  var tooltip_to_remove = document.querySelector("div.tooltip");
  if (tooltip_to_remove) {
    body.removeChild(tooltip_to_remove)
  }
  else {
    console.log("no tooltip")
  }
}


/******************************************************************************
* Ajax calls to ProPublica API
******************************************************************************/
function getVoteData(e) {
  var requestedDataset = e.target.id;
  switch(requestedDataset) {
    case("patriotActBtn"):
      var patriotAct_ajax = $.ajax({
      url: "https://api.propublica.org/congress/v1/107/senate/sessions/1/votes/313.json",
      type: "GET",
      dataType: "json",
      headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'},
      })
        .done(function (results) {
          // console.log("results", results.results.votes.vote);
          patriotAct_data = results.results.votes.vote;
          //Call the draw functions here
          showVoteSeating(patriotAct_data);
        })
        .fail(function (jqXHR, textStatus, error) {
          console.log(textStatus)
        })
      break;
    case("cisaBtn"):
      var cisaAjax = $.ajax({
        url: "https://api.propublica.org/congress/v1/114/senate/sessions/1/votes/291.json",
        type: "GET",
        dataType: "json",
        headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'},
        })
          .done(function (results) {
            cisa_data = results.results.votes.vote;
            //Call the draw function here
            showVoteSeating(cisa_data);
          })
          .fail(function (jqXHR, textStatus, error) {
            console.log(textStatus);
          })
      break;
    case("fisa2008Btn"):
      var fisa_ajax = $.ajax({
        url: "https://api.propublica.org/congress/v1/110/senate/sessions/2/votes/168.json",
        type: "GET",
        dataType: "json",
        headers: {'X-API-Key': 'kmPQkU3AqAOzB6BQtVSzJLu8DNGtJqNcDrBHUik8'},
      })
        .done(function (results) {
          fisa2008_data = results.results.votes.vote;
          //Call the draw function here
          showVoteSeating(fisa2008_data);
        })
        .fail(function (jqXHR, textStatus, error) {
          console.log(textStatus);
        })
      break;
    default:
      console.log("Dataset not found");
      break;
  }

}


/******************************************************************************
Request for senators that started the session.
******************************************************************************/
function getStartingSenators() {

	var circles = svg.selectAll("circle")
  circles.data(getResetSenators())
         .enter()
         .append("circle")
         .attr({
           cx: function (d, i) {
             return seatingCoordinates[i].cx;
           },
           cy: function (d, i) {
             return seatingCoordinates[i].cy;
           },
           r: 20,
           fill: "gray",
           stroke: "gray"
         })
         .style("position", "relative")
   var stateLabels = svg.selectAll("text")
   stateLabels.data(getResetSenators())
              .enter()
              .append("text")
              .text(function (d, i) {
                return d.state;
              })
              .attr({
                x: function (d, i) {
                  return seatingCoordinates[i].cx;
                },
                y: function (d, i) {
                  return parseFloat(seatingCoordinates[i].cy) + 4;
                },
                "font-size": "12px",
                "text-anchor": "middle",
                "fill": "#E5E2E5"
              })

}


/******************************************************************************
sortByState():
Pass in an array of Senators (or House?),
return the array sorted alphabetically by state abbreviation
******************************************************************************/
function sortByState(dataset) {

	dataset.sort(function (a, b){

		var stateA0 = a.state.charAt(0).toLowerCase();
		var stateA1 = a.state.charAt(1).toLowerCase();
		var stateB0 = b.state.charAt(0).toLowerCase();
		var stateB1 = b.state.charAt(1).toLowerCase();

		if (stateA0 === stateB0) {
			return stateA1 < stateB1 ? -1 : stateA1 > stateB1 ? 1 : 0;
		}

		return stateA0 < stateB0 ? -1 : stateA0 > stateB0 ? 1 : 0;

	});
	return dataset;
}


/******************************************************************************
excludeSenatorsByDate()
Check a date to see what range it's in.
According to that range, return an array of Senators
that held office in that range.
******************************************************************************/
function excludeSenatorsByDate(checkThisDate, allSenators) {

	var jan_03_2001 = new Date(2001, 00, 03);
	var oct_25_2002 = new Date(2002, 09, 25);
	var nov_04_2002 = new Date(2002, 10, 04);
	var nov_25_2002 = new Date(2002, 10, 25);
	var nov_30_2002 = new Date(2002, 10, 30);
	var dec_02_2002 = new Date(2002, 11, 02);
	var dec_20_2002 = new Date(2002, 11, 20);
	var jan_03_2003 = new Date(2003, 00, 03);
	var seatedSenators = [];

	switch (true) {
		case ((jan_03_2001 <= checkThisDate) && (checkThisDate <= oct_25_2002)):
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "B001237" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "T000024" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			return seatedSenators;
			break;
		case ((oct_25_2002 < checkThisDate) && (checkThisDate < nov_04_2002)):
			//99 senators, return original seating
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "B001237" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "T000024" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			return seatedSenators;
			break;
		case ((nov_04_2002 <= checkThisDate) && (checkThisDate < nov_25_2002)):
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "W000288" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "C001043" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			return seatedSenators;
			break;
		case ((nov_25_2002 <= checkThisDate) && (checkThisDate <= nov_30_2002)):
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "W000288" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "C001043" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			return seatedSenators;
			break;
		case ((nov_30_2002 < checkThisDate) && (checkThisDate <= dec_02_2002)):
			//99 senators, return original seating
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "B001237" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "T000024" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			break;
		case ((dec_02_2002 < checkThisDate) && (checkThisDate < dec_20_2002)):
			//99 senators, return original seating
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "B001237" && allSenators[eachSenator].id !== "C001056" && allSenators[eachSenator].id !== "T000024" && allSenators[eachSenator].id !== "M001153") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			break;
		case ((dec_20_2002 <= checkThisDate)  && (checkThisDate <= jan_03_2003)):
			for (var eachSenator in allSenators) {
				if (allSenators[eachSenator].id !== "W000288" && allSenators[eachSenator].id !== "G000365" && allSenators[eachSenator].id !== "C001043" && allSenators[eachSenator].id !== "M001085") {
					seatedSenators.push(allSenators[eachSenator]);
				}
			}
			return seatedSenators;
			break;
		default:
			echo("default");
			break;
	}
}


/******************************************************************************
drawStartingSenators()
Pass in all senators returned by api call.
Filter down to senators that held office at
beginning of session...draw em.
******************************************************************************/
function drawStartingSenators(dataset) {

	//populate global array of 104 senators
	allSenators = dataset.senateMembers;

	var senateArray = dataset.senateMembers.slice();

	var date = new Date(2002, 07, 01);
	var seatedSenators = excludeSenatorsByDate(date, senateArray);
	seatedSenators = sortByState(seatedSenators);

	var senatorCircles = svg.selectAll("circle")
		.data(seatedSenators) //this returns the update selection
		.enter()
		.append("circle")
		.attr({
			cx: function (d, i) {
				return seatingCoordinates[i].cx;
			},
			cy: function (d, i) {
				return seatingCoordinates[i].cy;
			},
			r: 20,
			fill: "#7F7D7F",
			"stroke": function (d, i) {
				switch (d.party) {
					case "D":
						return "rgb(0,0,255)";
						break;
					case "R":
						return "rgb(255,0,0)";
						break;
					case "I":
						return "#672071";
            break;
          default:
            break;
				}
			},
			"stroke-width": 5,

		})

	var stateLabels = svg.selectAll("text")
		.data(seatedSenators)
		.enter()
		.append("text")
		.text(function (d) {
			return d.state;
		})
		.attr({
			x: function (d, i) {
				return seatingCoordinates[i].cx;
			},
			y: function (d, i) {
				return parseFloat(seatingCoordinates[i].cy) + 5;
			},
			"font-size": "12px",
			"text-anchor": "middle",
			"fill": "#E5E2E5"
		})
}

/******************************************************************************
Change seating positions of Senators based on vote results
******************************************************************************/
function showVoteSeating(data) {
// console.log(data)
	//array w: member_id, name, party, state, vote_position
  /***
  * Old stuff from nytimes api:
  * Positions included: member_id and vote_position. Statement was:
  * var votePositions = data.results.votes.vote.positions.slice();
  ***/
  var votePositions = data.positions;
  // billDetails.setAttribute("style", "visibility:visible");
  billDetails.style.visibility = "visible";


  billDescription.innerText = data.description;
  billSource.innerText = data.url;
  billSource.href = data.url;
  yes_votes.innerText = data.total.yes;
  no_votes.innerText = data.total.no;
  notvoting_votes.innerText = data.total.not_voting;


  /***
  * Old stuff: Finding the vote date to get the right senators.
  * With new, I think I'm just going to try and move by the votePositions array...
  * Code:
  *         //need voteDate to get the right set of senators
  *         var voteDate = new Date(data.results.votes.vote.date);
  *         var seatedSenators = excludeSenatorsByDate(voteDate, allSenators);
  ***/

	/***
  * Old stuff: Sorting by state. I would take the filtered (by vote date)
  * dataset (var seatedSenators) and sort them alpha by state.
  * Code:
  *         //alphabetize the array of senators by state
  *         seatedSenators = sortByState(seatedSenators);
  ***/
	//alphabetize the array of senators by state
	seatedSenators = sortByState(votePositions);

  /***
  * Old stuff: Adding vote positions to array of sorted (by state) Senators.
  * Since the new api includes vote position, I don't think I'll need this...
  * Code:
  *         //add vote position to the array of seatedSenators
  *         for (var curr in seatedSenators) {
  *           var currSenator = seatedSenators[curr];
  *           for (var currVote in votePositions) {
  *             if (currSenator.id === votePositions[currVote].member_id) {
  *               currSenator.vote_position = votePositions[currVote].vote_position;
  *             }
  *           }
  *         }
  ***/


	var yesPtr_cx = 0;
	var noPtr_cx = 99;
	var yesPtr_cy = 0;
	var noPtr_cy = 99;
	var notVotePtr_cx = 0;
	var notVotePtr_cy = 0;

	var circles = svg.selectAll("circle")
		.data(seatedSenators)
	circles.transition()
		.duration(450)
		.delay(function (d, i) {
			return i / seatedSenators.length * 1000;
		})
		.ease("linear")
		.attr({
			cx: function (d, i) {
				switch (d.vote_position) {
					case "Yes":
						yesPtr_cx++;
						return seatingCoordinates[yesPtr_cx - 1].cx;
						break;
					case "No":
						noPtr_cx--;
						return seatingCoordinates[noPtr_cx + 1].cx;
						break;
					case "Not Voting":
						notVotePtr_cx++;
						return notVotePosition[notVotePtr_cx - 1].cx;
						break;
					default:
						console.log("nada");
						break;
				}
			},
			cy: function (d, i) {
				switch (d.vote_position) {
					case "Yes":
						yesPtr_cy++;
						return seatingCoordinates[yesPtr_cy - 1].cy;
						break;
					case "No":
						noPtr_cy--;
						return seatingCoordinates[noPtr_cy + 1].cy;
						break;
					case "Not Voting":
						notVotePtr_cy++;
						return notVotePosition[notVotePtr_cy - 1].cy;
						break;
					default:
						console.log("nada");
						break;
				}
			},
			fill: function (d, i) {
				switch (d.vote_position) {
					case "Yes":
						return "green";
						break;
					case "No":
						return "red";
						break;
					case "Not Voting":
						return "black";
						break;
					default:
						console.log("nada");
						break;
				}
			},
      stroke: function (d, i) {
        switch(d.party) {
          case "D":
            return "blue";
            break;
          case "R":
            return "red";
            break;
          case "I":
            return "purple";
            break;
          default:
            return "gray";
            break;
        }
      },
      "stroke-width": 4,
			r: 20,
		})
    .style("position", "relative")


	//reset pointers
	yesPtr_cx = 0;
	noPtr_cx = 99;
	yesPtr_cy = 0;
	noPtr_cy = 99;
	notVotePtr_cx = 0;
	notVotePtr_cy = 0;

	var stateLabels = svg.selectAll("text")
		.data(seatedSenators)


	stateLabels.transition()
		.duration(450)
		.delay(function (d, i) {
			return i / seatedSenators.length * 1000;
		})
		.ease("linear")
		.text(function (d, i) {
			return d.state;
		})
		.attr({
			x: function (d, i) {
				switch (d.vote_position) {
					case "Yes":
						yesPtr_cx++;
						return seatingCoordinates[yesPtr_cx - 1].cx;
						break;
					case "No":
						noPtr_cx--;
						return seatingCoordinates[noPtr_cx + 1].cx;
						break;
					case "Not Voting":
						notVotePtr_cx++;
						return notVotePosition[notVotePtr_cx - 1].cx;
						break;
					default:
						console.log("nada");
						break;
				}
			},
			y: function (d, i) {
				switch (d.vote_position) {
					case "Yes":
						yesPtr_cy++;
						return seatingCoordinates[yesPtr_cy - 1].cy + 5;
						break;
					case "No":
						noPtr_cy--;
						return seatingCoordinates[noPtr_cy + 1].cy + 5;
						break;
					case "Not Voting":
						notVotePtr_cy++;
						return notVotePosition[notVotePtr_cy - 1].cy + 5;
						break;
					default:
						console.log("nada");
						break;
				}
			},
			"font-size": "12px",
			"text-anchor": "middle",
			"fill": "#E5E2E5"
		})

  circles.on("click", function (d, i) {
    // console.log("this", this, d);
    // If there is a tooltip, remove it...
    if (document.querySelector("div.tooltip")) {
      removeTooltip();
    }
    //   ...then add a tooltip
    var tooltip = d3.select("body").append("div")
    console.log("tooltip");
    tooltip.attr("class", "tooltip visible")
           .style("top", d3.event.pageY - 10 + "px")
           .style("left", d3.event.pageX + 10 + "px")
           .append("h4")
           .text(d.name + " (" + d.party + ") " + d.state)
    var tooltip_close = tooltip.append("p")
                               .text("X")
                               .attr("class", "tooltip__close")
                               .on("click", removeTooltip)
  })


  stateLabels.on("click", function (d) {
    // console.log("this", this, d);
    // If there is a tooltip, remove it...
    if (document.querySelector("div.tooltip")) {
      removeTooltip();
    }
    //   ...then add a tooltip
    var tooltip = d3.select("body").append("div")
    console.log("tooltip");
    tooltip.attr("class", "tooltip visible")
           .style("top", d3.event.pageY - 10 + "px")
           .style("left", d3.event.pageX + 0 + "px")
           .append("h4")
           .text(d.name + " (" + d.party + ") " + d.state)
    var tooltip_close = tooltip.append("p")
                               .text("X")
                               .attr("class", "tooltip__close")
                               .on("click", removeTooltip)
  })



}



/******************************************************************************
Reset Senators to original seating plan
******************************************************************************/
function resetSenators() {

  // Remove tooltips
  if (document.querySelector("div.tooltip")) {
    var tooltip_to_remove = document.querySelector("div.tooltip");
    body.removeChild(tooltip_to_remove);
  }

  // Reset vote details
  // billDescription.innerText = "";
  // billSource.innerText = "";
  // yes_votes.innerText = "";
  // no_votes.innerText = "";
  // notvoting_votes.innerText = "";

  // Hide vote details
  billDetails.style.visibility = ("hidden");

  var circles = svg.selectAll("circle");
  circles.data(resetDataset)
        .attr({
          cx: function (d, i) {
            return seatingCoordinates[i].cx;
          },
          cy: function (d, i) {
            return seatingCoordinates[i].cy;
          },
          r: 20,
          fill: "gray",
          stroke: "gray"
        })
  var stateLabels = svg.selectAll("text");
  stateLabels.data(resetDataset)
             .text(function (d, i) {
               return resetDataset[i].state;
             })
             .attr({
               x: function (d, i) {
                 return seatingCoordinates[i].cx;
               },
               y: function (d, i) {
                 // return seatingCoordinates[i].cy;
                 return parseFloat(seatingCoordinates[i].cy) + 4;
               }
             })
}