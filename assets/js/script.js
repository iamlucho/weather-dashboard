var APIkey = "c0478d832f60e03d9f3b44027792c176";
var URLCity = "http://api.openweathermap.org/geo/1.0/direct?q=";
var coordLon = "";
var coordLat = "";

//onclick event for search button
$("#searchbtn").on("click", function () {
    //set variable to pass user city input 
    var inputcity = $("#inputsearchcity").val();
    //once seach button clicked, empty input field
    $("#inputsearchcity").val("");
    saveHistory(inputcity);
    loadButtons();
    getCoordinates(inputcity);
  });

function saveHistory(searchText){
    if (!searchText) {
        console.log('No city entered to search');
        return
    }
    var searchCities = JSON.parse(localStorage.getItem("cities"));
    var formattedCities = searchText.charAt(0).toUpperCase() + searchText.slice(1);
    if(searchCities == null) searchCities = [];
    if (searchCities.indexOf(formattedCities)===-1){
        searchCities.push(formattedCities);
        localStorage.setItem("cities", JSON.stringify(searchCities));
    }
    else{
        console.log('City already exists');
    }
}

function loadButtons(){
    document.getElementById("searchTag").innerHTML = "";
    var buttonNames = JSON.parse(localStorage.getItem("cities"));
    for (let i = 0; i < buttonNames.length; i++) {
        htmlCode = "<button type='button' class='btn btn-secondary w-100 mb-3'>" + buttonNames[i] + "</button>";    
        $('#searchTag').append(htmlCode);
    }
}
function getCoordinates(cityname){
    var urlCoods = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityname + "&limit=1&appid=" + APIkey
    fetch(urlCoods)
    .then(function(response){
        // handle the response
        console.log(response.status);
        console.log(response.statusText);
        return response.json();
    })
    .then(function(data){
        getWeather(data[0].lat, data[0].lon);  
    })
    .catch(error => {
        // handle the error
        console.error('There has been a problem with the API request:', error);
    });
}

function getWeather(lat, lon){
    var urlCoods = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lon +"&units=imperial&appid="+ APIkey;
    fetch(urlCoods)
    .then(function(response){
        // handle the response
        console.log(response.status);
        console.log(response.statusText);
        return response.json();
    })
    .then(function(data){
        console.log(data);


    })
    .catch(error => {
        // handle the error
        console.error('There has been a problem with the API request:', error);
    });
}


