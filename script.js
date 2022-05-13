"use strict";
let pokeArray = [];
let pokeArraySize;
let genCheckBoxes = document.querySelectorAll(".genOptions");
let genArray = [];
let randomPoke;

let timer;

function countDown(i, callback) {
  //callback = callback || function(){};
  timer = setInterval(function () {
    document.getElementById("timerNum").textContent = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
}

const P = new Pokedex.Pokedex();
const getPokemonArray = function (generation) {
  return generation.pokemon_species;
};
const getPokemonByGen = function (genNum) {
  return P.getGenerationByName(genNum).then(function (response) {
    let selectedGens = [];
    if (Array.isArray(response)) {
      for (let i = 0; i < response.length; i++) {
        selectedGens.push(...getPokemonArray(response[i]));
      }
    } else {
      selectedGens.push(...getPokemonArray(response));
    }
    return selectedGens;
  });
};

const pokemonHandler = function () {
  let checkedGenArray = Array.from(genCheckBoxes).filter((gen) => gen.checked);
  genArray = checkedGenArray.map((gen) => Number(gen.value));
  console.log(genArray);
  pokeArray = getPokemonByGen(genArray);

  pokeArray.then((response) => {
    console.log(response);
    P.getPokemonByName(
      response[Math.trunc(Math.random() * response.length)].name
    ).then((response) => {
      console.log(response);
      document.getElementById("poke-image").src =
        response.sprites.other["official-artwork"].front_default;
    });
  });
};
console.log(genCheckBoxes);

document.getElementById("PokeStart").addEventListener("click", function () {
  countDown(10, pokemonHandler);
});

P.getPokemonByName("meowth").then((response) => {
  console.log(response);
});
