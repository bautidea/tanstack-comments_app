import { Comments, CommentsNoId } from '../types';

const binId = import.meta.env.VITE_BIN_ID;
const xMasterKey = import.meta.env.VITE_X_MASTER_KEY;
const fetchLink = `https://api.jsonbin.io/v3/b/${binId}`;

export async function getComments() {
  const response = await fetch(`${fetchLink}/latest`, {
    method: 'GET',
    headers: {
      'X-Bin-Meta': 'false',
      'Content-Type': 'application/json',
      'X-Master-Key': xMasterKey,
    },
  });

  if (!response.ok) throw new Error('Error when fetching data');

  const data = await response.json();

  return data;
}

export async function createComment(commentToAdd: CommentsNoId) {
  const commentsData: Comments[] = await getComments();

  const newId =
    commentsData.reduce(
      (nextValue, currentValue) =>
        currentValue.id > nextValue ? currentValue.id : nextValue,
      0
    ) + 1;

  const newComment: Comments = {
    ...commentToAdd,
    id: newId,
  };

  const commentsToPut = [...commentsData, newComment];

  const response = await fetch(fetchLink, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': xMasterKey,
    },
    body: JSON.stringify(commentsToPut),
  });

  if (!response.ok) throw new Error('Error when adding new comment');

  return newComment;
}
