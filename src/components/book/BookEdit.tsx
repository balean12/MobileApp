import React, { useContext, useEffect, useState } from 'react';
import { makeAutoObservable, runInAction, toJS } from "mobx";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonToggle,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
  IonActionSheet
} from '@ionic/react';
import { getLogger } from '../../core';
import { BookContext } from './BookProvider';
import { RouteComponentProps } from 'react-router';
import { BookProps } from './BookProps';
import { Photo, usePhotoGallery } from '../camera/usePhotoGallery';
import { camera, exit, trash } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/core';

const log = getLogger('BookEdit');

interface BookEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const BookEdit: React.FC<BookEditProps> = ({ history, match }) => {
  const { items: books, saving, savingError, saveItem: saveBook } = useContext(BookContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [readStatus, setReadStatus] = useState(false);
  const [photo, setPhoto] = useState('');
  const [book, setBook] = useState<BookProps>();
  const { photos, takePhoto } = usePhotoGallery();

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id;
    console.log(routeId);
    console.log(books)
    const book = books?.find(book => book._id?.toString() === routeId);
    setBook(book);
    
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setReleaseDate(book.releaseDate.toString());
      setReadStatus(book.readStatus);
      setPhoto(book.photo);
    }
  }, [match.params.id, books]);

  const handleSave = () => {
    const editedBook = book ? { ...book, title, author, releaseDate: new Date(releaseDate), readStatus, photo} 
      : { title: title, author: author, releaseDate: new Date(releaseDate), readStatus: readStatus, photo: photo };
    saveBook && saveBook(editedBook).then(() => history.goBack());
    console.log(editedBook);
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>Title:</IonLabel>
          <IonInput value={title} placeholder="Insert title" onIonChange={e => setTitle(e.detail.value || '')} /> 
        </IonItem>
        <IonItem>
          <IonLabel>Author:</IonLabel>
          <IonInput value={author} placeholder="Insert Author" onIonChange={e => setAuthor(e.detail.value || '')} /> 
        </IonItem>
        <IonItem>
          <IonLabel>Release Date: </IonLabel>
          <IonDatetime displayFormat="MM DD YYYY" placeholder="Select Date" value={releaseDate} onIonChange={e => setReleaseDate(e.detail.value || '')} /> 
        </IonItem>
        <IonItem>
          <IonLabel>Read Status:</IonLabel>
          <IonToggle placeholder="Read status:" checked={readStatus} onIonChange={e => {console.log(e.detail.checked); setReadStatus(e.detail.checked)}} />
        </IonItem>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
        {photo && <IonImg src={photo}/>}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={async () => {
            const image = await takePhoto();
            setPhoto(image);
            }}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BookEdit;
