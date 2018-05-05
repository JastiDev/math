import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees, changeCoordinatesFromWindowToSlide, changeCoordinatesFromSlideToWindow, scaleItem, scaleDirItem } from './Math';
import {Point, rotate, translate, scale} from './planeTransforms.js';

var selector;
var slide;
var scaleCenter = new Point(0,0);     // Center of the scale transformation
var scaleFactor = 0;                  // Scale factor to apply

var clickPoint = ''; // vertex of the selector clicked by the user

// Direction of the mouse movement that will be consider to scale the element
var scaleDirection = new Point(0,0);
// Amount of mouse movement in the scaleDirection normalize by store.delta
var scaleDelta = 0;


const attachResize = () => {
  interact('.pointers').draggable({
    onstart: event => {
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
      // We add to selector its width, height, angle and diagonal length
      // with respect to the slide (store.delta scaled)
      selector.width = parseFloat(store.selector.node.style.width)/store.delta;
      selector.height = parseFloat(store.selector.node.style.height)/store.delta;
      selector.rotate = getRotationDegrees($(store.selector.node));
      selector.diagonal = Math.hypot(selector.width, selector.height);

      // Reset the scaleDelta after a complete scaling
      scaleDelta = 0;

      // id del tirador: 
      // - 'nm', 'wm', 'em', 'sm' Puntos medios
      // - 'ne', 'nw', 'se', 'sw' Esquinas
      // console.log(event.currentTarget.getAttribute('id')); 

      clickPoint = event.currentTarget.getAttribute('id');
      // Compute the center of the scale. It is the opposite point selected
      // by the user. Observe that (selector.x, selector.y) is the top left
      // corner of the selector before selector.rotate (if any)
      // TODO: If p is the point with coordinates with respect to the slide 
      // of the point clicked by the user the following switch can be sustituted by
      // const scaleCenter = rotate(180, new Point(selector.x + selector.width/2, selector.y + selector.height/2))(p);
      switch(clickPoint){
        case 'nw':
          scaleCenter = new Point(
            selector.x + selector.width, 
            selector.y + selector.height
          );
          scaleDirection = new Point(
            - selector.width,
            - selector.height
          );
          break;
        case 'nm':
          scaleCenter = new Point(
            selector.x + selector.width/2, 
            selector.y + selector.height
          );
          scaleDirection = new Point( 0, -selector.height);
          break;
        case 'ne':
          scaleCenter = new Point(
            selector.x, 
            selector.y + selector.height
          );
          scaleDirection = new Point(
            selector.width,
            -selector.height
          );
          break; 
        case 'em':
          scaleCenter = new Point(
            selector.x, 
            selector.y + selector.width/2
          );
          scaleDirection = new Point( selector.width, 0 );
          break;
        case 'se':
          scaleCenter = new Point(selector.x, selector.y);
          scaleDirection = new Point(
            selector.width,
            selector.height
          );
          break;
        case 'sm':
          scaleCenter = new Point(
            selector.x + selector.width/2, 
            selector.y
          );
          scaleDirection = new Point( 0, selector.height);
          break;
        case 'sw':
          scaleCenter = new Point(
            selector.x + selector.width, 
            selector.y
          );
          scaleDirection = new Point(
            -selector.width,
            selector.height
          );
          break;
        case 'wm':
          scaleCenter = new Point(
            selector.x + selector.width, 
            selector.y + selector.height/2
          );
          scaleDirection = new Point( -selector.width, 0);
          break;
      }
      // scaleCenter and scaleDirection are computed with respect to the 
      // selector before applying an eventual rotation. We have to apply 
      // to them the same rotation as the selector element to correctly 
      // get its coordinates in the slide
      scaleCenter = rotate(selector.rotate, new Point(selector.x + selector.width/2, selector.y + selector.height/2))(scaleCenter);
      scaleDirection = rotate(selector.rotate)(scaleDirection);



      // console.group('Valores del selector con respecto a la ventana:');
      // console.log('x: ' + store.selector.node.style.left); 
      // console.log('y: ' + store.selector.node.style.top);
      // console.log('w: ' + store.selector.node.style.width);
      // console.log('h: ' + store.selector.node.style.height);
      // console.groupEnd();

      // console.group('Valores del selector con respecto al slide:');
      // const newTopLeft = changeCoordinatesFromWindowToSlide(
      //   new Point(slide.x, slide.y), 
      //   store.delta, 
      //   new Point(
      //     parseFloat(store.selector.node.style.left), parseFloat(store.selector.node.style.top))
      // );
      // console.log('x: ' + newTopLeft.x); 
      // console.log('y: ' + newTopLeft.y);
      // console.log('w: ' + store.selector.node.style.width/store.delta);
      // console.log('h: ' + store.selector.node.style.height/store.delta);
      // console.groupEnd();


      // // items seleccionados
      // store.selectedItems.map(item => {
      //   console.group('Valores del item con color:' + item.background);

      //   console.log('Valores del item en el store: ');
      //   console.log('x: ' + item.left);
      //   console.log('y: ' + item.top);
      //   console.log('w: ' + item.width);
      //   console.log('h: ' + item.height);
      //   console.log('r: ' + item.rotate);

      //   console.groupEnd();
      // });

      // Datos importantes del event

      // Tirador (bolita desde donde se tira)
      // console.group('Datos del evento: ');
      // console.log('Evento currentTarget: ');
      // console.log(event.currentTarget);
      // console.log('Id para saber el tirador currentTarget: ');
      // // id del tirador: 
      // // - 'nm', 'wm', 'em', 'sm' Puntos medios
      // // - 'ne', 'nw', 'se', 'sw' Esquinas
      // console.log(event.currentTarget.getAttribute('id')); // id del tirador, para saber cual es
      // console.groupEnd();

      // console.group('Datos del Selector: ');
      // // Obtener posiciones del selector con respecto a la ventana
      // console.log('Datos con respecto a la ventana del selector: ');
      // console.log(store.selector.node.getBoundingClientRect); // posiciones
      // console.log(store.selector.node); // posiciones
      // console.log(store.selector.node.style.left); // posiciones
      // // Convertimos a jQuery para obtener la rotación, esto se puede hacer de varias formas:
      // const $selectorConJquery = $(store.selector.node);
      // console.log(
      //   'Rotación del selector: ' + getRotationDegrees($selectorConJquery)
      // ); // el valor es cero cuando está el tirador del rotador abajo
      // console.groupEnd();

      // console.group('Valores de los items seleccionados: ');
      // // Obtener datos de los elementos seleccionados
      // store.selectedItems.map(item => {
      //   console.group('Valores del item con color:' + item.background);
      //   console.log('Nodo HTML: ');
      //   console.log(item.node); // Objeto nativo de javascript, equivale a document.getElementById
      //   console.log('Valores con respecto a la ventana:');
      //   console.log(item.node.getBoundingClientRect()); // Valores con respecto a la ventana
      //   console.log('Valores con respecto al slide:');
      //   const $item = $(item.node);
      //   console.log('x: ' + parseFloat($item.css('left')));
      //   console.log('y: ' + parseFloat($item.css('top')));
      //   console.log('w: ' + $item.width());
      //   console.log('h: ' + $item.height());
      //   console.log('Rotación del item: ' + getRotationDegrees($item));

      //   console.log('Valores del item en el store: ');
      //   console.log('x: ' + item.left);
      //   console.log('y: ' + item.top);
      //   console.log('w: ' + item.width);
      //   console.log('h: ' + item.height);
      //   console.log('r: ' + item.rotate);

      //   console.groupEnd();
      // });
      // console.groupEnd();

      // console.group('Datos de la slide: ');
      // console.log('Datos con respecto a la ventana: ');
      // console.log(document.getElementById('slide').getBoundingClientRect());
      // console.log('Datos de ancho y alto: ');
      // const $slide = $(document.getElementById('slide'));
      // console.log('w: ' + $slide.width());
      // console.log('h: ' + $slide.height());
      // // console.log('slide: ' + $slide);
      // console.log('delta' + store.delta);
      // console.groupEnd();
    },
    onmove: event => {
      var userPull = new Point(event.dx, event.dy);
      scaleDelta += userPull.component(scaleDirection) / store.delta;
      scaleFactor = (selector.diagonal + scaleDelta) / selector.diagonal;

      // We move the top-left vertex of the selector according with the 
      // applied transformation
      const selectorNewCenter = scale(scaleFactor, scaleCenter)(
        new Point(selector.x + selector.width/2, selector.y + selector.height/2)
      );
      let selectorNewTopLeft = translate(new Point(-selector.width*scaleFactor/2, -selector.height*scaleFactor/2))(selectorNewCenter);
      // We transform coordinates from slide to window
      selectorNewTopLeft = changeCoordinatesFromSlideToWindow(slide, store.delta, selectorNewTopLeft);
      // Position #selector in the window. It is not necessary to `rotate`
      // again the element since the scale does not affect the rotation of
      // the element.
      $('#selector').css({ left: selectorNewTopLeft.x, top: selectorNewTopLeft.y });

      // Finally we *scale* the selector. We have to take into account that
      // the coordinate system for the selector is outside the slide so
      // we have to correct the scale factor by `store.delta`
      $('#selector').css({width: selector.width*scaleFactor*store.delta, height: selector.height*scaleFactor*store.delta});

      
      store.selectedItems.map(item => {
        if (clickPoint === 'em' || clickPoint === 'nm' || clickPoint === 'wm' || clickPoint === 'sm'){
          scaleDirItem(scaleFactor, scaleDirection, scaleCenter, item);
        }
        else{ 
          scaleItem(scaleFactor, scaleCenter, item);
        }
      });

    },
    onend: event => {
      scaleFactor = 0;

      // TODO Actualizar la información del selector. Si se componen dos
      // tipos de movimientos (p.e. un escalado y una rotación) no se realiza
      // correctamente puesto que en el segundo movimiento se aplica la 
      // información del selector inicial.

      // AQUÍ SE GUARDAN LOS DATOS DE ESTA FORMA NORMALMENTE:
      store.selectedItems.map(item => {
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
        // TODO: Al escalar un grupo da error la siguiente función.
        item.setSize(anchoFinal, altoFinal);
        const rotaciónFinal = getRotationDegrees($item);
        item.setRotation(rotaciónFinal);
      });
    }
  });
};
const destroyResize = () => {
  interact('.pointers').unset();
};

export { attachResize, destroyResize };
