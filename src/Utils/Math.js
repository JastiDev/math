import $ from 'jquery';
import { Point, rotate } from './planeTransforms.js';

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
      angle = Math.atan2(b, a) * (180 / Math.PI);
    } else {
      angle = 0;
    }
    return parseFloat(angle, 10);
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

/*
 * (Visually) rotate `item` an `angle` with respect a given `center`
 * The function does not change item properties.
 *
 * @param {Number} angle - Angle of rotation (degrees)
 * @param {Point} center - Center of the rotation
 * @param {Item} item - item to rotate.
 *
 */
const rotarItem = (angle, center, item) => {
  var centroCaja = new Point(
    item.left + item.width / 2,
    item.top + item.height / 2
  );

  // Compute the new center of item
  var nuevoCentro = rotate(angle, center)(centroCaja);

  // Compute the new vertex (top left) of item
  var nuevaPosicion = new Point(
    nuevoCentro.x - item.width / 2,
    nuevoCentro.y - item.height / 2
  );

  // Compute the new `rotate` property of item
  // It is the sum of the initial rotation and the new one
  const nuevaRotacion = angle + item.rotate;

  // Visually rotate item using CSS transforms
  item.node.style.left = nuevaPosicion.x + 'px';
  item.node.style.top = nuevaPosicion.y + 'px';
  $(item.node).css('transform', 'rotate(' + nuevaRotacion + 'deg)');
};

export { rotarItem, paintPoint, paintDiv, getRotationDegrees };
