/**
 * Cloudinary unsigned upload helper
 * Uses Cloudinary's upload API directly from the browser
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD || 'taklifnoma';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || 'taklifnoma_unsigned';

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} resourceType - 'image' or 'video' (audio uses video)
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export async function uploadToCloudinary(file, resourceType = 'image') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'taklifnoma');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    throw new Error('Upload failed');
  }

  const data = await res.json();
  return data.secure_url;
}

/**
 * Upload image with auto-optimization
 */
export async function uploadImage(file) {
  return uploadToCloudinary(file, 'image');
}

/**
 * Upload audio file
 */
export async function uploadAudio(file) {
  return uploadToCloudinary(file, 'video'); // Cloudinary uses 'video' for audio
}
