import $ from 'jquery';
import {Point, translate, rotate, scale, scaleDir } from './planeTransforms.js';

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
    return parseFloat(angle, 10);
  } catch (err) {
    return angle;
  }
};

const changeCoordinatesFromWindowToSlide = function(slideTopLeft, delta, point) {
  return new Point( (point.x - slideTopLeft.x)/delta, (point.y - slideTopLeft.y)/delta);
};
const changeCoordinatesFromSlideToWindow = function(slideTopLeft, delta, point) {
  return new Point( delta*point.x + slideTopLeft.x, delta*point.y + slideTopLeft.y );
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

/* 
 * (Visually) proportionally scale `item` with respect to `center` 
 * The function does not change item properties
 * 
 * @param {Number} scaleFactor - scale factor to apply. 
 * @param {Point} center - center of the scale
 * @param {Item} item - item to scale
 */
const scaleItem = (scaleFactor, center, item) => {
  /*
   * In order to apply a scale transformation to a box we have to take into 
   * account that it is equivalent:
   * 1. Rotate with respect to a point C and then scale with respecto to P
   * 2. Scale the element with respect to Q = the rotated point P
   * with respect to C in the oposite direction and then rotate with
   * respect to a point C
   */

  // We compute the relevant points of item.
  const itemCenter = new Point( item.left + item.width / 2, item.top + item.height / 2 );

  // The angle of the box has not changed since scale preserves angles
  // The new center of item is the *transformed* center by the scale
  // const itemNewCenter = rotate(item.rotate, itemCenter)(scale(scaleFactor, center)(itemCenter));
  const itemNewCenter = scale(scaleFactor, center)(itemCenter);
  const newWidth = scaleFactor * item.width;
  const newHeight = scaleFactor * item.height;
  const itemNewTopLeft = translate(new Point(-newWidth/2, -newHeight/2))(itemNewCenter);

  // Visually rotate item using CSS transforms
  item.node.style.left = itemNewTopLeft.x + 'px'; 
  item.node.style.top = itemNewTopLeft.y + 'px'; 
  $(item.node).css({width: newWidth, height: newHeight});
  $(item.node).css('transform', 'rotate(' + item.rotate + 'deg)');
};

/* 
 * (Visually) non-proportionally scale `item` with respect to `center` by 
 * a given `scaleFactor` in the direction of `scaleDirection`
 * The function does not change item properties
 * 
 * @param {Number} scaleFactor - scale factor to apply. 
 * @param {Point} center - center of the scale
 * @param {Item} item - item to scale
 */
const scaleDirItem = (scaleFactor, scaleDirection, center, item) => {

  // We compute the relevant points of item.
  const itemCenter = new Point( item.left + item.width / 2, item.top + item.height / 2 );
  const itemTopLeft = rotate(item.rotate, itemCenter)(
    new Point( item.left, item.top )
  );
  const itemTopRight = rotate(item.rotate, itemCenter)(
    new Point( item.left + item.width, item.top )
  );
  const itemBottomLeft = rotate(item.rotate, itemCenter)(
    new Point( item.left, item.top + item.height )
  );

  // The angle of the box has not changed since scale preserves angles
  // The new center of item is the *transformed* center by the scale
  // const itemNewCenter = rotate(item.rotate, itemCenter)(scale(scaleFactor, center)(itemCenter));
  const itemNewCenter = scaleDir(scaleFactor, scaleDirection, center)(itemCenter);
  const newWidth = Point.distance(
    scaleDir(scaleFactor, scaleDirection, center)(itemTopLeft),
    scaleDir(scaleFactor, scaleDirection, center)(itemTopRight)
  );
  const newHeight = Point.distance(
    scaleDir(scaleFactor, scaleDirection, center)(itemTopLeft),
    scaleDir(scaleFactor, scaleDirection, center)(itemBottomLeft)
  );
  const itemNewTopLeft = translate(new Point(-newWidth/2, -newHeight/2))(itemNewCenter);

  // Visually rotate item using CSS transforms
  item.node.style.left = itemNewTopLeft.x + 'px'; 
  item.node.style.top = itemNewTopLeft.y + 'px'; 
  $(item.node).css({width: newWidth, height: newHeight});
  $(item.node).css('transform', 'rotate(' + item.rotate + 'deg)');
};

export {
  rotarItem,
  scaleItem,
  scaleDirItem,
  paintPoint,
  paintDiv,
  getRotationDegrees,
  changeCoordinatesFromWindowToSlide,
  changeCoordinatesFromSlideToWindow,
};
