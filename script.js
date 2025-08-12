const form = document.getElementById("pokemon-form");
const pokemonContainer = document.getElementById("pokemon-container");
const errorDiv = document.getElementById("error");
const loading = document.getElementById("loading");

// add event listener to clear

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // clear previous cards

  pokemonContainer.innerHTML = "";
  errorDiv.classList.add("hidden");

  // catch count and type of character
  const count = document.getElementById("pokemon-count").value;
  const type = document.getElementById("pokemon-type").value;

  if (!count || !type) {
    showError("Please fill the fiels first");
    return;
  }

  loading.classList.remove("hidden");

  try {
    // list of pokemon
    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!typeRes.ok) throw new Error("Failes to fetch pokemon type!!");
    const typeData = await typeRes.json();
    console.log(typeData);

    const pokemonList = typeData.pokemon.slice(0, count );

    // fetch detalis of each pokemon

    const pokemonDetails = await Promise.all(
        pokemonList.map(async (p) =>{
            const res = await fetch(p.pokemon.url);
            if(!res.ok) throw new Error('Failed to fetch Pokemon detalis!!')
            return res.json();
    
        })
    );

    // render card 
    pokemonDetails.forEach(renderCard);

  } catch (err) {
    showError(err.message);
  } finally {
    loading.classList.add("hidden");
  }

});

function renderCard(detials){
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const img = document.createElement("img");
    img.src = detials.sprites.front_default || "";
    img.alt = detials.name;

    const name = document.createElement("div");
    name.classList.add("pokemon-name");
    name.textContent = detials.name;

    const types = document.createElement("div");
    types.classList.add("pokemon-types");
    detials.types.forEach(t => {
        const typeBadge = document.createElement("span");
        typeBadge.classList.add("type-badge", `type-${t.type.name}`);
        typeBadge.textContent = t.type.name;
        types.appendChild(typeBadge);
    });

     card.appendChild(img);
    card.appendChild(name);
    card.appendChild(types);

    pokemonContainer.appendChild(card);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden")
}    
