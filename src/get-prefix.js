export default function getPrefix(prop, node) {
  if (prop in node.style) return prop;

  const upper = prop.charAt(0).toUpperCase() + prop.slice(1);

  let prefixed = false;

  ["Moz", "Khtml", "Webkit", "O", "ms"].some(prefix => {
    const tryPrefix = prefix + upper;
    if (tryPrefix in node.style) {
      prefixed = tryPrefix;
      return true;
    } else {
      return false;
    }
  });

  return prefixed;
}
