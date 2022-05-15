"use strict";

const P = new Pokedex.Pokedex();
const pokeImage = document.getElementById("poke-image");
const pokeName = document.getElementById("poke-name");
const loadingWheel = document.getElementById("loading-wheel");
const timerNum = document.getElementById("timerNum");
const timeValue = document.getElementById("time-value");
const submitButton = document.getElementById("PokeStart");
let disAllowedRegionalForms = document.getElementById("regional-forms");
let disAllowedSuperForms = document.getElementById("super-forms");
let disAllowedAltForms = document.getElementById("alt-forms");
let randomPokeFull;
let randomPokeName;

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
  pokeImage.classList.remove("hidden");
  timerNum.classList.add("hidden");
  submitButton.removeAttribute("disabled", "");
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
  randomPokeName = await pokeArray[ranNum(pokeArray.length)].name;
  let randomPoke = await P.getPokemonSpeciesByName(randomPokeName);
  console.log(`from array ${randomPokeName}`);

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
    if (!isNameSet) {
      pokeName.textContent = formatName(pokemonName);
      isNameSet = true;
    }
    timerNum.innerHTML = i;
    i-- || (clearInterval(timer), callback());
  }, 1000);
};

const resetState = function () {
  pokeImage.src = "";
  pokeImage.classList.add("hidden");
  timerNum.classList.remove("hidden");
  pokeName.textContent = "";
};

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

(async () => {
  console.log(formatName("moewth-galar"));
  submitButton.addEventListener("click", function () {
    timerNum.innerHTML =
      '<span id="loading-wheel" class="iconify" data-icon="eos-icons:bubble-loading"  data-width="100"></span>';
    console.log(timerNum.innerHTML);
    submitButton.setAttribute("disabled", "");
    resetState();
    pokemonHandler();
  });
})();
