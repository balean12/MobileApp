import { Photo } from "../camera/usePhotoGallery";

export interface BookProps {
  _id?: string;
  title: string;
  author: string;
  releaseDate: Date;
  readStatus: boolean;
  photo: string;
}
