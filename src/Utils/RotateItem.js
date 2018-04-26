// Bibliotecas que se importan
import interact from 'interactjs';
import $ from 'jquery';
import store from '../Store';
import {
  getRotationDegrees,
  rot,
  rotacionCentro,
  rotarItem,
  paintPoint,
  paintDiv
} from '../Utils/Math';

// Variables que se necesitan entre los tres eventos:
// onstart: Se dispara en cuanto el usuario hace clic sobre el ancla (mousedown)
// onmove: Se dispara constantemente mientras el usuario arrastra el ancla (mousemove)
// onend: Se dispara cuando el usuario terminar de arrastrar el ancla (mouseup)

var centroDeRotacion = {
  x: 0,
  y: 0
};
var centroDeRotacionReal = {
  x: 0,
  y: 0
};

// Vamos obteniendo el angulo con respecto
// al centro de la caja y la posición del ratón
var anguloInicialDelSelector = 0;

interact('.pointer9').draggable({
  max: 1,
  onstart: event => {
    // Con la siguiente linea obtengo las dimensiones de la caja:
    // Ancho (width), alto (height),
    // posición x (left)
    // posición y (top)
    var dimensionesCaja = event.interactable.getRect(event.target.parentNode);

    centroDeRotacion = {
      x: dimensionesCaja.left + dimensionesCaja.width / 2,
      y: dimensionesCaja.top + dimensionesCaja.height / 2
    };

    if (store.selectedItems.length > 1) {
      const $fakeDrag = $('#fake-drag');
      centroDeRotacionReal = {
        x: parseFloat($fakeDrag.css('left')) + $fakeDrag.width() / 2,
        y: parseFloat($fakeDrag.css('top')) + $fakeDrag.height() / 2
      };
      console.log(centroDeRotacionReal);
      paintPoint(centroDeRotacionReal.x, centroDeRotacionReal.y);
    } else {
      const $item = $(store.selectedItems[0].node);
      centroDeRotacionReal = {
        x: parseFloat($item.css('left')) + $item.width() / 2,
        y: parseFloat($item.css('top')) + $item.height() / 2
      };
    }

    // Ángulo inicial del selector. Le sumamos 90 puesto que el
    // tirador del selector comienza con dicha rotación.
    // ¡El ángulo inicial del selector depende de en qué punto
    // del disco blanco del tirador el usuario haga click
    // (prueba "coger" el tirador caso tocando con el ratón
    // el borde del disco blanco). Este comportamiento provoca
    // errores de precisión que hacen que las rotaciones del selector
    // y la caja se desajusten.
    // ¿Es posible obtener más precisión.

    anguloInicialDelSelector =
      Math.atan2(
        centroDeRotacion.y - event.pageY,
        centroDeRotacion.x - event.pageX
      ) *
        180 /
        Math.PI +
      90;

    anguloInicialDelSelector = getRotationDegrees($('#selector'));
    console.log('Ángulo inicial del selector: ' + anguloInicialDelSelector);
  },
  onmove: event => {
    // Vamos obteniendo el angulo con respecto
    // al centro de la caja y la posición del ratón
    var anguloDelSelector =
      Math.atan2(
        centroDeRotacion.y - event.pageY,
        centroDeRotacion.x - event.pageX
      ) *
      180 /
      Math.PI;

    // Tenemos que sumarle el 90 porque nuestro selector
    // empieza en la rotación 90º
    let angle = parseFloat(parseFloat(anguloDelSelector) + 90);

    if (angle === -89) {
      angle = -90;
    }

    // Aplico estilos visuales
    $('#selector').css('transform', 'rotate(' + angle + 'deg)');

    // Aplicamos la función rotarCaja por cada una de las cajas
    // seleccionadas. El ángulo de rotación es la diferencia entre
    // el ángulo inicial del tirador y su ángulo final (en radianes).
    store.selectedItems.map(item =>
      rotarItem(
        centroDeRotacionReal.x,
        centroDeRotacionReal.y,
        (angle - anguloInicialDelSelector) * Math.PI / 180,
        item
      )
    );
  },

  onend: event => {
    // Ha terminado el proceso, puedo guardar en base de datos
    store.selectedItems.map(item => {
      item.setPosition(
        parseFloat(item.node.style.left),
        parseFloat(item.node.style.top)
      );

      const angulo = getRotationDegrees($(item.node));

      item.setRotation(angulo);
    });
    const $selector = $('#selector');
    const anguloFinal = getRotationDegrees($selector);

    store.selector.setRotation(anguloFinal, 'rotate(' + anguloFinal + 'deg)');
    store.internaleDraggable.setRotation(
      anguloFinal,
      'rotate(' + anguloFinal + 'deg)'
    );
  }
});
