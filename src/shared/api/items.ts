import { http } from './http';
import type {
  GetItemsParams,
  Item,
  ItemsResponse,
  UpdateItemInput,
} from '../types/item';

function buildGetItemsQuery(params: GetItemsParams) {
  return {
    q: params.q || undefined,
    limit: params.limit,
    skip: params.skip,
    needsRevision: params.needsRevision ? true : undefined,
    categories: params.categories?.length ? params.categories.join(',') : undefined,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
  };
}

export async function getItems(params: GetItemsParams) {
  const response = await http.get<ItemsResponse<Item>>('/items', {
    params: buildGetItemsQuery(params),
  });

  return response.data;
}

export async function getItemById(id: string) {
  const response = await http.get(`/items/${id}`);
  const data = response.data;

  if (data?.items && Array.isArray(data.items)) {
    return data.items[0] as Item;
  }

  return data as Item;
}

export async function updateItem(id: string, payload: UpdateItemInput) {
  const response = await http.put<Item>(`/items/${id}`, payload);
  return response.data;
}