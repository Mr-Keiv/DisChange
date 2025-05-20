export interface ApiStatus {
  estado: string;
  aleatorio: number;
}

export interface ExchangeRate {
  fuente: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}

export interface PaymentValidation {
  cedula: string;
  monto: number;
  telefono?: string;
  banco?: string;
}