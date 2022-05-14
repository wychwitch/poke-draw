"use strict";

const P = new Pokedex.Pokedex();
const pokeImage = document.getElementById("poke-image");
const pokeName = document.getElementById("poke-name");
const loadingWheel = document.getElementById("loading-wheel");

let disAllowedRegionalForms = document.getElementById("regional-forms");
let disAllowedSuperForms = document.getElementById("super-forms");
let disAllowedAltForms = document.getElementById("alt-forms");

const filterPokemonList = function (
  pokemonArr,
  pokemonFormArr,
  notReverse = false
) {
  if (notReverse) {
    return pokemonArr.filter((forme) =>
      pokemonFormArr.some((formType) => forme.pokemon.name.includes(formType))
    );
  }
  return pokemonArr.filter(
    (forme) =>
      !pokemonFormArr.some((formType) => forme.pokemon.name.includes(formType))
  );
};

const ranNum = function (num) {
  const rnum = Math.trunc(Math.random() * num);
  console.log(`random num: ${rnum} ${num}`);
  return rnum;
};

const setPokeImage = function (imageUrl) {
  pokeImage.src = imageUrl;
};

const getPokemonArray = async function (generation) {
  return generation.pokemon_species;
};

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
  const genCheckBoxes = document.querySelectorAll(".genOptions");
  const genArray = filterGens(genCheckBoxes);
  let pokeArray = await getPokemonByGen(genArray);
  let randomPokeName = pokeArray[ranNum(pokeArray.length)].name;
  let randomPoke = await P.getPokemonSpeciesByName(randomPokeName);

  if (randomPoke.varieties.length > 1) {
    let pokemonForms = randomPoke.varieties;
    if (disAllowedSuperForms.checked) {
      //filter out the bad forms returning forms that ARENT these types
      pokemonForms = filterPokemonList(pokemonForms, ["-mega", "-gmax"]);
    }

    if (disAllowedRegionalForms.checked) {
      //filter out the bad forms returning forms that ARENT these types
      pokemonForms = filterPokemonList(pokemonForms, ["-galar", "-alola"]);
    }

    if (disAllowedAltForms.checked) {
      //filter out the bad forms returning forms that ARE these types OR default
      pokemonForms = filterPokemonList(
        pokemonForms,
        ["-galar", "-alola", "-mega", "-gmax"],
        false
      );
    }
    console.log("after");
    console.log(pokemonForms);
    randomPoke = pokemonForms[ranNum(pokemonForms.length)];

    randomPokeName = randomPoke.pokemon.name;
  }

  const randomPokeFull = await P.getPokemonByName(randomPokeName);

  console.log(randomPokeName);

  //make new function to display image based on if the user chose original game sprites, or official art

  const pokeImageUrl =
    randomPokeFull.sprites.other["official-artwork"].front_default;

  pokeName.textContent = await randomPokeFull.name;

  countDown(5, () => {
    setPokeImage(pokeImageUrl);
  });
};

const countDown = function (i, callback) {
  //callback = callback || function(){};
  loadingWheel.classList.remove("hidden");
  let timer = setInterval(function () {
    document.getElementById("timerNum").textContent = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
};

(async () => {
  document
    .getElementById("PokeStart")
    .addEventListener("click", async function () {
      pokemonHandler();
    });
})();
