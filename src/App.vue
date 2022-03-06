<!--
Say Hello World with Vue!
-->

<script>
export default {
  data() {
    
    return {
      message: 'Hello World!',
      checkedGens: [],
      selectedMon:1,
      genn:0,
      pokegens: [
        {genStart:1,
         genEnd:152
        },
         {genStart:152,
         genEnd:252
        },
         {genStart:252,
         genEnd:387
        },
         {genStart:387,
         genEnd:494
        },
         {genStart:494,
         genEnd:650
        },
         {genStart:650,
         genEnd:722
        },
         {genStart:722,
         genEnd:810
        },
         {genStart:810,
         genEnd:906
        },
        
      ],
      pokemon: require('pokemon'),
      pokeImage:""
    }
  },
  methods:{
    rollPokemon(){

      this.genn = parseInt(this.checkedGens[Math.floor((Math.random() * this.checkedGens.length))]);
      
      this.selectedMon = parseInt([Math.floor((Math.random() * ( this.pokegens[this.genn].genEnd - this.pokegens[this.genn].genStart)) + this.pokegens[this.genn].genStart)]);


      this.pokeImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.selectedMon}.png`


      //console.log(this.pokeImage)
    }
    
  }
}
</script>

<template>
  <input type="checkbox" id="gen1" v-model="checkedGens"  value="0">
  <label>1</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="1">
  <label>2</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="2">
  <label>3</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="3">
  <label>4</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="4">
  <label>5</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="5">
  <label>6</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="6">
  <label>7</label>
  <br>
  <input type="checkbox" id="gen1" v-model="checkedGens" value="7">
  <label>8</label>
  <br><br>
{{ pokemon.getName(selectedMon) }}
<br>
<img v-bind:src="pokeImage">
<p>
  {{checkedGens}}
  </p>
  
  <button @click="rollPokemon">
    Roll
  </button>
  
  <p>
    {{selectedMon}}
  </p>
  <p>
    {{genn}}
    <br>
    {{pokegens[1].genStart}}
    <br><br>
    

    <br><br>
    
  </p>
  
</template>