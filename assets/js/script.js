//API key for authentication
var APIkey = "c0478d832f60e03d9f3b44027792c176";

//onclick event for search button
$("#searchbtn").on("click", function () {
    //set variable to pass user city input 
    var inputcity = $("#inputsearchcity").val();
    //once seach button clicked, empty input field
    $("#inputsearchcity").val("");
    //run all functions to complete search
    //function to save to localStorage
    saveHistory(inputcity);
    //load buttons from localStorage
    loadButtons();
    //get coordinates for city name
    getCoordinates(inputcity);
  });

function saveHistory(searchText){
    //check if field is empty
    if (!searchText) {
        console.log('No city entered to search');
        return
    }
    //read already existing localStorage
    var searchCities = JSON.parse(localStorage.getItem("cities"));
    //format input text to accomodate for uppercase and lowercase characters
    var formattedCities = searchText.charAt(0).toUpperCase() + searchText.slice(1).toLowerCase();
    //check if array has value insid, if not create an empty array
    if(searchCities == null) searchCities = [];
    //search the array to see if the City is already in the history
    if (searchCities.indexOf(formattedCities)===-1){
        searchCities.push(formattedCities);
        localStorage.setItem("cities", JSON.stringify(searchCities));
    }
    else{
        console.log('City already exists');
    }
}

//function to load history search buttons
function loadButtons(){
    //clear innerHTML prior to updating
    document.getElementById("searchTag").innerHTML = "";
    //load button names from localStorage
    var buttonNames = JSON.parse(localStorage.getItem("cities"));
    //loop thru each to create the button
    for (let i = 0; i < buttonNames.length; i++) {
        htmlCode = "<button type='button' class='btn btn-secondary w-100 mb-3' id=" + buttonNames[i] + " onclick='getCoordinates(this.id)'>" + buttonNames[i] + "</button>";    
        $('#searchTag').append(htmlCode);
    }
    //add a clear option at the end
    $('#searchTag').append("<a id='cleartext' href='#' onclick='clearHistory();return false;'>Clear History</a>");
}

//function to clear history and reset dashboard
function clearHistory(){
    localStorage.clear();
    $('#searchTag').empty();
    $("#maincardcity").empty();
    $("#maincardtemp").empty();
    $("#maincardwind").empty();
    $("#maincardhumi").empty();
    $("#forecastTitle").empty();
    $("#forecastCards").empty();
    $("#maincard").removeClass('border border-dark border-4');
}

//function to get coordinates using the GEO API
function getCoordinates(cityname){
    var urlCoods = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityname + "&limit=1&appid=" + APIkey
    fetch(urlCoods)
    .then(function(response){
        // handle the response
        console.log(response.status);
        console.log(response.statusText);
        return response.json();
    })
    .then(function(data){
        //once lat and lon are found, pass them on to the getweather function
        getWeather(data[0].lat, data[0].lon);  
    })
    .catch(error => {
        // handle the error
        console.error('There has been a problem with the API request:', error);
    });
}

//function to get weather from API by using the lat and lon as arguments
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
        // clear all innerHTML from tags
        $("#maincardcity").empty();
        $("#maincardtemp").empty();
        $("#maincardwind").empty();
        $("#maincardhumi").empty();
        //add border to main card
        $("#maincard").addClass('border border-dark border-4');
        //get date and format accondingly
        let date = new Date().toLocaleDateString();        
        $("#maincardcity").append(data.name + " (" + date + ")");
        //set img source using API response info for icon
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        $("#maincardcity").append(img);
        //append all remaining information to corresponding element
        $("#maincardtemp").append("Temp: "+ data.main.temp + " °F");
        $("#maincardwind").append("Wind: "+ data.wind.speed + " MPH");
        $("#maincardhumi").append("Humidity: "+ data.main.humidity + " %");
        //run funtion to get 5 day forecast
        getForecast(lat, lon);
    })
    .catch(error => {
        // handle the error
        console.error('There has been a problem with the API request:', error);
    });
}

function getForecast(lat, lon){
    var urlForecast = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey;
    fetch(urlForecast)
    .then(function(response){
        // handle the response
        console.log("Forecast fetch: " + response.status);
        console.log("Forecast fetch: " + response.statusText);
        return response.json();
    })
    .then(function(data){
        // clear all innerHTML from tags
        $("#forecastTitle").empty();
        $("#forecastCards").empty();
        //add title for 5 day forecast
        $("#forecastTitle").append("<h1>5-Day Forecast:</h1>");
        //loop thru resuls and create card element for each day
        for(let i = 1; i < data.list.length; i += 8){
            var cardDate = new Date(data.list[i].dt * 1000);
            var innerHTML = "<div class='col'><div class='card'><div id='forecast' class='card-body'>" +
                            "<h4 class='card-title'>" + cardDate.toLocaleDateString("en-US") + "</h4>" +
                            "<img src='https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'>" +
                            "<p class='card-text'>Temp: " + data.list[i].main.temp + " °F</p>" +
                            "<p class='card-text'>Wind: " + data.list[i].wind.speed +  " MPH</p>" +
                            "<p class='card-text'>Humidity: " + data.list[i].main.humidity +  " %</p>";
            $("#forecastCards").append(innerHTML);            
        }
    })
    .catch(error => {
        // handle the error
        console.error('There has been a problem with the API request:', error);
    });
}


