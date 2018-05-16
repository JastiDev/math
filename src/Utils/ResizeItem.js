import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import {
  getRotationDegrees,
  changeCoordinatesFromWindowToSlide,
  changeCoordinatesFromSlideToWindow,
  visuallySetItem,
  scaleItem,
  scaleDirItem,
} from './Math';
import {Point, rotate, translate, scale, scaleDir} from './planeTransforms.js';

var selector;
var slide;
var scaleCenter = new Point(0, 0);  // Center of the scale transformation
var scaleFactor = 1;                // Scale factor to apply

var clickedPoint = ''; // vertex of the selector clicked by the user

// Direction of the mouse movement that will be consider to scale the element
var scaleDirection = new Point(0, 0);
// Amount of mouse movement in the scaleDirection normalize by store.delta
var scaleDelta = 0;

const attachResize = () => {
  interact('.pointers').draggable({
    onstart: event => {
      // Reset the scaleDelta and scaleFactor after a complete scaling
      scaleDelta = 0;
      scaleFactor = 1;

      slide = document.getElementById('slide').getBoundingClientRect();

      // Coordinates of selector with respect to browser window
      const selectorFromWindow = new Point(
        parseFloat(store.selector.node.style.left),
        parseFloat(store.selector.node.style.top)
      );

      // We compute the coordinates of the selector with respect to slide
      selector = changeCoordinatesFromWindowToSlide(
        slide,
        store.delta,
        selectorFromWindow
      );

      // We add to selector its width, height and angle 
      // with respect to the slide (store.delta scaled)
      selector.width =
        parseFloat(store.selector.node.style.width) / store.delta;
      selector.height =
        parseFloat(store.selector.node.style.height) / store.delta;
      selector.rotate = getRotationDegrees($(store.selector.node));
      selector.center = new Point(
        selector.x + selector.width/2, selector.y + selector.height/2
      );


      // Handle id using compass notation N-E-W-S
      // - 'nm', 'wm', 'em', 'sm' midle points in the sides of selector
      // - 'ne', 'nw', 'se', 'sw' corners of the selector
      clickedPoint = event.currentTarget.getAttribute('id');
      let clickedPointObject = document.getElementById(clickedPoint).getBoundingClientRect();
      // Coordinates of the clicked point with respect to the slide
      let clickedPointCoordinates = changeCoordinatesFromWindowToSlide(
        slide, store.delta,
        new Point(
          clickedPointObject.left + clickedPointObject.width/2,
          clickedPointObject.top + clickedPointObject.height/2
        )
      );

      // Compute the center of the scale. It is the opposite point selected
      // by the user. 
      scaleCenter = rotate(180, selector.center)(clickedPointCoordinates);
      // Compute the `scale direction`. It is the direction (math vector)
      // that points from the center of the scale to the clicked point.
      scaleDirection = scaleCenter.direction(clickedPointCoordinates); 
    },
    onmove: event => {
      var userPull = new Point(event.dx, event.dy);
      scaleDelta += userPull.component(scaleDirection) / store.delta;
      scaleFactor = (scaleDirection.length + scaleDelta) / scaleDirection.length;

      // TODO: The transformation applied to the `selector` is exactly the same
      // to the one applied to item. However, since `selector` and `item` do
      // not have the same model (notice that SelectorModel and ItemModel
      // represents the top-left vertex by (x,y) and (left, right) respectively)
      // we cannot use the `scaleItem` function to update the selector
      // position, width and height. As a consequence, we have to repeat
      // the same inner code of `scaleItem` or `scaleDirItem` to update selector.
      // Moreover, selector coordinates are computed with respect to the window
      // and a change of coordinate is needed to correctly position it
      // in the slide.

      // Apply the non-proportional scale if the `clickedPoint` is in the
      // midpoint of one of the selector sides.
      if (
        clickedPoint === 'em' ||
        clickedPoint === 'nm' ||
        clickedPoint === 'wm' ||
        clickedPoint === 'sm'
      ) {
        // Update selector position
        // The angle of the selector has not changed since scale preserves angles
        // The new center of selector is the *transformed* center by the scale
        const selectorNewCenter = scaleDir(
          scaleFactor,
          scaleDirection,
          scaleCenter
        )(selector.center);
        // The new width and height is computed measuring the distance 
        // between the transformed corners of the selector instead of 
        // using and if..else clause to distinguish between 'nm' and 'sm'
        // (where the height is multiply by `scaleFactor` while the width does
        // not change), and 'em' and 'wm' (where the width is multiplied 
        // by `scaleFactor` and the height does not change).
        const selectorTopLeft = rotate(selector.rotate, selector.center)(
          selector
        );
        const selectorTopRight = rotate(selector.rotate, selector.center)(
          new Point(selector.x + selector.width, selector.y)
        );
        const selectorBottomLeft = rotate(selector.rotate, selector.center)(
          new Point(selector.x, selector.y + selector.height)
        );

        const newWidth = Point.distance(
          scaleDir(scaleFactor, scaleDirection, scaleCenter)(selectorTopLeft),
          scaleDir(scaleFactor, scaleDirection, scaleCenter)(selectorTopRight)
        );
        const newHeight = Point.distance(
          scaleDir(scaleFactor, scaleDirection, scaleCenter)(selectorTopLeft),
          scaleDir(scaleFactor, scaleDirection, scaleCenter)(selectorBottomLeft)
        );

        // Finally we compute the new top left corner of the selector once
        // we know the new center and the new width and height.
        let selectorNewTopLeft = translate(
          new Point(-newWidth / 2, -newHeight / 2)
        )(selectorNewCenter);

        // We transform coordinates from slide to window
        selectorNewTopLeft = changeCoordinatesFromSlideToWindow(
          slide,
          store.delta,
          selectorNewTopLeft
        );
        // Position #selector in the window. The computed width and height
        // have to be scaled by store.delta
        visuallySetItem(
          {left: selectorNewTopLeft.x,
            top: selectorNewTopLeft.y,
            width: newWidth * store.delta,
            height: newHeight * store.delta,
            rotate: selector.rotate
          },
          store.selector
        );

        // Scale all the selected elements.
        store.selectedItems.map(item => {
          scaleDirItem(scaleFactor, scaleDirection, scaleCenter, item);
        });
      } else { // Apply a proportional scale
        // Update selector position
        // We move the top-left vertex of the selector according with the
        // applied transformation
        const selectorNewCenter = scale(scaleFactor, scaleCenter)(selector.center);
        let selectorNewTopLeft = translate(
          new Point(
            -selector.width * scaleFactor / 2,
            -selector.height * scaleFactor / 2
          )
        )(selectorNewCenter);

        // We transform coordinates from slide to window
        let selectorNewTopLeftinWindowCoord = changeCoordinatesFromSlideToWindow(
          slide,
          store.delta,
          selectorNewTopLeft
        );
        // Position #selector in the window. It is not necessary to `rotate`
        // again the element since the scale does not affect the rotation of
        // the element. In this case (proportional scale), both the width and
        // height of the selector are multiplied by `scaleFactor` (as well
        // as `store.delta`)
        visuallySetItem(
          {left: selectorNewTopLeftinWindowCoord.x,
            top: selectorNewTopLeftinWindowCoord.y,
            width: selector.width * scaleFactor * store.delta,
            height: selector.height * scaleFactor * store.delta,
            rotate: selector.rotate
          },
          store.selector
        );

        // Scale all the selected elements.
        store.selectedItems.map(item => {
          if (item.type === 'group'){
            // Update group container position
            let newGroupContainer = scaleItem(scaleFactor, scaleCenter, item);
            visuallySetItem(newGroupContainer, item);
            // Update children position
            item.scale(scaleFactor, scaleCenter, new Point(newGroupContainer.left, newGroupContainer.top) );
          } else {
            visuallySetItem(scaleItem(scaleFactor, scaleCenter, item), item);
          }
        });

        // TODO: Move to the `ondend` event
        // We update the #fake-drag position and dimensions.
        // It is exactly the same as the selector but before
        // applying the coordinate change to the window.
        // console.log(store.selectedItems[0].type);
        if (store.selectedItems.length > 1) {
          store.internaleDraggable.node.style.left = selectorNewTopLeft.x + 'px';
          store.internaleDraggable.node.style.top = selectorNewTopLeft.y + 'px';
          store.internaleDraggable.node.style.width = selector.width * scaleFactor + 'px';
          store.internaleDraggable.node.style.height = selector.height * scaleFactor + 'px';
        }
      }
    },
    onend: event => {
      // AQUÍ SE GUARDAN LOS DATOS DE ESTA FORMA NORMALMENTE:
      store.selectedItems.map(item => {
        if (item.type === 'group'){
          // Update the position of each item in the group
          item.groupedItems.map(item => {
            // const newItemData = item.node.getBoundingClientRect();
            // item.setPosition(newItemData.x, newItemData.y);
            // item.setSize(newItemData.width, newItemData.height);

            const $item = $(item.node);
            // console.log($item);
            // console.log(item.node.getBoundingClientRect());
            // Como el objeto se mueve a través del DOM y no del store
            // La obtención final de los datos la obtenemos siempre de lo
            // que tenemos en pantalla y nos dice el CSS
            // En esta caso la posición es con respecto al contenedor
            // del grupo pues cada item es un hijo.
            const posicionFinalXDelItem = parseFloat($item.css('left'));
            const posicionFinalYDelItem = parseFloat($item.css('top'));
            item.setPosition(posicionFinalXDelItem, posicionFinalYDelItem);
            const anchoFinal = $item.width();
            const altoFinal = $item.height();
            item.setSize(anchoFinal, altoFinal);
          });
        }
        // Convertimos el item a un node de jQuery para mayor comodidad
        const $item = $(item.node);
        // Como el objeto se mueve a través del DOM y no del store
        // La obtención final de los datos la obtenemos siempre de lo
        // que tenemos en pantalla y nos dice el CSS
        const posicionFinalXDelItem = parseFloat($item.css('left'));
        const posicionFinalYDelItem = parseFloat($item.css('top'));
        item.setPosition(posicionFinalXDelItem, posicionFinalYDelItem);

        const anchoFinal = $item.width();
        const altoFinal = $item.height();
        item.setSize(anchoFinal, altoFinal);

        const rotaciónFinal = getRotationDegrees($item);
        item.setRotation(rotaciónFinal);
      });
    },
  });
};
const destroyResize = () => {
  interact('.pointers').unset();
};

export {attachResize, destroyResize};
