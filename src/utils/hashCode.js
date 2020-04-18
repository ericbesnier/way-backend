export function hashCode(obj) {
  var hc = 0;
  var chars = JSON.stringify(obj).replace(/\{|"|\}|:|,/g, '');
  var len = chars.length;
  for (var i = 0; i < len; i++) {
    // Bump 7 to larger prime number to increase uniqueness
    hc += (chars.charCodeAt(i) * 7);
  }
  return hc;
}