"use strict";

const P = new Pokedex.Pokedex();
let genCheckBoxes = document.querySelectorAll(".genOptions");
let allowedRegionalForms = document.getElementById("regional-forms");
let allowedSuperForms = document.getElementById("super-forms");
let allowedAltForms = document.getElementById("alt-forms");
let genArray = [];
let pokeArray = [];

const ranNum = function (num, offset = 0) {
  return Math.trunc(Math.random() * num + offset);
};

const getPokemonArray = async function (generation) {
  return generation.pokemon_species;
};
let timer;
const getPokemonByGen = async function (genNum) {
  return await P.getGenerationByName(genNum).then(async function (response) {
    let selectedGens = [];
    if (Array.isArray(response)) {
      for (let i = 0; i < response.length; i++) {
        const pokeArr = await getPokemonArray(response[i]);
        selectedGens.push(...pokeArr);
      }
    } else {
      const pokeArr = await getPokemonArray(response);
      selectedGens.push(...pokeArr);
    }
    return selectedGens;
  });
};

const regionalForm = function (name) {};

const pokemonHandler = async function () {
  let checkedGenArray = Array.from(genCheckBoxes).filter((gen) => gen.checked);
  let pokemonName = pokeArray[ranNum(pokeArray.length)].name;
  let randomPoke = await P.getPokemonSpeciesByName(pokemonName);

  genArray = checkedGenArray.map((gen) => Number(gen.value));
  pokeArray = await getPokemonByGen(genArray);

  if (randomPoke.varieties.length > 1) {
    let pokemonForms = randomPoke.varieties;
    if (!allowedSuperForms.checked) {
      //filter out the bad forms by checking the name
      pokemonForms = pokemonForms.filter((forme) => forme.pokemon.name);
    }
    randomPoke = pokemonForms[ranNum(pokemonForms.length)];
    pokemonName = randomPoke.pokemon.name;
  } else {
    pokemonName = randomPoke.name;
  }
  const randomPokeFull = await P.getPokemonByName(pokemonName);
  console.log(randomPokeFull);
  console.log(randomPoke);
};
function countDown(i, callback) {
  //callback = callback || function(){};
  timer = setInterval(function () {
    document.getElementById("timerNum").textContent = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
}

(async () => {
  document
    .getElementById("PokeStart")
    .addEventListener("click", async function () {
      pokemonHandler();
    });
})();
