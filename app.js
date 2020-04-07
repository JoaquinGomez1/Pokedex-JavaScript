class myPokemon{
	constructor (name, id, img, type,abilities, stats){
	this.name = name
	this.id   = id
	this.img  = img
	this.type = type
	this.abilities = abilities
	this.stats = stats
	}
}

var pokemonList = [];
let input = document.querySelector('.searcher');
let pokemonGenerationAmount = 150;


// Make a request to the API, convert it into json and add a myPokemon object to the list.
for(let i = 0; i <= pokemonGenerationAmount; i++){
	pokemonList.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`) // adding +1 to i because pokemon's Id's start at one
	.then((res) => {return res.json()}).then((data)=>{
		return new myPokemon(data.name,data.id, data.sprites['front_default']
			,data.types, data.abilities[0].ability.name, data.stats);
	}))
}

Promise.all(pokemonList)  //Wait for every result to load before showing them to the user.
 .then((result) => {
 	let pkmInfo = document.querySelector('.pokmnInfo');
 	let newRow  = document.createElement('div');
 	newRow.classList.add('row');
 	pkmInfo.appendChild(newRow)

 	for(let i = 0; i <= pokemonGenerationAmount; i++){ // Creating each pokemon card.
 		let pokemon = result[i]	// 
 		let pkmName = pokemon.name;
 		let pkmId   = pokemon.id;
 		let pkmImg  = pokemon.img;
 		let pkmType = getPrimaryType(pokemon.type); // Pokemon's main type.
		let newDiv  = document.createElement('div');
 		let imgElem = document.createElement('img');
 		let tipeDiv = document.createElement('div');
 		imgElem.src = pkmImg;
 		

 				// Creating and styling each card.
 		tipeDiv.classList.add('PkmType');
 		tipeDiv.innerHTML = pkmType;

 		newDiv.classList.add('col-md-2');  
 		newDiv.classList.add('pokemon-card');
 		newDiv.setAttribute('id', `pokemon-${pkmId}`) // Each pokemon has a class that identifies them.
 		newDiv.setAttribute('onclick', `displayModal(${pkmId})`)
 		newDiv.innerHTML = `N. ${pkmId}  ${pkmName}`;
 		newDiv.style.backgroundColor = getBackgroundColor(pkmType);

 		newDiv.appendChild(tipeDiv);
 		newDiv.appendChild(imgElem);
 		newRow.appendChild(newDiv);
 	}
 })

 	// If the users presses the enter key trigger 'searchBtn()'
input.addEventListener('keyup', (event) =>{
	if(event.keyCode === 13){
		event.preventDefault()
		document.getElementById("searchBtn").click();
	} 
})


function searchPkm(){
	Promise.all(pokemonList).then((result) =>{
		input = document.querySelector('.searcher')
		input = input.value.toLowerCase();
		for(let i = 0; i < pokemonList.length; i++){
			if(result[i].name == input || result[i].id == input){
				let goTo = document.getElementById(`pokemon-${result[i].id}`);
 				goTo.scrollIntoView({block: "center"});
 				displayModal(result[i].id);

			}
		}
	})
}


function displayModal(pokemonId){
	let infoScr     = document.querySelector('.infoScr');
	let closeBtn    = document.querySelector('.closeInfoScr');
	let infoContent = document.querySelector('.scrPkmInfo');
	let documentsList = []
	let documentsClasses = ['pkmImgInfo', 'pkmNameInfo',
	'pkmTypesInfo', 'pkmIdInfo','pkmStatsInfo','pkmAbilitiesInfo']
	let classesAmount = documentsClasses.length;

	for(let i = 0; i < classesAmount; i++){
		if(documentsClasses[i] == 'pkmImgInfo'){
			let thisDocument = document.createElement('img')
			thisDocument.classList.add(documentsClasses[i])
			documentsList.push(thisDocument)
		}else{
			let thisDocument = document.createElement('div')
			thisDocument.classList.add(documentsClasses[i])
			documentsList.push(thisDocument)
		}
	}

	infoScr.style.display = 'block';
	createModalContent(pokemonId, documentsList);

			// Closing infoScreen:
	window.addEventListener('keyup', (event)=>{
		if(event.key == 'Escape' && infoScr.style.display != 'none'){
			infoScr.style.display = 'none';
			closeModal(documentsClasses);
		}
	})

	window.onclick = (event)=>{
		if(event.target == infoScr){
			infoScr.style.display = 'none';
			closeModal(documentsClasses);
		}
	}

	closeBtn.onclick = ()=>{
		infoScr.style.display = 'none';
		closeModal(documentsClasses);
	}
}

function createModalContent(pokemonId, documentsList){ // TODO: improve if/else logic.
	Promise.all(pokemonList).then((result)=>{  // Creating the modal's content
		let thisPokemon = result[pokemonId - 1]
		let pokemonAttributes = ['img','name', 'types', 'id', 'stats','abilities']
		let pokemonTypesList = getBothTypes(thisPokemon);
		let pokemonStatsList = getPokemonStats(thisPokemon);
		let infoContent = document.querySelector('.scrPkmInfo');

		for(let i = 0; i < pokemonAttributes.length; i++){
			if(pokemonAttributes[i] == 'img'){
				documentsList[i].src = thisPokemon.img;
				infoContent.appendChild(documentsList[i]);
			}else if(pokemonAttributes[i] == 'types'){
				documentsList[i].innerHTML = pokemonTypesList;
				infoContent.appendChild(documentsList[i]);
			}else if(pokemonAttributes[i] == 'stats'){
				documentsList[i].innerHTML = pokemonStatsList.join('<br>');
				infoContent.appendChild(documentsList[i]);
			}else if(pokemonAttributes[i] == 'id'){
				documentsList[i].innerHTML = 'Id Number: '+ thisPokemon[pokemonAttributes[i]];
				infoContent.appendChild(documentsList[i]);
			}
			else if(pokemonAttributes[i] == 'abilities'){
				documentsList[i].innerHTML = 'Ability: ' + thisPokemon[pokemonAttributes[i]];
				infoContent.appendChild(documentsList[i]);
			}
			else{
				documentsList[i].innerHTML = thisPokemon[pokemonAttributes[i]];
				infoContent.appendChild(documentsList[i]);
			}
		}
	})
}

function closeModal(documentsClasses){
	let classesAmount = 6;
	let infoContent = document.querySelector('.scrPkmInfo');
	for(let i = 0; i < classesAmount; i++){
		let element = document.querySelector(`.${documentsClasses[i]}`);
		infoContent.removeChild(element);
	}
}

function getBackgroundColor(pokmType){
 	const COLORS_BY_TYPE = {
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
 	return COLORS_BY_TYPE[pokmType];  
}

function getBothTypes(pokemon){
			if(pokemon.type.length == 2){
					return `${pokemon.type[0].type.name} - ${pokemon.type[1].type.name}`
			}else{
				return pokemon.type[0].type.name;
			}
}

function getPokemonStats(pokemon){
	let list = []
	for(let i = 0; i < pokemon.stats.length; i++){
		list.push(`${pokemon.stats[i].stat.name}: ${pokemon.stats[i].base_stat}`)
	}
	return list
}


function getPrimaryType(types){ 
	if(types.length >= 2){
		if(types[0].type.name == 'normal'){  // if there is more than one type ignores the normal type 
			return types[1].type.name;

		}else if(types[1].type.name == 'normal'){
			return types[0].type.name;

		}else{
			return types[1].type.name;}
		
	}else{
		return types[0].type.name
	}
}
