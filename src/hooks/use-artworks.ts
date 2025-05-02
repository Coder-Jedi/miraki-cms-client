import { artworkService } from '@/lib/services/artwork.service';
import { useApiQuery, useApiMutation } from './use-api';
import { Artwork, UpdateArtworkDto } from '@/types';

export function useArtworks(params?: Record<string, any>) {
  return useApiQuery(['artworks', params], () => artworkService.getAll(params));
}

export function useArtwork(id: string) {
  return useApiQuery(['artwork', id], () => artworkService.getById(id));
}

export function useCreateArtwork() {
  return useApiMutation<Artwork, Partial<Artwork>>(
    (data) => artworkService.create(data),
    {
      invalidateQueries: ['artworks'],
    }
  );
}

export function useUpdateArtwork(id: string) {
  return useApiMutation<Artwork, { id: string; data: Partial<UpdateArtworkDto> }>(
    ({ id, data }) => artworkService.update(id, data),
    {
      invalidateQueries: ['artworks', `artwork-${id}`],
    }
  );
}

export function useDeleteArtwork() {
  return useApiMutation<void, string>(
    (id) => artworkService.delete(id),
    {
      invalidateQueries: ['artworks'],
    }
  );
}

export function useToggleArtworkFeatured() {
  return useApiMutation<Artwork, { id: string; featured: boolean }>(
    ({ id, featured }) => artworkService.toggleFeatured(id, featured),
    {
      invalidateQueries: ['artworks'],
    }
  );
}

export function useArtworksByCategory(category: string) {
  return useApiQuery(
    ['artworks', 'category', category],
    () => artworkService.getByCategory(category)
  );
}

export function useArtworksByArtist(artistId: string) {
  return useApiQuery(
    ['artworks', 'artist', artistId],
    () => artworkService.getByArtist(artistId)
  );
}

export function useSearchArtworks(query: string) {
  return useApiQuery(
    ['artworks', 'search', query],
    () => artworkService.search(query),
    {
      enabled: !!query,
    }
  );
}

export function useArtworkCategories() {
  return useApiQuery(['artwork-categories'], () => artworkService.getCategories());
}

export function useArtworkAreas() {
  return useApiQuery(['artwork-areas'], () => artworkService.getAreas());
}

export function useUploadArtworkImage() {
  return useApiMutation<{ url: string; key: string }, { file: File; onProgress?: (progress: number) => void }>(
    ({ file, onProgress }) => artworkService.uploadImage(file, onProgress)
  );
}