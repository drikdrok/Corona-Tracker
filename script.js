let globalDataToday;
let selectedAllTimeData;

let countries = [];

let chart;

//https://api.covid19api.com/summary
//https://jsonplaceholder.typicode.com/users

async function getData(){
	let response = await fetch("https://api.covid19api.com/summary");
	globalDataToday = await response.json();


	let select = document.getElementById("selectCountry");
	globalDataToday.Countries.forEach((item, index) => {
		countries[item.Country] = index //Create a map of each country and its index
		var option = document.createElement("option"); //Populate select
		option.value = index;
		option.text	= item.Country;
		select.appendChild(option);
	}); 

	updateContent();
}

//"https://api.covid19api.com/dayone/country/" + country.toLowerCase()
async function updateChart(country){
	response = await fetch("https://api.covid19api.com/total/dayone/country/" + country.toLowerCase() + "/status/confirmed");
	let selectedAllTimeConfirmed = await response.json();
	response = await fetch("https://api.covid19api.com/total/dayone/country/" + country.toLowerCase() + "/status/deaths");
	let selectedAllTimeDeaths = await response.json();

	let labels = [];
	let confirmedData = [];
	let deathsData = []

	//console.log(selectedAllTimeDeaths);

	selectedAllTimeConfirmed.forEach((item, index) =>{
		var date = item.Date;
		var year = date.slice(0, 4);
		var month = date.slice(5, 7);
		var day = date.slice(8, 10);

		labels.push(day + "/" + month + "/" + year);
		confirmedData.push(item.Cases);	
		deathsData.push(selectedAllTimeDeaths[index].Cases)
	});

	chart.data.labels = labels;
	chart.data.datasets[0].data = confirmedData;
	chart.data.datasets[1].data = deathsData;

	chart.update();

	//console.log(data);
	//console.log(selectedAllTimeData)
}

function updateContent(){
	let select = document.getElementById("selectCountry");
	let country = select.options[select.selectedIndex].value;
	let countryData = globalDataToday.Countries[country];


	document.getElementById("newCases").innerHTML = "New Cases: " + countryData.NewConfirmed;
	document.getElementById("newDeaths").innerHTML = "New Deaths: " + countryData.NewDeaths;
	document.getElementById("newRecovered").innerHTML = "New Recovered: " + countryData.NewRecovered;
	document.getElementById("totalConfirmed").innerHTML = "Total Confirmed: " + countryData.TotalConfirmed;
	document.getElementById("totalDeaths").innerHTML = "Total Deaths: " + countryData.TotalDeaths;

	console.log(select.options[select.selectedIndex].text);
	updateChart(select.options[select.selectedIndex].text);
}


window.onload = function(){
	getData();
	configureChart();
}




//Chart stuff



function configureChart(){
	var ctx = document.getElementById('trendChart').getContext('2d');
	chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Total Confirmed Cases',
            backgroundColor: 'rgb(12, 104, 250)',
            borderColor: 'rgb(12, 104, 250)',
            data: []
        },
		{
            label: 'Total Deaths',
            backgroundColor: 'rgb(252, 3, 3)',
            borderColor: 'rgb(252, 3, 3)',
            data: []
        }
        ]
    },

    // Configuration options go here
    options: {
	    responsive: true,
	    maintainAspectRatio: false,
	    scales: {
	    }
	}
	});

	chart.canvas.parentNode.style.width = '800px';
	chart.canvas.parentNode.style.height = '400px';
}