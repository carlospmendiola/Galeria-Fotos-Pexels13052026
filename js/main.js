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
const URL_BASE = 'https://api.pexels.com/v1'
const PEXELS_MAX_IMAGES_API = 480;
const fragmento = document.createDocumentFragment();
const sectionGaleria = document.querySelector('#sectionGaleria');
const sectionCategorias = document.querySelector('#sectionCategorias')
const sectionPaginado = document.querySelector('#sectionPaginado')
const categorias = [
  { nombre: 'coches', idFoto: 35035526 },
  { nombre: 'animales', idFoto: 34806620 },
  { nombre: 'rascacielos', idFoto: 30657712 },
]

// Variables globales y valores por defecto de parámetros de búsqueda de Pexels.
// TODO: Definir ¿enumeraciones? para los valores de las opciones.
let orientacion = 'landscape';
let tamanio = 'small';
let color = undefined;
let idiomaConsulta = 'es-ES';
let imagenesPorPagina = 9;
let paginaActual = 1;
let categoriaActual = '';

//EVENTOS
document.addEventListener('click', ev => {
  if (ev.target.matches('#sectionCategorias button')) {
    categoriaActual = ev.target.textContent
    paginaActual = 1
    pintarGaleria(categoriaActual, paginaActual);
  } else if (ev.target.matches('#sectionPaginado button')) {
    paginaActual = Number(ev.target.value);
    pintarGaleria(categoriaActual, paginaActual);
  }
})

document.addEventListener('keypress', (ev) => {
  if (ev.target.matches('#sectionPaginado input') && ev.key === 'Enter') {
    const paginaIntroducida = ev.target.value.trim().replace(',', '.');
    if (paginaIntroducida === '' || isNaN(paginaIntroducida)) return;
    const paginaSaneada = Math.max(1, Math.min(Math.floor(paginaIntroducida), Math.floor(PEXELS_MAX_IMAGES_API / imagenesPorPagina)));
    if (Number(ev.target.value) !== paginaSaneada)
      ev.target.value = paginaSaneada;
    else if (paginaSaneada !== paginaActual) {
      console.log(paginaSaneada, paginaActual);
      paginaActual = paginaSaneada;
      pintarGaleria(categoriaActual, paginaActual);
    }
  }
});

/**
 * Petición a Pexels
 * @param {*} accion Acción a solicitar al API de Pexels.
 * @returns {Promise<Response | undefined>}
 */
