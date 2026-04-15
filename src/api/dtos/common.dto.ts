export interface UploadImageResponseDto {
  message: string;
  imageUrl: string;
}

export interface ChatAndCommentDto {
  content: string;
  ratevalue?: number;
  metaData: MetaDataDto[];
}

export interface MetaDataDto {
  id: number;
  url: string;
}
