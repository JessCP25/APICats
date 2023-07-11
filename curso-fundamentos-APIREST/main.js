const API = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
});

API.defaults.headers.common['X-API-KEY'] = 'live_JBXcwYkcLD3sL0gN6Uq61NWrGGl321wdYmmaoNc4zf7Rsjg4f33oAqP2MFlXhEur';

const urlApi_Random = "https://api.thecatapi.com/v1/images/search?limit=4";
const urlApi_Favorites = "https://api.thecatapi.com/v1/favourites?limit=60";
const urlApi_Favorites_Delete = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const urlApi_upload = 'https://api.thecatapi.com/v1/images/upload';

const error = document.getElementById('error');

const boton = document.getElementById('boton');
const containerFavorites = document.getElementById('favorites');

const previewImage = () => {
    const file = document.getElementById("file").files;
    console.log(file);
    if (file.length > 0) {
      const fileReader = new FileReader();
  
      fileReader.onload = function(e) {
        document.getElementById("preview").setAttribute("src", e.target.result);
      };
      fileReader.readAsDataURL(file[0]);
    }
  }

async function loadRandomMichis () {
    const response = await fetch(urlApi_Random);
    const data = await response.json();
    console.log('Random');
    console.log(data);
    if(response.status!==200){
        error.innerHTML = "Error " + response.status;
    }else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const img4 = document.getElementById('img4');
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        img4.src = data[3].url;
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');
        const btn4 = document.getElementById('btn4');
        
        btn1.onclick = ()=>saveFavoritesMichis(data[0].id);
        btn2.onclick = ()=>saveFavoritesMichis(data[1].id);
        btn3.onclick = ()=>saveFavoritesMichis(data[2].id);
        btn4.onclick = ()=>saveFavoritesMichis(data[3].id);
    }
}

boton.addEventListener('click', loadRandomMichis);

loadRandomMichis();

async function loadFavoritesMichis () {
    const response = await fetch(urlApi_Favorites,{
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_JBXcwYkcLD3sL0gN6Uq61NWrGGl321wdYmmaoNc4zf7Rsjg4f33oAqP2MFlXhEur',
        }
    });
    const data = await response.json();
    containerFavorites.innerHTML = "";
    console.log('Favorites');
    console.log(data);
    if(response.status!==200){
        error.innerText = "Error " + response.status;
    }
    data.forEach(michi => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const button = document.createElement('button');
        const textButton = document.createTextNode('Remove Favorites');

        div.className = "cat";
        img.src = michi.image.url;
        button.appendChild(textButton);
        button.onclick = () => deleteFavoritesMichis(michi.id);
        div.append(img, button);
        containerFavorites.appendChild(div);
    });
}

async function saveFavoritesMichis(idMichi){
    const {data, status} = await API.post('/favourites',{
        image_id: idMichi,
    })
    
    // const response = await fetch(urlApi_Favorites,{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-API-KEY': 'live_JBXcwYkcLD3sL0gN6Uq61NWrGGl321wdYmmaoNc4zf7Rsjg4f33oAqP2MFlXhEur',
    //     },
    //     body: JSON.stringify({
    //         image_id: idMichi,
    //     }),
    // });
    // const data = await response.json();
    if(status!==200){
        error.innerText = "Error " + status;
    }else{
        console.log('El michi fue guardado en favoritos.');
        loadFavoritesMichis();
    }
}

loadFavoritesMichis();

async function deleteFavoritesMichis(idMichi){
    const response = await fetch(urlApi_Favorites_Delete(idMichi),{
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_JBXcwYkcLD3sL0gN6Uq61NWrGGl321wdYmmaoNc4zf7Rsjg4f33oAqP2MFlXhEur',
        }
    });
    const data = await response.json();
    if(response.status!==200){
        error.innerText = "Error " + response.status;
    }else{
        console.log('El michi fue eliminado.');
        loadFavoritesMichis();
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    const response = await fetch(urlApi_upload, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_JBXcwYkcLD3sL0gN6Uq61NWrGGl321wdYmmaoNc4zf7Rsjg4f33oAqP2MFlXhEur',
        },
        body: formData,
    });
    const data = await response.json();
    if (response.status !== 201) {
        error.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavoritesMichis(data.id); //para agregar el michi cargado a favoritos.
    }
}