/* 
 * @file (Affine) transformation of the plane.
 * @author torralbo.fco@gmail.com (Francisco Torralbo)
 *
 * All the angles are measure in degrees due to program requirements.
 */

/* 
 * Convert an angle from radians into degrees
 * @param {Number} angle
 *
 * @return {Number} - same angle measure in degrees.
 */
const toDegrees = function(angle) {
  return angle * (180 / Math.PI);
};

/* 
 * Convert an angle from degrees into radians
 * @param {Number} angle
 *
 * @return {Number} - same angle measure in radians.
 */
const toRadians = function(angle) {
  return angle * (Math.PI / 180);
};

class Point {
  /*
     * Represent a point in the plane.
     * @constructor
     *
     * @param (Number) x - X-coordinate of the point
     * @param (Number) y - Y-coordinate of the point
     *
     */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /*
     * Normalize the point coordinates so both are integer
     *
     * Only integer coordinates will be considered. If the params `x`
     * or ´y´ are floats they will be aproximated by the nearest integer 
     * using `Math.round` function.
     */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  /*
     * Get the distance from the point to the origin
     *
     * @return {Number} - Distance from this point to the origin (0, 0).
     *
     * This is equivalent to compute the *length* of the vector defined
     * by the point.
     */
  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /*
     * Get the angle between the line throught the point and the origin 
     * with respecto to the X-axis measure from 0º to 180º if the point is
     * in the first or second quadrant and measure from -180º to 0º if
     * the point is in the third of fouth quadrant.
     * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Math/atan2
     *
     * @return {Number} - the angle of the line throught the point and (0,0).
     */
  get angle() {
    return toDegrees(Math.atan2(this.y, this.x));
  }

  /*
     * Compute the direction (a math vector) that points from this point to another one
     * @param {Point} p - the final point of the vector
     *
     * @return {Point} - A vector pointing from this to p.
     */
  direction(p) {
    return new Point(p.x - this.x, p.y - this.y);
  }

  /*
     * Component of the vector defined by this in the direction of the
     * vector defined by v
     *
     * @param {Point} v - point in the plane that represent a vector (direction)
     * from the origin to v.
     *
     * @return {Float} - length of the proyection of the vector define by this
     * onto the vector defined by v.
     */
  component(v) {
    // TODO if v = (0, 0) then an overflow error will be produced.
    return (this.x * v.x + this.y * v.y) / v.length();
  }

  /* 
     * Compute the distance between two points
     * @param {Point} p - a point to compute the distance
     * @param {Point} q - a point to compute the distance
     *
     * @return {Number} - Distance from p to q.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot  
     */
  static distance(p, q) {
    return Math.hypot(p.x - q.x, p.y - q.y);
    // return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
  }

  /* 
     * Show the point coordinates in the console
     */
  log() {
    console.log('Point(' + this.x + ' ,' + this.y + ')');
  }
}

/*
 * We now define the plane transformations needed in the app.
 * We first declare the primitive transformation:
 * - Rotations with respecto to the origin `rotateOrigin`
 * - Scale with respect to the origin `scaleDirOrigin`, `scaleOrigin`, 
 *   `scaleXOrigin` and `scaleYOrigin`
 * - Translations `translate`
 *
 * This transformations (except `translate`) are not exported.
 *
 * Secondly, the class declare the transformations with center an arbitrary 
 * point using the technique of *conjugating* with appropriate translations 
 * (see `moveTransformOrigin`):
 * - Rotations by a given angle around a point: `rotate`
 * - Scale by a given factor with center a point: `scale`, `scaleX`, 
 *   `scaleY`, `scaleDir`
 */

/*
 * Get the opposite (symmetric point with respect to the origin)
 * of a point.
 *
 * @return {Point} - Opposite point.
 */
const opposite = function(p) {
  return new Point(-p.x, -p.y);
};

/* 
 * Rotation of a point a given angle around the origin
 *
 * @return {Function} - Rotation around the origin.
 */
