class ArrayBufferReader {
  constructor(buffer) {
    this.view = new DataView(buffer);
  }

  length() {
    return this.view.byteLength;
  }

  indexAt(i) {
    return this.view.getUint8(i);
  }
}

class HexStringReader {
  constructor(string) {
    this.string = string;
  }

  length() {
    return this.string.length / 2;
  }

  indexAt(i) {
    return parseInt(this.string.substr(i * 2, 2), 16);
  }
}

export class Reader {
  constructor(input) {
    if (typeof input === "string") {
      if ((!input.startsWith("0x")) ||
          (input.length % 2 != 0)) {
        throw new Error("Hex string must start with 0x, and has even numbered length!");
      }
      return new HexStringReader(input.substr(2));
    }
    if (input instanceof ArrayBuffer) {
      return new ArrayBufferReader(input);
    }
    throw new Error("Reader can only accept hex string or ArrayBuffer!");
  }

  static fromRawString(string) {
    const buffer = new ArrayBuffer(string.length);
    const view = new DataView(buffer);

    for (let i = 0; i < string.length; i++) {
      const c = string.charCodeAt(i);
      if (c > 0xFF) {
        throw new Error("fromRawString can only accept UTF-8 raw string!");
      }
      view.setUint8(i, c);
    }
    return new ArrayBufferReader(buffer);
  }
}
