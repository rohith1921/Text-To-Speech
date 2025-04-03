// client/src/utils/helpers.js
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength 
      ? `${text.substring(0, maxLength)}…` 
      : text;
  };