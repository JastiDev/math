import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees, changeCoordinatesFromWindowToSlide, scaleItem } from './Math';
import {Point, rotate } from './planeTransforms.js';

var scaleCenter = new Point(0,0);
var scaleDirection = new Point(0,0);
var scaleFactor = 0;
var selector;

const attachResize = () => {
  interact('.pointers').draggable({
    onstart: event => {
      const slide = document.getElementById('slide').getBoundingClientRect();
      const slideTopLeft = new Point(slide.x, slide.y);

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
      selector.width = parseFloat(store.selector.node.style.width)/store.delta;
      selector.height = parseFloat(store.selector.node.style.height)/store.delta;
      selector.rotate = getRotationDegrees($(store.selector.node));
      console.log(selector);

      // id del tirador: 
      // - 'nm', 'wm', 'em', 'sm' Puntos medios
      // - 'ne', 'nw', 'se', 'sw' Esquinas
      console.log(event.currentTarget.getAttribute('id')); // id del tirador, para saber cual es

      // Compute the center of the scale. It is the opposite point selected
      // by the user. Observe that selector.x, selector.y) is the top left
      // corner of the selector before selector.rotate (if any)
      // TODO: If p is the point with coordinates with respect to the slide 
      // of the point clicked by the user the following switch can be sustituted by
      // const scaleCenter = rotate(180, new Point(selector.x + selector.width/2, selector.y + selector.height/2))(p);
      switch(event.currentTarget.getAttribute('id')){
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
            selector.y + selector.height
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
            selector.x, 
            selector.y + selector.width/2
          );
          scaleDirection = new Point( -selector.width, 0);
          break;
      }
      scaleDirection.log();
      scaleCenter = rotate(selector.rotate, new Point(selector.x + selector.width/2, selector.y + selector.height/2))(scaleCenter);



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
      // console.group('Movimiento: ');
      // // AQUÍ VA TODA LA LÓGICA DE HACER LOS CALCULOS
      // console.log(
      //   'Delta Nativo X: ' + event.dx + ' Delta Nativo Y: ' + event.dy
      // );
      // console.log(
      //   'Delta Escalado X: ' +
      //     event.dx / store.delta +
      //     'Delta Escalado Y: ' +
      //     event.dy / store.delta
      // );
      // console.groupEnd();

      var userPull = new Point(event.dx, event.dy);
      userPull.log();
      scaleDirection.log();
      scaleFactor += userPull.component(scaleDirection);
      // scaleFactor += event.dx;
      console.log('scaleFactor = ' + scaleFactor);
      
      store.selectedItems.map(item => {
        scaleItem((selector.width + scaleFactor)/selector.width, scaleCenter, item);
        // item.node.style.left += scaleFactor + 'px'; 
        // item.node.style.top += scaleFactor + 'px'; 
        // $(item.node).css({width: item.width + scaleFactor, height: item.height + scaleFactor});
        // $(item.node).css('transform', 'rotate(' + item.rotate + 'deg)');
        // Hacer cosas con el ITEM
        // Si queremos trabajar sobre el nodo: item.node
        // Si queremos convertirlo a jquery: $(item.node)
      });

    },
    onend: event => {
      scaleFactor = 0;
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
