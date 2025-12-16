import { ApiMessage, Pagination } from "./api-types";
import { Description, DescriptionApiModel, Media, MediaApiModel } from "./product-types";

export type Ad = {
  id: number;
  productId: number;
  sectionId: number;
  position: number;
  descriptions?: Description[];
  media?: Media[];
};

export type AdApiModel = {
    id: number
    product_id: number
    section_id: number
    position: number
    descriptions: DescriptionApiModel[]
    media: MediaApiModel[]
}

export interface AdApiResponse {
    featured_products: AdApiModel[]
    pagination: Pagination
    message: ApiMessage
}