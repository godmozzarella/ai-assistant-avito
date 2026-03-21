import { http } from './http';
import type {
  Ad,
  AdListItem,
  GetAdsParams,
  ItemsResponse,
  UpdateAdPayload,
} from '../types/ad';

export const adApi = {
  async getAds(params: GetAdsParams) {
    const searchParams = new URLSearchParams();

    if (params.q) {
      searchParams.set('q', params.q);
    }

    if (params.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }

    if (params.skip !== undefined) {
      searchParams.set('skip', String(params.skip));
    }

    if (params.needsRevision) {
      searchParams.set('needsRevision', 'true');
    }

    if (params.categories?.length) {
      searchParams.set('categories', params.categories.join(','));
    }

    if (params.sortColumn) {
      searchParams.set('sortColumn', params.sortColumn);
    }

    if (params.sortDirection) {
      searchParams.set('sortDirection', params.sortDirection);
    }

    const { data } = await http.get<ItemsResponse<AdListItem>>(
      `/items?${searchParams.toString()}`
    );

    return data;
  },

  async getAdById(id: string) {
    const { data } = await http.get<Ad | { items: Ad[] }>(`/items/${id}`);

    if ('items' in data) {
      return data.items[0];
    }

    return data;
  },

  async updateAd(id: string, payload: UpdateAdPayload) {
    const { data } = await http.put(`/items/${id}`, payload);
    return data;
  },
};
