export interface IPost {
  id?: number;
  title: string;
  body: string;
  isPublished: boolean;
  createdAt?: Date;
}

export interface IPostId {
  id: number;
}
