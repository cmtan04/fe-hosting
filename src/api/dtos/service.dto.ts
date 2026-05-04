export interface GetAllServiceDto {
  id: number;
  code?: string;
  name?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  serviceCode: string;
  serviceDescription: string;
  serviceName: string;
  serviceBackGround?: string;
  serviceDiscount?: number;
  serviceLogo?: string;
  servicePrice?: string | number;
  isFree?: boolean;
  basePrice?: number;
  unit?: string;
  quantity?: number;
}