const peticionPexels = async (accion) => {
  try {
    const peticion = fetch(`${URL_BASE}/${accion}`, {
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
 * Devuelve un PexelsSearchResponse para los parámetros de busqueda que se le pasan.
 * @param {string} categoria Categoría por el que buscar.
 * @param {number} pagina Página del resultado de búsqueda a recoger.
 * @returns {Promise<PexelsSearchResponse>}
 */
const buscarFotos = async (categoria, pagina = 1) => {
  try {
    if (!categoria) throw 'No se especificó categoria para buscar imágenes.';

    const parametrosDeBusqueda = new URLSearchParams({ query: categoria });
    if (orientacion) parametrosDeBusqueda.append('orientation', orientacion);
    if (tamanio) parametrosDeBusqueda.append('size', tamanio);
    if (color) parametrosDeBusqueda.append('color', color);
    if (idiomaConsulta) parametrosDeBusqueda.append('locale', idiomaConsulta);
    parametrosDeBusqueda.append('page', pagina);
    if (imagenesPorPagina) parametrosDeBusqueda.append('per_page', imagenesPorPagina);
    console.log(parametrosDeBusqueda.toString());

    const respuesta = await peticionPexels(`search?${parametrosDeBusqueda}`);
    if (!respuesta.ok) throw respuesta.status;

    const datos = await respuesta.json();
    if (typeof datos.total_results === 'undefined') throw `Error: Recibiendo las imágenes de la categoría '${categoria}'`;
    if (datos.total_results === 0) throw `Error: No existen imágenes para la categoría '${categoria}'`;

    return datos;
  } catch (error) {
    console.log('buscarFotos:', error);
  }
};

/**
 * Devuelve un objeto PexelsPhoto a partir del id que se le pasa.
 * @param {number} id
 * @returns {Promise<PexelsPhoto>}
 */
const obtenerFoto = async (id) => {
  try {
    if (!id && typeof id !== 'number') throw 'Error: No se ha pasado un id válido.';

    const respuesta = await peticionPexels(`photos/${id}`);
    if (!respuesta.ok) throw respuesta.status;

    const datos = await respuesta.json();

    if (datos.id !== id) throw 'Error: No se ha recuperado la foto especificada.';

    console.log(datos);

    return datos;
  } catch (error) {
    console.log('obtenerFoto:', error);
  }
};

const pintarGaleria = async (categoria, pagina) => {
  try {
    const paginasLimiteApi = Math.floor(PEXELS_MAX_IMAGES_API / imagenesPorPagina);
    pagina = Math.min(pagina, paginasLimiteApi);

    const datos = await buscarFotos(categoria, pagina);
    const paginasTotales = Math.min(Math.ceil(datos.total_results / datos.per_page), paginasLimiteApi);
    console.log(datos);
    pintarPaginado(pagina, paginasTotales);

    datos.photos.forEach(foto => {
      console.log(foto.alt);

      const article = document.createElement('article');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const divCaption = document.createElement('div');
      const h3 = document.createElement('h3');
      const favorito = document.createElement('p');

      article.classList.add('boxImagen', 'borderRadius10', 'borderBottom1px', 'fondoPrincipal')
      divCaption.classList.add('boxTxt', 'pad25px', 'flexContainer')
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

    sectionGaleria.replaceChildren(fragmento);



  } catch (error) {
    console.log(error);
  }
};

const pintarPaginado = (pagina, paginasTotales) => {
  if (pagina > 1) {
    const botonPaginaAnterior = document.createElement('button')
    botonPaginaAnterior.textContent = '<'
    botonPaginaAnterior.value = pagina - 1;
    fragmento.append(botonPaginaAnterior)
  }

  if (pagina > 2) {
    const botonPrimeraPagina = document.createElement('button')
    botonPrimeraPagina.textContent = '1'
    botonPrimeraPagina.value = 1;
    fragmento.append(botonPrimeraPagina)
  }

  if (pagina > 3) {
    const elipsis = document.createElement('span')
    elipsis.textContent = "..."
    fragmento.append(elipsis)
  }

  if (pagina !== 1) {
    const botonPaginaAnteriorNumerica = document.createElement('button');
    botonPaginaAnteriorNumerica.textContent = pagina - 1;
    botonPaginaAnteriorNumerica.value = pagina - 1;
    fragmento.append(botonPaginaAnteriorNumerica);
  }

  const inputPaginaActual = document.createElement('input');
  inputPaginaActual.value = pagina;
  inputPaginaActual.value = pagina;
  fragmento.append(inputPaginaActual);

  if (pagina !== paginasTotales) {
    const botonPaginaSiguienteNumerica = document.createElement('button');
    botonPaginaSiguienteNumerica.textContent = pagina + 1;
    botonPaginaSiguienteNumerica.value = pagina + 1;
    fragmento.append(botonPaginaSiguienteNumerica);
  }

  if (pagina < paginasTotales - 2) {
    const elipsis = document.createElement('span')
    elipsis.textContent = "..."
    fragmento.append(elipsis)
  }

  if (pagina < paginasTotales - 1) {
    const botonUltimaPagina = document.createElement('button')
    botonUltimaPagina.textContent = paginasTotales
    botonUltimaPagina.value = paginasTotales;
    fragmento.append(botonUltimaPagina)
  }

  if (pagina < paginasTotales) {
    const botonPaginaSiguiente = document.createElement('button')
    botonPaginaSiguiente.textContent = '>'
    botonPaginaSiguiente.value = pagina + 1;
    fragmento.append(botonPaginaSiguiente)
  }
  sectionPaginado.replaceChildren(fragmento)
}

const pintarCategorias = (categorias) => {
  const ul = document.createElement('ul')

  categorias.forEach((categoria) => {
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.textContent = categoria.nombre
    button.classList.add('borderNormal', 'borderRadius10', 'txtCapitalize')

    li.append(button)
    ul.append(li)
  })
  ul.classList.add('flexContainer')
  sectionCategorias.replaceChildren(ul)

}


pintarCategorias(categorias);
