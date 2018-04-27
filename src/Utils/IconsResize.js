import interact from 'interactjs';
import store from '../Store';
import $ from 'jquery';
import { getRotationDegrees } from '../Utils/Math';

const points = ['nw', 'nm', 'ne', 'em', 'se', 'sm', 'sw', 'wm'];

const attachIconsResize = () => {
  $('.pointers').on('mouseenter', event => {
    console.log(event);
    console.log(event.currentTarget);
    changeCursor(event.currentTarget.getAttribute('id'));
    // Do stuff here
  });

  $('.pointers').on('mouseout', event => {
    points.map(point => {
      const className = point + '-cursor';
      if ($('html').hasClass(className)) {
        $('html').removeClass(className);
      }
    });
  });
};
const destroyIconsResize = () => {
  $('.pointers').off('mouseenter');
};

const changeCursor = target => {
  let angle = getRotationDegrees($('#selector'));
  if (angle < 0) {
    angle += 360;
  }
  let el = target;

  switch (target) {
    case 'ne': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'em';
        break;
      } else if (angle < 135) {
        el = 'se';
        break;
      } else if (angle < 180) {
        el = 'sm';
        break;
      } else if (angle < 225) {
        el = 'sw';
        break;
      } else if (angle < 270) {
        el = 'wm';
        break;
      } else if (angle < 315) {
        el = 'nw';
      } else {
        el = 'nm';
      }
      break;
    }

    case 'em': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'se';
        break;
      } else if (angle < 135) {
        el = 'sm';
        break;
      } else if (angle < 180) {
        el = 'sw';
        break;
      } else if (angle < 225) {
        el = 'wm';
        break;
      } else if (angle < 270) {
        el = 'nw';
        break;
      } else if (angle < 315) {
        el = 'nm';
      } else {
        el = 'ne';
      }
      break;
    }

    case 'se': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'sm';
        break;
      } else if (angle < 135) {
        el = 'sw';
        break;
      } else if (angle < 180) {
        el = 'wm';
        break;
      } else if (angle < 225) {
        el = 'nw';
        break;
      } else if (angle < 270) {
        el = 'nm';
        break;
      } else if (angle < 315) {
        el = 'ne';
      } else {
        el = 'em';
      }
      break;
    }

    case 'sm': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'sw';
        break;
      } else if (angle < 135) {
        el = 'wm';
        break;
      } else if (angle < 180) {
        el = 'nw';
        break;
      } else if (angle < 225) {
        el = 'nm';
        break;
      } else if (angle < 270) {
        el = 'ne';
        break;
      } else if (angle < 315) {
        el = 'em';
      } else {
        el = 'se';
      }
      break;
    }

    case 'sw': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'wm';
        break;
      } else if (angle < 135) {
        el = 'nw';
        break;
      } else if (angle < 180) {
        el = 'nm';
        break;
      } else if (angle < 225) {
        el = 'ne';
        break;
      } else if (angle < 270) {
        el = 'em';
        break;
      } else if (angle < 315) {
        el = 'se';
      } else {
        el = 'sm';
      }
      break;
    }

    case 'wm': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'nw';
        break;
      } else if (angle < 135) {
        el = 'nm';
        break;
      } else if (angle < 180) {
        el = 'ne';
        break;
      } else if (angle < 225) {
        el = 'em';
        break;
      } else if (angle < 270) {
        el = 'se';
        break;
      } else if (angle < 315) {
        el = 'sm';
      } else {
        el = 'sw';
      }
      break;
    }

    case 'nw': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'nm';
        break;
      } else if (angle < 135) {
        el = 'ne';
        break;
      } else if (angle < 180) {
        el = 'em';
        break;
      } else if (angle < 225) {
        el = 'se';
        break;
      } else if (angle < 270) {
        el = 'sm';
        break;
      } else if (angle < 315) {
        el = 'sw';
      } else {
        el = 'wm';
      }
      break;
    }

    case 'nm': {
      if (angle < 45) {
        break;
      } else if (angle < 90) {
        el = 'ne';
        break;
      } else if (angle < 135) {
        el = 'em';
        break;
      } else if (angle < 180) {
        el = 'se';
        break;
      } else if (angle < 225) {
        el = 'sm';
        break;
      } else if (angle < 270) {
        el = 'sw';
        break;
      } else if (angle < 315) {
        el = 'wm';
      } else {
        el = 'nw';
      }
      break;
    }

    default: {
      break;
    }
  }

  points.map(point => {
    const className = point + '-cursor';
    if ($('html').hasClass(className)) {
      $('html').removeClass(className);
    }
  });
  $('html').addClass(el + '-cursor');
};

export { attachIconsResize, destroyIconsResize };