const rotateOrigin = function(angle) {
  return function(p) {
    return new Point(
      p.x * Math.cos(toRadians(angle)) - p.y * Math.sin(toRadians(angle)),
      p.x * Math.sin(toRadians(angle)) + p.y * Math.cos(toRadians(angle))
    );
  };
};

/*
 * Scale with respect to a given direction v = (v.x, v.y). Returns a 
 * (generally non-proportional) scale of center the origin and *ratio* 
 * v.x in the X-direction and v.y in the Y-direction
 *
 * @param {Point} v - Vector that defined the scale.
 *
 * @return {Function} scale acording to the direction of v.
 */
const scaleDirOrigin = function(v){
  return function(p){
    return new Point(v.x * p.x, v.y * p.y);
  };
};

/* 
 * Scale with respect to the origin constructor. Returns a (proportional) 
 * scale of center the origin and *ratio* `scaleFactor`.
 *
 * @param {Number} scaleFactor - Scale factor.
 * If scaleFactor is negative the resulting transformation will be 
 * the composition of a homothety with an inversion with respect to
 * the origin.
 * @see https://en.wikipedia.org/wiki/Homothetic_transformation
 *
 * @return {Function} A (proportional) scale of ratio `scaleFactor` and 
 * center the origin.
 */
const scaleOrigin = function(scaleFactor) {
  // Equivalent to this.scaleDirOrigin(scaleFactor, scaleFactor)
  return function(p) {
    return new Point(scaleFactor * p.x, scaleFactor * p.y);
  };
};


/* 
 * Scale in the X direction constructor. Returns a (non-proportional) scale 
 * in the X direction of center the origin and *ratio* `scaleFactor`.
 *
 * @param {Number} scaleFactor - Scale factor (ratio of the dilation).
 * If scaleFactor is negative the resulting transformation will be 
 * the composition of a homothety with an inversion with respect to
 * the origin.
 * @see https://en.wikipedia.org/wiki/Homothetic_transformation
 * @param {Point} center - center of the scale.
 *
 * @return {Function} An (non-proportional) scale function in the director 
 * of X axis of ratio scaleFactor and center the origin.
 */
const scaleXOrigin = function(scaleFactor) {
  // Equivalent to this.scaleDirOrigin(scaleFactor, 0)
  return function(p) {
    return new Point(scaleFactor * p.x, p.y);
  };
};

/* 
 * Scale in the Y direction constructor. Returns a (non-proportional) scale 
 * in the Y direction of center the origin and *ratio* `scaleFactor`.
 *
 * @param {Number} scaleFactor - Scale factor (ratio of the dilation).
 * If scaleFactor is negative the resulting transformation will be 
 * the composition of a homothety with an inversion with respect to
 * the origin.
 * @see https://en.wikipedia.org/wiki/Homothetic_transformation
 * @param {Point} center - center of the scale.
 *
 * @return {Function} A (non-proportional) scale function in the director 
 * of Y axis of ratio scaleFactor and center the origin.
 */
const scaleYOrigin = function(scaleFactor) {
  // Equivalent to this.scaleDirOrigin(0, scaleFactor)
  return function(p) {
    return new Point(p.x, scaleFactor * p.y);
  };
};

/*
 * Returns a translation (function) in a given direction 
 * (math vector (0,0)->(vector.x, vector.y) represented by 
 * the Point (vector.x, vector.y) in the plane).
 * @param {Point} vector - translation direction 
 *
 * @return {Function} - translation of vector `(vector.x, vector.y)`
 */
const translate = function(vector) {
  return function(point) {
    /*
     * Translation of vector  
     * (a, b) => (a + vector.x, b + vector.y)
     * @param {Point} point - Point to translate
     *
     * @return {Point} - translated point along `vector`
     */
    return new Point(point.x + vector.x, point.y + vector.y);
  };
};

