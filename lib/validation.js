'use strict';

try {
    const isValidUTF8 = (buf) => {
      var len = buf.length;
      var i = 0;

      while (i < len) {
        if (buf[i] < 0x80) {  // 0xxxxxxx
          i++;
        } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx
          if (
            i + 1 === len ||
            (buf[i + 1] & 0xc0) !== 0x80 ||
            (buf[i] & 0xfe) === 0xc0  // overlong
          ) {
            return false;
          } else {
            i += 2;
          }
        } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
          if (
            i + 2 >= len ||
            (buf[i + 1] & 0xc0) !== 0x80 ||
            (buf[i + 2] & 0xc0) !== 0x80 ||
            buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong
            buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0     // surrogate (U+D800 - U+DFFF)
          ) {
            return false;
          } else {
            i += 3;
          }
        } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
          if (
            i + 3 >= len ||
            (buf[i + 1] & 0xc0) !== 0x80 ||
            (buf[i + 2] & 0xc0) !== 0x80 ||
            (buf[i + 3] & 0xc0) !== 0x80 ||
            buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong
            buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF
          ) {
            return false;
          } else {
            i += 4;
          }
        } else {
          return false;
        }
      }

      return true;
    };

  exports.isValidUTF8 = typeof isValidUTF8 === 'object'
    ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
    : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  exports.isValidUTF8 = () => true;
}

/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
exports.isValidStatusCode = (code) => {
  return (
    (code >= 1000 &&
      code <= 1013 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
};
