/**
 * Un recurso Photo de Pexels.
 * @typedef {Object} PexelsPhoto
 * @property {number} id El id de la foto.
 * @property {number} width El ancho real de la foto en píxeles.
 * @property {number} height El alto real de la foto en píxeles.
 * @property {string} url La URL de Pexels donde se encuentra la foto.
 * @property {string} photographer El nombre del fotógrafo que tomó la foto.
 * @property {string} photographer_url La URL del perfil de Pexels del fotógrafo.
 * @property {number} photographer_id El id del fotógrafo.
 * @property {string} avg_color El color promedio de la foto. Útil para un marcador de posición mientras la foto carga.
 * @property {PexelsPhotoSize} src Un surtido de los diferentes tamaños de imagen que pueden ser usados para mostrar esta foto.
 * @property {boolean} liked Si la imagen está marcada como me gusta para el usuario de Pexels cuya API accede.
 * @property {string} alt Descripción textual de la foto para usar en el atributo alt.
 */

/**
 * Tamaños de Photo de Pexels.
 * @typedef {Object} PexelsPhotoSize
 * @property {string} original La imagen sin ningún cambio de tamaño. Será la misma que las propiedades width y height.
 * @property {string} large2x La imagen redimensionada a W 940px X H 650px DPR 1.
 * @property {string} large La imagen redimensionada a W 940px X H 650px DPR 2.
 * @property {string} medium La imagen escalada proporcionalmente a una altura de 350px.
 * @property {string} small La imagen escalada proporcionalmente a una altura de 130px.
 * @property {string} portrait La imagen recortada a W 800px X H 1200px.
 * @property {string} landscape La imagen recortada a W 1200px X H 627px.
 * @property {string} tiny La imagen recortada a W 280px X H 200px.
 */

/*
  TODO: No se si se pueden definir propiedades opcionales en los objetos, por ejemplo prev_page y next_page son string o opcional
  y no se si ponerlas como están ahora entre corchetes o bien como {string|undefined}.
*/
/**
 * Una respuesta de búsqueda en la API de Pexels.
 * @typedef {Object} PexelsSearchResponse
 * @property {PexelsPhoto[]} photos Un array de objetos PexelsPhoto.
 * @property {number} page El número de página actual.
 * @property {number} per_page El número de resultados devueltos con cada página.
 * @property {number} total_results El número total de resultados para la petición.
 * @property {string} [prev_page] URL para la página anterior de los resultados, si aplica.
 * @property {string} [next_page] URL para la página siguiente de los resultados, si aplica.
 */

const API_KEY = 'TewSBIvF8QDVsqGh0UOmnufPlk6r9JM6l2OIJs2MOoFtuvtZbQPy2t3E';
const fragmento = document.createDocumentFragment();
const pintarGaleria = document.querySelector('#pintarGaleria');

// Variables globales y valores por defecto de parámetros de búsqueda de Pexels.
// TODO: Definir ¿enumeraciones? para los valores de las opciones.
let orientacion = 'landscape';
let tamanio = 'small';
let color = undefined;
let idiomaConsulta = 'es-ES';
let imagenesPorPagina = 9;

/**
 * Petición a Pexels
 * @param {*} accion Acción a solicitar al API de Pexels.
 * @returns {Promise<Response | undefined>}
 */
const peticionPexels = async (accion) => {
  try {
    const peticion = fetch(`https://api.pexels.com/v1/${accion}`, {
      headers: {
        'Authorization': API_KEY,
      },
    });
    return peticion;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {string} consulta Filtro por el que buscar.
 * @param {number} pagina Página del resultado de búsqueda a recoger.
 * @returns {Promise<PexelsSearchResponse>}
 */
const buscarFotos = async (consulta, pagina = 1) => {
  try {
    const respuesta = await peticionPexels(`search?locale=${idiomaConsulta}&page=${pagina}&per_page=${imagenesPorPagina}&query=${consulta}`);
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
    const datos = await buscarFotos(filtro, pagina);
    console.log(datos);

    datos.photos.forEach(foto => {
      console.log(foto.alt);

      const article = document.createElement('article');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const divCaption = document.createElement('div');
      const h3 = document.createElement('h3');
      const favorito = document.createElement('p');

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
