import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees } from './Math';

const attachResize = () => {
  interact('.pointers').draggable({
    onstart: event => {
      // Datos importantes del event

      // Tirador (bolita desde donde se tira)
      console.group('Datos del evento: ');
      console.log('Evento currentTarget: ');
      console.log(event.currentTarget);
      console.log('Id para saber el tirador currentTarget: ');
      console.log(event.currentTarget.getAttribute('id')); // id del tirador, para saber cual es

      console.groupEnd();
      console.group('Datos del Selector: ');
      // Obtener posiciones del selector con respecto a la ventana
      console.log('Datos con respecto a la ventana del selector: ');
      console.log(store.selector.node.getBoundingClientRect); // posiciones
      // Convertimos a jQuery para obtener la rotación, esto se puede hacer de varias formas:
      const $selectorConJquery = $(store.selector.node);
      console.log(
        'Rotación del selector: ' + getRotationDegrees($selectorConJquery)
      ); // el valor es cero cuando está el tirador del rotador abajo
      console.groupEnd();

      console.group('Valores de los items seleccionados: ');
      // Obtener datos de los elementos seleccionados
      store.selectedItems.map(item => {
        console.group('Valores del item con color:' + item.background);
        console.log('Nodo HTML: ');
        console.log(item.node); // Objeto nativo de javascript, equivale a document.getElementById
        console.log('Valores con respecto a la ventana:');
        console.log(item.node.getBoundingClientRect()); // Valores con respecto a la ventana
        console.log('Valores con respecto al slide:');
        const $item = $(item.node);
        console.log('x: ' + parseFloat($item.css('left')));
        console.log('y: ' + parseFloat($item.css('top')));
        console.log('w: ' + $item.width());
        console.log('h: ' + $item.height());
        console.log('Rotación del item: ' + getRotationDegrees($item));
        console.groupEnd();
      });
      console.groupEnd();

      console.group('Datos de la slide: ');
      console.log('Datos con respecto a la ventana: ');
      console.log(document.getElementById('slide').getBoundingClientRect());
      console.log('Datos de ancho y alto: ');
      const $slide = $(document.getElementById('slide'));
      console.log('w: ' + $slide.width());
      console.log('h: ' + $slide.height());
      console.groupEnd();
    },
    onmove: event => {
      // AQUÍ VA TODA LA LÓGICA DE HACER LOS CALCULOS
      console.log(
        'Delta Nativo X: ' + event.dx + ' Delta Nativo Y: ' + event.dy
      );
      console.log(
        'Delta Escalado X: ' +
          event.dx / store.delta +
          'Delta Escalado Y: ' +
          event.dy / store.delta
      );
    },
    onend: event => {
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
