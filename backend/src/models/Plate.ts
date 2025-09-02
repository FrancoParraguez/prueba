export interface IPlate {
  id?: number;
  plate_number: string;
  owner: string;
  vehicle_type: 'car' | 'motorcycle' | 'truck' | 'bus';
  vehicle_model: string;
  color: string;
  is_active: boolean;
  registered_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class Plate {
  static async findAll(): Promise<IPlate[]> {
    // Implementación para obtener todas las placas
    return [];
  }

  static async findByPlateNumber(plateNumber: string): Promise<IPlate | null> {
    // Implementación para buscar por número de placa
    return null;
  }

  static async create(plateData: Omit<IPlate, 'id'>): Promise<IPlate> {
    // Implementación para crear placa
    return plateData as IPlate;
  }
}