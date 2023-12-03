import convert from "color-convert";

/**
 * Color in lab space
 */
export default class Color {
  /**
   * Construct color from lab space. Default to have cluster 0
   * @param {number} l
   * @param {number} a
   * @param {number} b
   */
  constructor(l, a, b) {
    this.l = Math.round(l);
    this.a = Math.round(a);
    this.b = Math.round(b);
    this.cluster = 0;
  }

  /**
   * Convert to hex string
   * @return {string}
   */
  stringify() {
    const hex = convert.lab.hex(this.l, this.a, this.b);
    return `#${hex}`;
  }

  /**
   * Calculate distance in lab color space
   * @param {Color} a
   * @param {Color} b
   * @returns {number}
   */
  static dist(a, b) {
    const dl = (a.l - b.l) / 2.55;
    const da = a.a - b.a;
    const db = a.b - b.b;
    return Math.sqrt(Math.pow(dl, 2) + Math.pow(da, 2) + Math.pow(db, 2));
  }

  /**
   * Construct color from rgb space
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @return {Color}
   */
  static fromRgb(r, g, b) {
    return new Color(...convert.rgb.lab(r, g, b));
  }
}
