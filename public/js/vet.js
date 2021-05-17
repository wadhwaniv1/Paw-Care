var x = document.getElementById("city_name");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else { x.innerHTML = "Geolocation is not supported by this browser."; }
}
function showPosition(position) {
    var coords1 = position.coords.latitude;
    var coords2 = position.coords.longitude;
    //x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;

    //var y = document.getElementById("vet_name");
    let url = `https://cors-anywhere.herokuapp.com/https://atlas.mapmyindia.com/api/places/nearby/json?keywords=veterinary&page=1&region=IND&refLocation=${coords1}%2C${coords2}`;
    //y.innerHTML = coords2; 

    async function getapi(url) {

        const headers = {
            'Authorization': 'bearer d0defe4b-a6f1-46f5-a906-fca7f4e89a3b'
        };
        try {
            // Storing response
            const response = await fetch(url, { headers });

            // Storing data in form of JSON
            var data = await response.json();
            console.log(data);

            let tab =
                `<tr>
              <th>Place Name</th>
              <th>Address</th>
              <th>Distance(in m)</th>
             </tr>`;

            const temp =  data.suggestedLocations;
            // Loop to access all rows 
            let i;
            for(i = 0; i < temp.length; i++) {
                tab += `<tr> 
                <td>${temp[i].placeName} </td>
                <td>${temp[i].placeAddress}</td>
                <td>${temp[i].distance}</td>
                </tr>`;
            }
            // Setting innerHTML as tab variable
            console.log(tab);
            document.getElementById("vet_name").innerHTML = tab;
        } catch {
            console.log("Error");
        }

    }
    // Calling that async function
    getapi(url);
}

getLocation()