const API_KEY = 'TewSBIvF8QDVsqGh0UOmnufPlk6r9JM6l2OIJs2MOoFtuvtZbQPy2t3E';
const IDIOMA = 'es-ES';
const IMAGENES_POR_PAGINA = 9;
const fragmento = document.createDocumentFragment();
const pintarGaleria = document.querySelector('#pintarGaleria');

const consultaUrl = async (url) => {
  try {
    const consulta = fetch(url, {
      headers: {
        'Authorization': API_KEY,
      },
    });
    return consulta;
  } catch (error) {
    console.log(error);
  }
};

const consultaFiltro = async (filtro, pagina = 1) => {
  try {
    const respuesta = await consultaUrl(`https://api.pexels.com/v1/search?locale=${IDIOMA}&page=${pagina}&per_page=${IMAGENES_POR_PAGINA}&query=${filtro}`);
    if (!respuesta.ok) throw respuesta.status;
    const datos = await respuesta.json();
    if (typeof datos.total_results === 'undefined') throw `Error: Recibiendo las imágenes del filtro ${filtro}`;
    if (datos.total_results === 0) throw `Error: No existen imágenes para el filtro ${filtro}`;
    return datos;
  } catch (error) {
    console.log('consultaFiltro:', error);
  }
};

const pintarDatos = async (filtro, pagina) => {
  try {
    const datos = await consultaFiltro(filtro, pagina);
    console.log(datos);

    datos.photos.forEach(foto => {
      console.log(foto.alt);

      const article = document.createElement('article');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const divCaption = document.createElement('div');
      const h3 = document.createElement('h3');
      const favorito = document.createElement('p');

      article.classList.add('boxImagen','borderRadius10', 'borderBottom1px','fondoPrincipal')
      divCaption.classList.add('boxTxt','pad25px','flexContainer')
      h3.classList.add('colorPrincipal')

      article.append(div, divCaption);
      div.append(img);
      img.src = foto.src['large'];
      img.alt = foto.alt;
      divCaption.append(h3, favorito);
      h3.textContent = foto.alt;
      // TODO: Recodar poner el id de la foto en un data attribute.
      favorito.id = foto.id;

      fragmento.append(article);


      // <article>
      //   <div>
      //     <img src="" alt="">
      //   </div>
      //   <div>
      //     <h3></h3>
      //     <p></p>
      //   </div>
      // </article>

    });

    pintarGaleria.innerHTML = '';
    pintarGaleria.append(fragmento);

  } catch (error) {
    console.log(error);
  }
};

pintarDatos();
