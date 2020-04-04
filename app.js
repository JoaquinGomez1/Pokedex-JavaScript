class myPokemon{
	constructor (name, id, img, type){
	this.name = name
	this.id   = id
	this.img  = img
	this.type = type
	}
}

var pokemonList = [];

// Make a request to the APO, convert it into json and add a myPokemon object to the list.
for(let i = 1; i <= 151; i++){
	pokemonList.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
	.then((res) => {return res.json()}).then((data)=>{
		return new myPokemon(data.name,data.id, data.sprites['front_default'],data.types );
	}))
}

Promise.all(pokemonList)  //Wait for every result to load before showing them to the user.
 .then((result) => {
 	let pkmInfo = document.querySelector('.pokmnInfo');
 	let newRow  = document.createElement('div');
 	newRow.classList.add('row');
 	pkmInfo.appendChild(newRow)

 	for(let i = 1; i <= 151; i++){ // Empezamos a crear los contenedores de cada pokemón.
 		let pkmName = result[i - 1].name;
 		let pkmId   = result[i - 1].id;
 		let pkmImg  = result[i - 1].img;
 		let pkmType = getPrimaryType(result[i - 1].type); // Este es el tipo principal del pokemon.
		let newDiv  = document.createElement('div');
 		let imgElem = document.createElement('img');
 		let tipeDiv = document.createElement('div');
 		imgElem.src = pkmImg;
 		

 				// Creating and styling each card.
 		tipeDiv.classList.add('PkmType');
 		tipeDiv.innerHTML = pkmType;

 		newDiv.classList.add('col-md-2');  
 		newDiv.classList.add('pokemon-card');
 		newDiv.classList.add(`pokemon-${i}`); // Each pokemon has an class that identifies them.
 		newDiv.innerHTML = `N°: ${pkmId}  ${pkmName}`;
 		newDiv.style.backgroundColor = getBackgroundColor(pkmType);

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
 		normal: '#546170',
 		fairy: '#cf257d',
 		ice: '#96d0d9',
 		dragon: '#a81828',
 		steel: '#809296',
 		ghost: '#957699'

 	}
 	return objColors[pokmType];  // pokmType has to be in square brackets because it's a string
 }


function searchPkm(){
 	let input = document.querySelector('.searcher').value;
 	let goTo = document.querySelector(`.pokemon-${input}`);
 	console.log(input);
 	goTo.scrollIntoView();
}

/* The API returns a list wich contains each pokemon type.
if a pokemon has two different types it's main one is the one in the first index*/
function getPrimaryType(types){ 
	if(types.length >= 2){
		return types[1].type.name
	}else{
		return types[0].type.name
	}
}