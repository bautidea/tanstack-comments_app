import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../main';
import { getComments, createComment } from '../services/comments';
import { Comments, CommentsNoId } from '../types';

export function useComments() {
  const { data, isLoading, isError } = useQuery<Comments[]>({
    queryKey: ['comments'],
    queryFn: getComments,
    refetchOnWindowFocus: false,
  });

  const commentMutation = useMutation({
    mutationFn: (newComment: CommentsNoId) => createComment(newComment),
    onMutate: (newData) => {
      queryClient.cancelQueries({ queryKey: ['comments'] });

      const previousComments = queryClient.getQueriesData({
        queryKey: ['comments'],
      });

      queryClient.setQueryData(['comments'], (oldData: Comments[]) => {
        const newDataClone = structuredClone(newData);
        newDataClone.sending = true;

        return oldData ? [...oldData, newDataClone] : newDataClone;
      });

      return { previousComments };
    },
    onError: (error, variables, context) => {
      console.error('Error when sending comment.', error);

      queryClient.setQueryData(['comments'], context?.previousComments);
    },
    onSettled: async () => {
      // Performing re fetching after everything ok.
      await queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    commentMutation,
  };
}
