class myPokemon{
	constructor (name, id, img, type){
	this.name = name
	this.id   = id
	this.img  = img
	this.type = type
	}
}

var pokemonList = [];

// Make a request to the API, convert it into json and add a myPokemon object to the list.
for(let i = 1; i <= 386; i++){
	pokemonList.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
	.then((res) => {return res.json()}).then((data)=>{
		console.log(data)
		return new myPokemon(data.name,data.id, data.sprites['front_default'],data.types );
	}))
}

Promise.all(pokemonList)  //Wait for every result to load before showing them to the user.
 .then((result) => {
 	let pkmInfo = document.querySelector('.pokmnInfo');
 	let newRow  = document.createElement('div');
 	newRow.classList.add('row');
 	pkmInfo.appendChild(newRow)

 	for(let i = 1; i <= 386; i++){ // Creating each pokemon card.
 		let pkmName = result[i - 1].name;
 		let pkmId   = result[i - 1].id;
 		let pkmImg  = result[i - 1].img;
 		let pkmType = getPrimaryType(result[i - 1].type); // Pokemon's main type.
		let newDiv  = document.createElement('div');
 		let imgElem = document.createElement('img');
 		let tipeDiv = document.createElement('div');
 		imgElem.src = pkmImg;
 		

 				// Creating and styling each card.
 		tipeDiv.classList.add('PkmType');
 		tipeDiv.innerHTML = pkmType;

 		newDiv.classList.add('col-md-2');  
 		newDiv.classList.add('pokemon-card');
 		newDiv.classList.add(`pokemon-${i}`); // Each pokemon has a class that identifies them.
 		newDiv.innerHTML = `N. ${pkmId}  ${pkmName}`;
 		newDiv.style.backgroundColor = getBackgroundColor(pkmType);
 		//newDiv.onclick = displayInfoScreen(result[i - 1]);

 		newDiv.appendChild(tipeDiv);
 		newDiv.appendChild(imgElem);
 		newRow.appendChild(newDiv);
 	}
 })




 function getBackgroundColor(pokmType){
 	const objColors = {
 		fire: '#d95e3f',
 		water: '#5aaedb',
 		grass: '#48bd5f',
 		flying: '#8ba9d9',
 		poison: '#8d5bab',
 		electric: '#d1b91f',
 		bug: '#8bc26b',
 		psychic: '#c25fa4',
 		fighting: '#c28a5f', 
 		rock: '#9e7642',
 		ground: '#7d5725',
 		normal: '#a8a090',
 		fairy: '#d492d4',
 		ice: '#96d0d9',
 		dragon: '#a81828',
 		steel: '#809296',
 		ghost: '#6060b0',
 		dark: '#4d5054'

 	}
 	// pokmType has to be in square brackets because the parameter passed to the function it's a string
 	return objColors[pokmType];  
 }


function displayInfoScreen(pkmId){
	let infoScreen = querySelector('.pkmInfoScreen');
}

function searchPkm(){
	Promise.all(pokemonList).then((result) =>{
		let input = document.querySelector('.searcher').value;
		input = input.toLowerCase();
		for(let i = 1; i < pokemonList.length; i++){
			if(result[i].name == input || result[i].id == input){
				let goTo = document.querySelector(`.pokemon-${result[i].id}`);
 				goTo.scrollIntoView({block: "center"});
			}
		}
	})
}

function getPrimaryType(types){ 
	if(types.length >= 2){
		if(types[0].type.name == 'normal'){
			return types[1].type.name;

		}else if(types[1].type.name == 'normal'){
			return types[0].type.name;

		}else{
			return types[1].type.name;}
		
	}else{
		return types[0].type.name
	}
}