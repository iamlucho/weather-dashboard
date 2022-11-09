//onclick event for search button
$("#searchbtn").on("click", function () {
    //set variable to pass user city input 
    var inputcity = $("#inputsearchcity").val();
    //once seach button clicked, empty input field
    $("#inputsearchcity").val("");
    saveHistory(inputcity);
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