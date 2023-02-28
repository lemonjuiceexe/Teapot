const body = document.querySelector("body");
const rightWrapper = document.querySelector(".right-wrapper");
const artwork = document.querySelector(".artwork-img");
const artworkTitle = document.querySelector(".artwork-title");
const artworkAuthor = document.querySelector(".artwork-author");
const artworkDate = document.querySelector(".artwork-date");
const artworkOrigin = document.querySelector(".artwork-origin");
const artworkReload = document.querySelector(".artwork-reload");
const reloadInfo = document.querySelectorAll(".reload-limit-info");

const minReloadInterval = 5000;

let lastReload = new Date();

window.onload = reloadArtwork;

async function get(url){
    const response = await fetch(url);
    const json = await (await response).json();
    return json;
}

function reloadArtwork(){
    reloadInfo.forEach((el) => {el.innerText = (minReloadInterval / 1000).toFixed(1); });
    if(sessionStorage.getItem("alreadyFetching") != null && sessionStorage.getItem("alreadyFetching") == "true") { 
        artworkReload.classList.add("reload-disabled");
        setTimeout(() => { 
            sessionStorage.setItem("alreadyFetching", false);
            artworkReload.classList.remove("reload-disabled");
        }, minReloadInterval);
        return; 
    }

    // First visit to the page (not a reload)
    if(sessionStorage.getItem("notTheFirstTime" == null)){
        sessionStorage.setItem("notTheFirstTime", "t");
        
        fetchData();
    }
    lastReload = (sessionStorage.getItem("lastReload"));
    if(new Date() - lastReload > minReloadInterval){
        fetchData();
    }
    else{
        artworkReload.classList.add("reload-disabled");
        setTimeout(() => {
            fetchData();
        }, minReloadInterval - (new Date() - lastReload));
    }
}

//TODO: maybe exclude some categories. 38? arms
async function fetchData(){
    if(sessionStorage.getItem("alreadyFetching") != null && sessionStorage.getItem("alreadyFetching") == "true") { return; }
    sessionStorage.setItem("alreadyFetching", true);
    console.log("Fetching, time from the last fetch: ", new Date() - sessionStorage.getItem("lastReload"));
    if(!artworkReload.classList.contains("reload-disabled")){
        artworkReload.classList.add("reload-disabled");
    }
    
    // Check the total amount of artworks in the api
    let artworksAmount = 100;
    await get("https://api.artic.edu/api/v1/artworks?query[term][is_public_domain]=true&limit=1").then(data => {
        artworksAmount = data.pagination.total_pages;
        console.log("Artworks amount: ", artworksAmount);
    });
    // Get a random artwork
    let randomArtwork = Math.floor(Math.random() * artworksAmount + 1);
    await get(`https://api.artic.edu/api/v1/artworks?query[term][is_public_domain]=true&limit=1&page=${randomArtwork}&fields=id,title,artist_title,image_id,date_display,place_of_origin`).then(data => 
    {
        console.log(data.data[0]);

        // Edit the styles that appear only when the artwork's loaded
        rightWrapper.style.border = "none";
        if(window.innerWidth <= 1300){
            artworkAuthor.style.position = "relative";
            artworkDate.style.position = "relative";
            rightWrapper.style.padding_top = "0";
            artworkReload.style.top = "-50px";
        }

        artworkTitle.innerText = data.data[0].title;
        artworkAuthor.innerText = data.data[0].artist_title;
        artworkDate.innerText = data.data[0].date_display;
        artworkOrigin.innerText = data.data[0].place_of_origin;

        // Get the artwork image
        console.log((data.config.iiif_url + "/" + data.data[0].image_id + "/full/400,/0/default.jpg"));
        
        // If artwork image is not available, reload the whole thing
        let req = new XMLHttpRequest();
        req.open("GET", (data.config.iiif_url + "/" + data.data[0].image_id + "/full/400,/0/default.jpg"), false);
        req.send();
        if(req.status == 404 || data.data[0].image_id == null){ 
            sessionStorage.setItem("alreadyFetching", false); 
            fetchData(); 
        }

        artwork.src = (data.config.iiif_url + "/" + data.data[0].image_id + "/full/400,/0/default.jpg");
        lastReload = new Date();
        sessionStorage.setItem("lastReload", Date.parse(lastReload));
        artworkReload.classList.add("reload-disabled");
        setTimeout(() => {
            artworkReload.classList.remove("reload-disabled");
        }, minReloadInterval);

        sessionStorage.setItem("alreadyFetching", false);
    });
}
