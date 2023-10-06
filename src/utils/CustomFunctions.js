export function transformKey(key) {
  // Split the key into words based on capital letters
  const words = key.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with a space
  const transformedKey = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return transformedKey;
}
