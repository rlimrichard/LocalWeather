//weather API: https://openweathermap.org/current#geo
//API key: dd37143e5a175b8ae3959d579cfb3cfc

//Global variables
var TEMPERATURE = 0;
var UNIT = 'C';

//on load
$(document).ready(function() {
    getLocation();
    currentDateTime();

    $('#changeTemperature').on('click', function(e) {
        e.preventDefault();
        if (UNIT == 'C'){
            //convert in Fahrenheit
            TEMPERATURE =  Math.round(TEMPERATURE * 9 / 5 + 32);
            UNIT = 'F';
        }
        else{
            //convert in Celsius
            TEMPERATURE =  Math.round((TEMPERATURE-32) * 5 / 9);
            UNIT = 'C';
        }
         $("#temperature").html(TEMPERATURE + '&deg; ' + UNIT);

    });
});


//get the current location
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);

            callWeather(position.coords.latitude, position.coords.longitude);
        });
    }
}

//call Weather API and manage the data
function callWeather(latitude, longitude){
    var apiKey = 'dd37143e5a175b8ae3959d579cfb3cfc';
    var link = 'http://api.openweathermap.org/data/2.5/weather?units=metric&APPID=' + apiKey;
    link += '&lat=' + latitude + '&lon=' + longitude ;

    console.log(link);

    $.ajax({
        url:link,
        beforeSend: function (request) {
            //request.setRequestHeader("X-Mashape-Key", "JejsUDXD8smshz49yDB7e8wOShfAp12axxcjsneMKt1bHKOuc8");
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.setRequestHeader("Accept", "application/json");
        },
        async: true,
        //dataType:'json',
        //type: 'post',
        //data: yourForm.serialize(),
        success: function(response, status, jqXHR) {
        //success:function(response){
             // ** If yout API returns something, you're going to proccess the data here.
             //var r = JSON.parse(response);
             console.log(response);

             var city = response.name;
             var country = response.sys.country;
             $("#location").text(city + ', ' + country);

             var iconLink = 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png';
             var description = titleCase(response.weather[0].description);
             $("#weather").html('<img src="' + iconLink + '" alt="weather_icon" /> ' + description);

             var weatherType = titleCase(response.weather[0].main);
             changeBackground(weatherType);

             TEMPERATURE = Math.floor(response.main.temp);
             $("#temperature").html(TEMPERATURE + '&deg;' + UNIT);

        }
    });
}

//compute the date and the time every 10 seconds
function currentDateTime(){
    var d = new Date();
    var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes();
    var hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours();
    //var ampm = d.getHours() >= 12 ? 'pm' : 'am';
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    //var dateTime = days[d.getDay()] + ' ' + months[d.getMonth()] + ', ' + d.getDate() + ' ' + d.getFullYear() + ' - ' + hours + ':' + minutes + ampm;

    $("#date").text(days[d.getDay()] + ' ' + months[d.getMonth()] + ', ' + d.getDate() );
    $("#time").text(hours + ':' + minutes);
    //check the DateTime every 10sec = 10000ms
    var t = setTimeout(currentDateTime, 10000);
}

//put all first letter of each word in upper case
function titleCase(str) {
    var array = str.split(' ');
    for (var i=0 ; i<array.length; i++){
        array[i] = array[i][0].toUpperCase() + array[i].substr(1, array[i].length).toLowerCase();
    }
    return array.join(" ");
}

//change the background based on the weather condition. If it is not in the map, it picks a random background
function changeBackground(weatherType){
    var landscapeMap = [ ['mist', 'http://www.yoanu.com/wp-content/uploads/2015/08/morning-mist-wallpaper-latest-photos-4ape2t0a.jpg'],
                        ['clouds', 'http://cdn.paper4pc.com/images/cloudy-landscape-wallpaper-1.jpg'],
                        ['rain', 'http://wallarthd.com/wp-content/uploads/2014/10/Beautiful-Red-Umbrella-Rain-Wallpaper-Desktop.jpg'],
                        ['snow', 'https://s-media-cache-ak0.pinimg.com/originals/2a/db/59/2adb5938550b7d96296cfd2aea448985.jpg'],
                        ['clear', 'https://drscdn.500px.org/photo/52296484/m%3D2048/9a5810ef6b98956873f114635371e9c3'],
                        ['thunderstorm', 'http://sumfinity.com/wp-content/uploads/2013/07/Thunderstorm-at-Alexanderplatz-Berlin-Germany-1200.jpg']
                        ];
    var weatherType = weatherType.toLowerCase()

    var landscapeLink = landscapeMap[Math.floor((Math.random() * landscapeMap.length))][1];
    for (var i=0 ; i< landscapeMap.length ; i++){
        if (landscapeMap[i][0] == weatherType){
            landscapeLink = landscapeMap[i][1];
        }
    }
    document.body.style.backgroundImage = "url('" + landscapeLink + "')";
}
