export interface GetAllServiceDto {
  id: number;
  serviceBackGround: string;
  serviceCode: string;
  serviceDescription: string;
  serviceDiscount: number;
  serviceLogo: string;
  serviceName: string;
  servicePrice: string;
  pricingType?: "FULL" | "DAILY";
  isCustom?: boolean;
  customPrice?: number;
}
