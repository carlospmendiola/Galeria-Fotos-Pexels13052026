const API_KEY = 'TewSBIvF8QDVsqGh0UOmnufPlk6r9JM6l2OIJs2MOoFtuvtZbQPy2t3E';
const IDIOMA = 'es-ES';
const IMAGENES_POR_PAGINA = 9;

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

const pintarDatos = async () => {
  try {
    const datos = await consultaFiltro('arboles');
    console.log(datos);
  } catch (error) {
    console.log(error);
  }
};

pintarDatos();
