"use strict";

const P = new Pokedex.Pokedex();
let genCheckBoxes = document.querySelectorAll(".genOptions");
let disAllowedRegionalForms = document.getElementById("regional-forms");
let disAllowedSuperForms = document.getElementById("super-forms");
let disAllowedAltForms = document.getElementById("alt-forms");
let pokeArray = [];

const ranNum = function (num) {
  const rnum = Math.trunc(Math.random() * num);
  console.log(`random num: ${rnum} ${num}`);
  return rnum;
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

const filterGens = function (gens) {
  let checkedGenArray = Array.from(gens).filter((g) => g.checked);
  let genArrayFiltered = checkedGenArray.map((g) => Number(g.value));
  if (genArrayFiltered.length > 0) {
    console.log(genArrayFiltered);
    console.log("returning gen array");
    return genArrayFiltered;
  } else {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }
};

const pokemonHandler = async function () {
  let genArray = filterGens(genCheckBoxes);
  pokeArray = await getPokemonByGen(genArray);
  console.log(pokeArray);

  let pokemonName = pokeArray[ranNum(pokeArray.length)].name;
  let randomPoke = await P.getPokemonSpeciesByName(pokemonName);
  if (randomPoke.varieties.length > 1) {
    let pokemonForms = randomPoke.varieties;
    if (disAllowedSuperForms.checked) {
      const formTypes = ["-mega", "-gmax"];
      //filter out the bad forms by checking the Type
      pokemonForms = pokemonForms.filter(
        (forme) =>
          !formTypes.some((formType) => forme.pokemon.name.includes(formType))
      );
    }
    if (disAllowedRegionalForms.checked) {
      const formTypes = ["-galar", "-alola"];
      pokemonForms = pokemonForms.filter(
        (forme) =>
          !formTypes.some((formType) => forme.pokemon.name.includes(formType))
      );
    }
    if (disAllowedAltForms.checked) {
      const formTypes = ["-galar", "-alola", "-mega", "-gmax"];
      console.log("disalowed alt forms entered");
      console.log(
        pokemonForms[0].pokemon.name,
        pokemonForms[0].is_default,
        formTypes.some(
          (formType) =>
            pokemonForms[0].pokemon.name.includes(formType) ||
            pokemonForms[0].is_default
        )
      );
      pokemonForms = pokemonForms.filter((forme) =>
        formTypes.some(
          (formType) =>
            forme.pokemon.name.includes(formType) || forme.is_default
        )
      );
    }
    console.log("after");
    console.log(pokemonForms);
    randomPoke = pokemonForms[ranNum(pokemonForms.length)];

    pokemonName = randomPoke.pokemon.name;
  }
  const randomPokeFull = await P.getPokemonByName(pokemonName);
  //console.log(randomPokeFull);
  console.log(pokemonName);
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
