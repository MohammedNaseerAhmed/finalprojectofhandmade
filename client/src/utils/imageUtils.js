/**
 * Utility function to construct proper image URLs
 * @param {string} imagePath - The image path from the backend
 * @returns {string} - Full URL for the image or placeholder
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Return placeholder SVG for products without images
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmaWxsPSIjOTlBM0FGIj5IYW5kbWFkZTwvdGV4dD4KPC9zdmc+"
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If it's a relative path, prepend the backend base URL
  const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000'
  return `${baseURL}${imagePath}`
}

/**
 * Get placeholder image for different sizes
 * @param {string} size - Size variant: 'small', 'medium', 'large'
 * @returns {string} - Base64 encoded SVG placeholder
 */
export const getPlaceholderImage = (size = 'medium') => {
  const sizes = {
    small: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEM0Ni42MjcgMjAgNTIgMjUuMzcyIDUyIDMyQzUyIDM4LjYyOCA0Ni42MjcgNDQgNDAgNDRDMzMuMzcyIDQ0IDI4IDM4LjYyOCAyOCAzMkMyOCAyNS4zNzIgMzMuMzcyIDIwIDQwIDIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNDAgNTJDMzMuMzcyIDUyIDI4IDU3LjM3MiAyOCA2NFY2MEMyOCA2Ni42MjggMzMuMzcyIDcyIDQwIDcyQzQ2LjYyNyA3MiA1MiA2Ni42MjggNTIgNjBWNjRDNTIgNTcuMzcyIDQ2LjYyNyA1MiA0MCA1MloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+",
    medium: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmaWxsPSIjOTlBM0FGIj5IYW5kbWFkZTwvdGV4dD4KPC9zdmc+",
    large: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAwIiBoZWlnaHQ9IjkwMCIgdmlld0JveD0iMCAwIDkwMCA5MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI5MDAiIGhlaWdodD0iOTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjQ1MCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjOTlBM0FGIj5IYW5kbWFkZTwvdGV4dD4KPC9zdmc+"
  }
  
  return sizes[size] || sizes.medium
}
