import { collectionService } from '@/lib/services/collection.service';
import { useApiQuery, useApiMutation } from './use-api';
import { Collection } from '@/types';

export function useCollections(params?: Record<string, any>) {
  return useApiQuery(['collections', params], () => collectionService.getAll(params));
}

export function useFeaturedCollections() {
  return useApiQuery(['collections', 'featured'], () => collectionService.getFeatured());
}

export function useCollection(id: string) {
  return useApiQuery(['collection', id], () => collectionService.getById(id));
}

export function useCreateCollection() {
  return useApiMutation<Collection, Partial<Collection>>(
    (data) => collectionService.create(data),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useUpdateCollection(id: string) {
  return useApiMutation<Collection, Partial<Collection>>(
    (data) => collectionService.update(id, data),
    {
      invalidateQueries: ['collections', `collection-${id}`],
    }
  );
}

export function useDeleteCollection() {
  return useApiMutation<void, string>(
    (id) => collectionService.delete(id),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useToggleCollectionFeatured() {
  return useApiMutation<Collection, { id: string; featured: boolean }>(
    ({ id, featured }) => collectionService.toggleFeatured(id, featured),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useUpdateCollectionPriority() {
  return useApiMutation<Collection, { id: string; priority: number }>(
    ({ id, priority }) => collectionService.updatePriority(id, priority),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useAddArtworkToCollection() {
  return useApiMutation<Collection, { id: string; artworkId: string }>(
    ({ id, artworkId }) => collectionService.addArtwork(id, artworkId),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useRemoveArtworkFromCollection() {
  return useApiMutation<Collection, { id: string; artworkId: string }>(
    ({ id, artworkId }) => collectionService.removeArtwork(id, artworkId),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useReorderCollectionArtworks() {
  return useApiMutation<Collection, { id: string; artworkIds: string[] }>(
    ({ id, artworkIds }) => collectionService.reorderArtworks(id, artworkIds),
    {
      invalidateQueries: ['collections'],
    }
  );
}

export function useUploadCollectionCoverImage() {
  return useApiMutation<{ url: string }, { file: File; onProgress?: (progress: number) => void }>(
    ({ file, onProgress }) => collectionService.uploadCoverImage(file, onProgress),
  );
}