// fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Could not fetch. Pokemon doesn't seem to be valid");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.error(err));

fetchData();

async function fetchData(params) {
  try {
    const pokemonName = document
      .getElementById("pokemonName")
      .value.toLowerCase();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    );
    if (!response.ok) {
      throw new Error("Could not fetch. Pokemon doesn't seem to be valid");
    }

    const data = await response.json();
    console.log(data);

    const pokemonSprite = data.sprites.front_default;
    const imgElement = document.getElementById("pokemonSprite");

    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";
  } catch (err) {
    console.error(err);
  }
}
