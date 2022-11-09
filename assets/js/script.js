//onclick event for search button
$("#searchbtn").on("click", function () {
    //set variable to pass user city input 
    var inputcity = $("#inputsearchcity").val();
    //once seach button clicked, empty input field
    $("#inputsearchcity").val("");
    saveHistory(inputcity);
    loadButtons();
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