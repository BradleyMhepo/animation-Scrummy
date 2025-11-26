declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(element: HTMLCanvasElement | CanvasRenderingContext2D | ImageData, options?: { delay?: number }): void;
    render(): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
  }

  export default GIF;
}

