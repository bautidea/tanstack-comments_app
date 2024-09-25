export interface CommentsNoId {
  title: string;
  comment: string;
  sending?: boolean;
}
export interface Comments extends CommentsNoId {
  id: number;
}
