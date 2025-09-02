import api from './api';

export const processVerification = async (formData: FormData) => {
  try {
    const response = await api.post('/recognition/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error processing verification');
  }
};

export const getVerificationHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/recognition/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching verification history');
  }
};

export const getAllPlates = async () => {
  try {
    const response = await api.get('/plates');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error fetching plates');
  }
};

export const registerPlate = async (plateData: any) => {
  try {
    const response = await api.post('/plates', plateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error registering plate');
  }
};

export const updatePlate = async (id: string, plateData: any) => {
  try {
    const response = await api.put(`/plates/${id}`, plateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error updating plate');
  }
};

export const deletePlate = async (id: string) => {
  try {
    const response = await api.delete(`/plates/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error deleting plate');
  }
};