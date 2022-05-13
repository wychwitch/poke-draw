"use strict";

const P = new Pokedex.Pokedex();
let genCheckBoxes = document.querySelectorAll(".genOptions");
let genArray = [];
let pokeArray = [];
let randomPoke;
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

const pokemonHandler = async function () {
  let checkedGenArray = Array.from(genCheckBoxes).filter((gen) => gen.checked);
  genArray = checkedGenArray.map((gen) => Number(gen.value));
  console.log(genArray);
  pokeArray = await getPokemonByGen(genArray);
  console.log(pokeArray);
};

function countDown(i, callback) {
  //callback = callback || function(){};
  timer = setInterval(function () {
    document.getElementById("timerNum").textContent = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
}

(async () => {
  const golduck = await P.getPokemonByName("golduck");
  console.log(golduck);
  document
    .getElementById("PokeStart")
    .addEventListener("click", async function () {
      const eevee = await P.getPokemonByName("eevee");
      console.log(eevee);
      console.log("aaafuc");
      pokemonHandler();
    });
})();
