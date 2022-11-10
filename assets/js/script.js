var APIkey = "c0478d832f60e03d9f3b44027792c176";

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
        htmlCode = "<button type='button' class='btn btn-secondary w-100 mb-3' id=" + buttonNames[i] + " onclick='getCoordinates(this.id)'>" + buttonNames[i] + "</button>";    
        $('#searchTag').append(htmlCode);
    }
}
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
        // clear all innerHTML from tags
        $("#maincardcity").empty();
        $("#maincardtemp").empty();
        $("#maincardwind").empty();
        $("#maincardhumi").empty();

        $("#maincard").addClass('border border-dark border-4');

        let date = new Date().toLocaleDateString();        
        $("#maincardcity").append(data.name + " (" + date + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        $("#maincardcity").append(img);
        $("#maincardtemp").append("Temp: "+ data.main.temp + " °F");
        $("#maincardwind").append("Wind: "+ data.wind.speed + " MPH");
        $("#maincardhumi").append("Humidity: "+ data.main.humidity + " %");
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
        console.log(data.list)
        $("#forecastTitle").empty();
        $("#forecastCards").empty();
        $("#forecastTitle").append("<h1>5-Day Forecast:</h1>");
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


