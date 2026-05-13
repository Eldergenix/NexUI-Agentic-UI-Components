declare module "@metamask/jazzicon" {
  /**
   * Generate a Jazzicon avatar — a deterministic geometric pattern from a
   * 32-bit integer hash. Returns a detached `<div>` containing the SVG.
   *
   * @param diameter Output size in pixels (square).
   * @param seed 32-bit unsigned int (typically a string hash of an address).
   */
  export default function jazzicon(diameter: number, seed: number): HTMLDivElement;
}
