export type Category = 'auto' | 'real_estate' | 'electronics';

export type SortColumn = 'title' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type ItemParams =
  | AutoItemParams
  | RealEstateItemParams
  | ElectronicsItemParams;

export interface Item {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  imageUrl?: string | null;
  params: ItemParams;
  needsRevision?: boolean;
}

export interface ItemsResponse<T> {
  items: T[];
  total: number;
}

export interface GetItemsParams {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
}

export interface UpdateItemInput {
  category: Category;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
}