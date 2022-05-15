"use strict";

const P = new Pokedex.Pokedex();
const pokeImage = document.getElementById("poke-image");
const pokeName = document.getElementById("poke-name");
const timerNum = document.getElementById("timerNum");
const submitButton = document.getElementById("PokeStart");

let randomPokeName;

//Filters the pokemon list
const filterPokemonList = function (
  pokemonArr,
  pokemonFormArr,
  notReverse = false
) {
  // if the filter doesnt need to be reversed
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

// random number function
const ranNum = function (max, min) {
  const rnum = Math.trunc(Math.random() * max);
  console.log(`random num: ${rnum} ${max}`);
  return rnum;
};

// set's the pokemon img src to the correct url, also hides and unhides
const setPokeImage = function (imageUrl) {
  pokeImage.src = imageUrl;
  pokeImage.classList.remove("hidden");
  timerNum.classList.add("hidden");
  submitButton.removeAttribute("disabled", "");
};

// just grabs the species
const getPokemonArray = async function (generation) {
  return generation.pokemon_species;
};

// Grabs all the pookemon in the generation(s)
const getPokemonByGen = async function (genNum) {
  return await P.getGenerationByName(genNum).then(async function (response) {
    let selectedGens = [];
    // if the response is an array of generations
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

// filters out any gens that weren't selected
const filterGens = function (gens) {
  // makes a new array from all the generation checkboxes that were checked
  let checkedGenArray = Array.from(gens).filter((g) => g.checked);
  let genArrayFiltered = checkedGenArray.map((g) => Number(g.value));

  // if no generations were selected, return them all
  if (genArrayFiltered.length > 0) {
    console.log(genArrayFiltered);
    console.log("returning gen array");
    return genArrayFiltered;
  } else {
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }
};

// The big boi main function. Probably needs to be split up into others
const pokemonHandler = async function () {
  const disAllowedRegionalForms = document.getElementById("regional-forms");
  const disAllowedSuperForms = document.getElementById("super-forms");
  const disAllowedAltForms = document.getElementById("alt-forms");
  const timeValue = document.getElementById("time-value");
  const genCheckBoxes = document.querySelectorAll(".genOptions");
  const genArray = filterGens(genCheckBoxes);
  let randomPokeFull;
  let pokeArray = await getPokemonByGen(genArray);
  randomPokeName = await pokeArray[ranNum(pokeArray.length)].name;

  let randomPoke = await P.getPokemonSpeciesByName(randomPokeName);
  console.log(`from array ${randomPokeName}`);

  // if there's more than one form, select randomly from them
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
      //filter out the bad forms returning forms that ARE these types OR the default form
      pokemonForms = filterPokemonList(
        pokemonForms,
        ["-galar", "-alola", "-mega", "-gmax"],
        false
      );
    }
    randomPoke = pokemonForms[ranNum(pokemonForms.length)];
    randomPokeName = randomPoke.pokemon.name;
  }

  randomPokeFull = await P.getPokemonByName(randomPokeName);

  console.log(randomPokeName);

  //TODO make new function to display image based on if the user chose original game sprites, or official art

  const pokeImageUrl =
    randomPokeFull.sprites.other["official-artwork"].front_default;

  countDown(Number(timeValue.value), async () => {
    setPokeImage(pokeImageUrl);
  });
};

const countDown = async function (i, callback) {
  //callback = callback || function(){}
  const pokemonName = await randomPokeName;
  let isNameSet = false;

  let timer = setInterval(function () {
    // sets the name in the html, only once
    if (!isNameSet) {
      pokeName.textContent = formatName(pokemonName);
      isNameSet = true;
    }
    timerNum.innerHTML = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
};

// dead dove
const resetState = function () {
  pokeImage.src = "";
  pokeImage.classList.add("hidden");
  timerNum.classList.remove("hidden");
  pokeName.textContent = "";
};

// capitalizes and optionally reformats name
const formatName = function (name) {
  const formNames = { Alola: "n", Galar: "ian" };

  name = name.charAt(0).toUpperCase() + name.substring(1);

  if (name.includes("-") && !name.includes("Porygon") && name !== "Ho-oh") {
    const dashIndex = name.indexOf("-");
    let formName =
      name.charAt(dashIndex + 1).toUpperCase() + name.substring(dashIndex + 2);
    const cleanName = name.substring(0, dashIndex);
    if (Object.keys(formNames).includes(formName)) {
      formName += formNames[formName];
    }
    return `${formName} ${cleanName}`;
  }
  return name;
};

// main function, must be async
(async () => {
  console.log(formatName("moewth-galar"));
  submitButton.addEventListener("click", function () {
    timerNum.innerHTML =
      '<span id="loading-wheel" class="iconify" data-icon="eos-icons:bubble-loading"  data-width="100"></span>';
    submitButton.setAttribute("disabled", "");
    resetState();
    pokemonHandler();
  });
})();
