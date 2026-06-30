const houseContainer = document.getElementById("houseContainer");
const searchInput = document.getElementById("searchInput");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// DISPLAY HOUSES
function displayHouses(list){

    houseContainer.innerHTML = "";

    list.forEach(h => {

        const isFav = favorites.includes(h.id);

        const card = document.createElement("div");
        card.className = "house-card";

        card.innerHTML = `
            <img src="${h.image}">

            <div class="house-content">

                <h3>${h.title}</h3>
                <p>${h.location}</p>

                <div class="price">
                    KES ${h.price.toLocaleString()}
                </div>

                <p>${h.bedrooms} Bed • ${h.bathrooms} Bath</p>

                <div class="btn-row">

                    <button class="view-btn">View Details</button>

                    <button class="fav-btn">
                        ${isFav ? "❤️" : "🤍"}
                    </button>

                </div>

            </div>
        `;

        // DETAILS
        card.querySelector(".view-btn").addEventListener("click", () => {
            openModal(h);
        });

        // FAVORITES
        card.querySelector(".fav-btn").addEventListener("click", () => {
            toggleFavorite(h.id);
        });

        houseContainer.appendChild(card);
    });
}

// FAVORITES
function toggleFavorite(id){

    if(favorites.includes(id)){
        favorites = favorites.filter(f => f !== id);
    }else{
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayHouses(houses);
}

// SEARCH
searchInput.addEventListener("input", (e)=>{

    const val = e.target.value.toLowerCase();

    const filtered = houses.filter(h =>
        h.title.toLowerCase().includes(val) ||
        h.location.toLowerCase().includes(val)
    );

    displayHouses(filtered);
});

// MODAL
function openModal(house){

    let index = 0;

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="modal-content">

            <span class="close">&times;</span>

            <div class="slider">

                <button class="prev">❮</button>

                <img id="modalImg" src="${house.images[0]}">

                <button class="next">❯</button>

            </div>

            <h2>${house.title}</h2>
            <p>${house.location}</p>

            <h3>KES ${house.price.toLocaleString()}</h3>

            <p>${house.description}</p>

            <button class="map-btn">📍 View on Map</button>

            <div class="modal-btns">

                <a href="tel:${house.phone}" class="call">Call</a>

                <a href="https://wa.me/${house.phone.replace('+','')}" target="_blank" class="whatsapp">WhatsApp</a>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const img = modal.querySelector("#modalImg");

    modal.querySelector(".next").onclick = () => {
        index = (index + 1) % house.images.length;
        img.src = house.images[index];
    };

    modal.querySelector(".prev").onclick = () => {
        index = (index - 1 + house.images.length) % house.images.length;
        img.src = house.images[index];
    };

    modal.querySelector(".map-btn").onclick = () => {
        window.open(`https://www.google.com/maps?q=${house.location}`, "_blank");
    };

    modal.querySelector(".close").onclick = () => modal.remove();

    modal.onclick = (e) => {
        if(e.target === modal) modal.remove();
    };
}

// INIT
displayHouses(houses);

// DARK MODE
const darkToggle = document.getElementById("darkToggle");

if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

});

const bedFilter = document.getElementById("bedFilter");
const priceFilter = document.getElementById("priceFilter");

function applyFilters(){

    let filtered = [...houses];

    if(bedFilter.value){
        filtered = filtered.filter(h =>
            h.bedrooms == bedFilter.value
        );
    }

    if(priceFilter.value){
        filtered = filtered.filter(h =>
            h.price <= parseInt(priceFilter.value)
        );
    }

    displayHouses(filtered);
}

bedFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);
const featuredContainer = document.getElementById("featuredContainer");

// FEATURED (first 3 houses)
function loadFeatured(){
    const featured = houses.slice(0,3);
    renderFeatured(featured);
}

function renderFeatured(list){

    featuredContainer.innerHTML = "";

    list.forEach(h => {

        featuredContainer.innerHTML += `
        <div class="house-card">

            <img src="${h.image}">

            <div class="house-content">

                <h3>⭐ ${h.title}</h3>
                <p>${h.location}</p>

                <div class="price">
                    KES ${h.price.toLocaleString()}
                </div>

                <button class="view-btn">View</button>

            </div>

        </div>
        `;
    });
}

loadFeatured();
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});