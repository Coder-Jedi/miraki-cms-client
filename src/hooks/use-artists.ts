import { artistService } from '@/lib/services/artist.service';
import { useApiQuery, useApiMutation } from './use-api';
import { Artist } from '@/types';

interface ArtistQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
}

export function useArtists(params?: ArtistQueryParams) {
  return useApiQuery(['artists', params], () => artistService.getAll(params));
}

export function useArtist(id: string) {
  return useApiQuery(['artist', id], () => artistService.getById(id));
}

export function useCreateArtist() {
  return useApiMutation<Artist, Partial<Artist>>(
    (data) => artistService.create(data),
    {
      invalidateQueries: ['artists'],
    }
  );
}

export function useUpdateArtist(id: string) {
  return useApiMutation<Artist, Partial<Artist>>(
    (data) => artistService.update(id, data),
    {
      invalidateQueries: ['artists', `artist-${id}`],
    }
  );
}

export function useDeleteArtist() {
  return useApiMutation<void, string>(
    (id) => artistService.delete(id),
    {
      invalidateQueries: ['artists'],
    }
  );
}

export function useUpdateArtistSocialLinks(id: string) {
  return useApiMutation<Artist, Artist['socialLinks']>(
    (socialLinks) => artistService.updateSocialLinks(id, socialLinks),
    {
      invalidateQueries: ['artists', `artist-${id}`],
    }
  );
}

export function useUpdateArtistLocation(id: string) {
  return useApiMutation<Artist, Artist['location']>(
    (location) => artistService.updateLocation(id, location),
    {
      invalidateQueries: ['artists', `artist-${id}`],
    }
  );
}

export function usePopularArtists() {
  return useApiQuery(['artists', 'popular'], () => artistService.getPopular());
}

export function useSearchArtists(query: string) {
  return useApiQuery(
    ['artists', 'search', query],
    () => artistService.search(query),
    {
      enabled: !!query,
    }
  );
}

export function useArtistAreas() {
  return useApiQuery(['artist-areas'], () => artistService.getAreas());
}

interface UploadImageParams {
  onProgress?: (progress: number) => void;
}

export function useUploadArtistProfileImage(id: string) {
  return useApiMutation<{ url: string, key: string }, File | [File, UploadImageParams]>(
    (fileOrParams) => {
      if (Array.isArray(fileOrParams)) {
        const [file, params] = fileOrParams;
        return artistService.uploadProfileImage(id, file, params.onProgress);
      }
      return artistService.uploadProfileImage(id, fileOrParams);
    },
    {
      invalidateQueries: ['artists', `artist-${id}`],
    }
  );
}