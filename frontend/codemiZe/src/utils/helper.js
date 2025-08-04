export const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const imagePath = (image) => {
  if (!image) return '/c-logo.png';
  return `${import.meta.env.VITE_BACKEND_URL}${image}`;
};

export const createFormData = (data, fileField = null, file = null) => {
  const formData = new FormData();
  
  // Add regular fields
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  // Add file if provided
  if (fileField && file) {
    formData.append(fileField, file);
  }
  
  return formData;
};

export const validateForm = (fields, required = []) => {
  const errors = [];
  
  required.forEach(field => {
    if (!fields[field] || !fields[field].toString().trim()) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};