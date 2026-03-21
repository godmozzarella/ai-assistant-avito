import { useQuery } from '@tanstack/react-query';
import { getItems } from '../../shared/api/items';
import type { GetItemsParams, ItemsResponse, Item } from '../../shared/types/item';

export function useAds(params: GetItemsParams) {
  return useQuery<ItemsResponse<Item>>({
    queryKey: ['ads', params],
    queryFn: () => getItems(params),
  });
}