/*
 * Move the center of the transformation by a direction given by a point
 *
 * If the transformation is a rotation around the origin the resulting 
 * transformation will be a rotation around the given point. 
 * If the transformation is a scale with respect to the origin the 
 * resulting transformation will be a scale with respect to the given point
 *
 * In mathematicas this procedure is called *conjugation*
 *
 * @param {Function} transformation -  The inicial transformation to conjugate
 * via translation in the plane. It mus be a one-parameter function.
 * @param {Poing} point - Point in the plane that define the translation to 
 * use in the conjugation.
 *
 * @return {Function} - Conjugated transformation by the translation of point.
 */
const moveTransformOrigin = function(transformation, point) {
  return function(p) {
    return translate(point)(
      transformation(translate(opposite(point))(p))
    );
  };
};

/*
 * Returns a rotation (function) of a given angle with respect a given center.
 * @param {Number} angle - rotation angle in degrees
 * @param {Point} center - center of rotation
 *
 * @return {Function} - Rotation of `angle` around `(centerX, centerY)`
 */
const rotate = function(angle, center = new Point(0, 0)) {
  return moveTransformOrigin(rotateOrigin(angle), center);
};

/*
 * Scale with respect to a given point constructor. Returns a
 * (proportional) scale of center a given point `center` and
 * scale factor `scaleFactor`
 *
 * @param {Number} scaleFactor - scale factor of the transformation.
 * @param {Point} center - center of the transformation.
 *
 * @return {Function} - (proportional) scale with respect to the point `center` and
 * scale factor `scaleFactor`
 */
const scale = function(scaleFactor, center = new Point(0, 0)) {
  return moveTransformOrigin(scaleOrigin(scaleFactor), center);
};

/*
 * Scale in the direction of a vector v = (v.x, v.y) with respect to a 
 * given point constructor.
 * Returns a (generally non-proportional) scale of center a given point 
 * `center` and scale factor v.x in the X-direction and v.y in the Y-direction
 *
 * @param {Point} v - Vector that defined the scale.
 * @param {Point} center - center of scaling.
 *
 * @return {Function} scale in the direction of `v` with respect to `center`
 */
const scaleDir = function(v, center = new Point(0, 0)){
  return moveTransformOrigin(scaleDirOrigin(v), center);
};

/*
 * Scale in the X direction with respect to a given point constructor. 
 * Returns a (non-proportional) scale of center a given point `center` and
 * scale factor `scaleFactor`
 *
 * @param {Number} scaleFactor - scale factor of the transformation.
 * @param {Point} center - center of the transformation.
 *
 * @return {Function} - (non-proportional) scale in the X direction with 
 * respect to the point `center` and scale factor `scaleFactor`
 */
const scaleX = function(scaleFactor, center = new Point(0, 0)) {
  // Equivalent scaleDir({x: scaleFactor, y:0}, center);
  return moveTransformOrigin(scaleXOrigin(scaleFactor), center);
};

/*
 * Scale in the Y direction with respect to a given point constructor. 
 * Returns a (non-proportional) scale of center a given point `center` and
 * scale factor `scaleFactor`
 *
 * @param {Number} scaleFactor - scale factor of the transformation.
 * @param {Point} center - center of the transformation.
 *
 * @return {Function} - (non-proportional) scale in the Y direction with 
 * respect to the point `center` and scale factor `scaleFactor`
 */
const scaleY = function(scaleFactor, center = new Point(0, 0)) {
  // Equivalent scaleDir({x: 0, y:scaleFactor}, center);
  return moveTransformOrigin(scaleYOrigin(scaleFactor), center);
};


export {Point, translate, rotate, scale, scaleDir, scaleX, scaleY, toDegrees, toRadians};


/* Examples */

// var origin = new Point(0, 0);
// var p = new Point(1, 0);
// p.log();
// var q = new Point(0,1);
// q.log();
// var f = rotate(90, q);
// console.log(f);
// var r = f(p);
// r.log();
// console.log('Rotation of (1,-1) 90º around the origin');
// let p = new Point(1, 0);
// p.log();
// let q = new Point(0, 1);
// q.log();
// console.log(q.length);
// scaleDir({x: 10, y:20}, q)(p).log();
