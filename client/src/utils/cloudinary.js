/**
 * File upload helper — uploads to our own server API
 */

const API = import.meta.env.VITE_API_URL || '';

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload xatolik');
  }

  const data = await res.json();
  return data.data.url;
}

/**
 * Upload image file
 */
export async function uploadImage(file) {
  return uploadFile(file);
}

/**
 * Upload audio file
 */
export async function uploadAudio(file) {
  return uploadFile(file);
}
