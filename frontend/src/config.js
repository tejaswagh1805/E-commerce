export const API_URL = process.env.REACT_APP_API_URL || 'https://api.muktamedia.in';

// Handles both Cloudinary full URLs and local filenames
export const getImageUrl = (image) => {
    if (!image) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (image.startsWith('http')) return image;
    return `${API_URL}/uploads/${image}`;
};
