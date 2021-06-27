let file;

L.mapbox.accessToken = 'pk.eyJ1IjoiaWtrb2IiLCJhIjoiY2twMmY3b3prMWpvYjJvbXczdzk0OHF1ZSJ9.6j0RtV05VwqttLIR0RfWJg';
var map = L.mapbox.map('map')
    .setView([37.8, -96], 4)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

map.zoomControl.setPosition('bottomleft');

//Import file
document.getElementById('input').addEventListener('change', (e) => {
    file = e.target.files[0];
    fileName = e.target.files[0].name;
})
document.getElementById('button').addEventListener('click', () => {
    let xlsExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    let fileReader = new FileReader();

    switch (xlsExtension.toLowerCase()) {
        case 'xls':
        case 'xlsx':
            fileReader.readAsBinaryString(file);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let excelFile = XLSX.read(data, { type: "binary" });
                excelFile.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(excelFile.Sheets[sheet]);
                    // console.log(rowObject);
                    rowObject.forEach(row => {
                        let lat = row.latitude;
                        let long = row.longitude;

                        map.setView([0, 115], 5);
                        L.circle([lat, long], {
                            color: getColor(row.altitude),
                            fillColor: getColor(row.altitude),
                            fillOpacity: 0.5,
                            radius: 5000
                        }).bindPopup(`<p>Bandara ${row.Bandara}</p>`).addTo(map);
                    })
                })
            }
            break;
        case 'json':
            fileReader.readAsText(file);
            fileReader.onload = (e) => {
                let data = JSON.parse(e.target.result);
                document.getElementById('input').value = '';
                console.log(data.features);
            }
            break;
    }

    function getColor(alt) {
        return alt > 1500 ? '#760000' :
            alt > 1100 ? '#960000' :
                alt > 700 ? '#B80000' :
                    alt > 300 ? '#2F9C7C' :
                        alt > 150 ? '#59B57C' :
                            alt > 100 ? '#89CE78' :
                                alt > 80 ? '#CE7900' :
                                    alt > 50 ? '#FF4E00' :
                                        alt > 40 ? '#E23E58' :
                                            alt > 30 ? '#F86E4C' :
                                                alt > 20 ? '#FF9D46' :
                                                    alt > 10 ? '#FFCB51' :
                                                        '#F9F871';

    }

});
