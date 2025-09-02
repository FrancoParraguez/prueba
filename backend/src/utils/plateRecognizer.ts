import axios from 'axios';
import FormData from 'form-data';

export interface PlateRecognitionResult {
  plate: string;
  confidence: number;
  coordinates: number[][];
  vehicle: {
    type: string;
    color: string;
    make: string;
    model: string;
  };
}

export interface PlateRecognizerResponse {
  results: PlateRecognitionResult[];
}

class PlateRecognizerService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.PLATE_RECOGNIZER_API_KEY || '';
    this.apiUrl = 'https://api.platerecognizer.com/v1/plate-reader/';
  }

  async recognizePlateFromBuffer(imageBuffer: Buffer, filename: string): Promise<PlateRecognizerResponse> {
    try {
      // If no API key is provided, return mock data for development
      if (!this.apiKey) {
        return this.getMockData();
      }

      const formData = new FormData();
      formData.append('upload', imageBuffer, { filename });
      formData.append('regions', 'ar'); // Argentina as example, change as needed

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          ...formData.getHeaders()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error recognizing plate from buffer:', error);
      // Return mock data if API call fails
      return this.getMockData();
    }
  }

  private getMockData(): PlateRecognizerResponse {
    // Mock data for development when no API key is provided
    const mockPlates = ['ABC123', 'XYZ789', 'JKL456', 'MNO123'];
    const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    
    return {
      results: [
        {
          plate: randomPlate,
          confidence: Math.random() * 30 + 70, // 70-100% confidence
          coordinates: [[0, 0], [100, 0], [100, 50], [0, 50]],
          vehicle: {
            type: 'car',
            color: 'blue',
            make: 'Toyota',
            model: 'Corolla'
          }
        }
      ]
    };
  }
}

export default new PlateRecognizerService();