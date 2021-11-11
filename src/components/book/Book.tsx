import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { BookProps } from './BookProps';

interface BookPropsExt extends BookProps {
  onEdit: (_id?: string) => void;
}

const Book: React.FC<BookPropsExt> = ({ _id, title, author, releaseDate, readStatus, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>{title}, {author}, {releaseDate.toString().substring(0,10)}, {readStatus ? 'Complete' : 'Incomplete'}</IonLabel>
    </IonItem>
  );
};

export default Book;
