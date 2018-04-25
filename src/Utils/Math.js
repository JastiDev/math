import $ from 'jquery';

const getRotationDegrees = $obj => {
  let angle = 0;

  try {
    let matrix =
      $obj.css('-webkit-transform') ||
      $obj.css('-moz-transform') ||
      $obj.css('-ms-transform') ||
      $obj.css('-o-transform') ||
      $obj.css('transform');
    if (matrix !== 'none') {
      let values = matrix
        .split('(')[1]
        .split(')')[0]
        .split(',');
      let a = values[0];
      let b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
      angle = 0;
    }
    return parseInt(angle, 10);
  } catch (err) {
    return angle;
  }
};

// Esta función se usa para pintar puntos en la pantalla y poder
// depurar de forma correcta
const paintPoint = (x, y) => {
  $('<div/>', {
    style: 'left: ' + x + 'px;top:' + y + 'px;',
    class: 'debug-point'
  }).appendTo('#slide');
};
const paintDiv = (x, y, w, h) => {
  $('<div/>', {
    style:
      'left: ' +
      x +
      'px;top:' +
      y +
      'px;width: ' +
      w +
      'px;height: ' +
      h +
      'px;',
    class: 'debug-point'
  }).appendTo('#root');
};

// La función rot, recibe un theta en radianes, una valor x y un valor y
const rot = (theta, x, y) => {
  return {
    x: x * Math.cos(theta) - y * Math.sin(theta),
    y: x * Math.sin(theta) + y * Math.cos(theta)
  };
};

// La función que se encarga de la translación dado un vector (v1,v2)
const translacion = (v1, v2, x, y) => {
  return {
    x: x + v1,
    y: y + v2
  };
};

// La función que se encarga de la rotación respecto a un centro
// arbitrario (a,b)
const rotacionCentro = (a, b, theta, x, y) => {
  var posicionNuevaDespuesDeLaTranslacion = translacion(-a, -b, x, y);
  var posicionNuevaDespuesDeLaRotacion = rot(
    theta,
    posicionNuevaDespuesDeLaTranslacion.x,
    posicionNuevaDespuesDeLaTranslacion.y
  );
  var posicionNuevaTrasLaTranslacionAlPuntoDeOrigen = translacion(
    a,
    b,
    posicionNuevaDespuesDeLaRotacion.x,
    posicionNuevaDespuesDeLaRotacion.y
  );

  return posicionNuevaTrasLaTranslacionAlPuntoDeOrigen;
};

// Esta es la única función que se ha modificado.
const rotarItem = (a, b, theta, item, delta) => {
  // El selector mide siempre el ángulo del tirador. Si la rotación ser
  // realiza con respecto al centro de la caja el ángulo del tirador coincide
  // siempre con el ángulo de la caja independientemente de si la caja
  // estaba inicialmente rotada o no.
  // Cuando se seleccionan varias cajas el ángulo inicial del selector
  // es siempre cero luego no coincide con el angulo de cada una de las
  // cajas que contiene puesto que algunas de ellas podrian estar rotadas
  // En dicho caso, para aquellas cajas con una rotación inicial distinta
  // de cero hay que sumarle el ángulo del tirador después del movimiento del
  // ratón. Para distinguir dichos casos hay que comprobar si el selector
  // sólo contiene un nodo.
  // En el siguiente código he comprobado dicha condición distinguiendo si el
  // centro del selector (a, b) y el centro de la caja son iguales.
  // Esto no es óptimo pues podría darse el caso de dos cajas concéntricas donde
  // fallaría (selecciona las cajas azul y naranja y prueba a rotarlas juntas).
  // ¿Hay alguna forma de optener el ángulo del tirador del selector antes
  // de realizar ningún movimiento?

  var centroCaja = {
    x: item.left + item.width / 2,
    y: item.top + item.height / 2
  };
  // console.log("Centro Selector = (" + a + "," + b + ")");
  // console.log("Centro Caja = (" + centroCaja.x + "," + centroCaja.y + ")");

  var nuevaRotacion = theta * 180 / Math.PI + item.rotate;
  // Compruebo si el centro de rotación es el centro de la caja
  // Puesto que Javascript comete errores de precisión en lugar
  // de comparar los valores miro si la diferencia es pequeña.
  // if (Math.abs(a - centroCaja.x) < 0.1 && Math.abs(b - centroCaja.y) < 0.1) {
  //   console.log("Mismo centro");
  //  nuevaRotacion = theta * 180 / Math.PI;
  //} else {
  //  console.log("Distinto centro");
  //  nuevaRotacion = theta * 180 / Math.PI + item.rotate;
  //}

  // Calculamos el nuevo centro de la caja:
  var nuevoCentro = rotacionCentro(a, b, theta, centroCaja.x, centroCaja.y);

  // Calculamos el nuevo vértice superior izquierdo.
  var nuevaPosicion = {
    x: nuevoCentro.x - item.width / 2,
    y: nuevoCentro.y - item.height / 2
  };

  // Hay que actualizar la nueva rotación interna de la caja.
  // El nuevo valor deberá ser nuevaRotacion

  // Aplico estilos gráficos para que se vean los cambios
  // en el navegador:

  item.node.style.left = nuevaPosicion.x + 'px'; // Actualiza la X
  item.node.style.top = nuevaPosicion.y + 'px'; // Actualiza la Y
  $(item.node).css('transform', 'rotate(' + nuevaRotacion + 'deg)'); // Actualiza la rotación en grados
};

export {
  rotarItem,
  rotacionCentro,
  translacion,
  rot,
  paintPoint,
  paintDiv,
  getRotationDegrees
};
