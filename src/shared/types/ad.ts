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

export type AdListItem = {
  id: string;
  category: Category;
  title: string;
  price: number;
  needsRevision: boolean;
  image?: string;
};

export type Ad = {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  needsRevision?: boolean;
  params: ItemParams;
};

export type ItemsResponse<T> = {
  items: T[];
  total: number;
};

export type ItemUpdateIn = {
  category: 'auto' | 'real_estate' | 'electronics';
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};

export type GetAdsParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
};
