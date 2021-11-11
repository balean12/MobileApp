import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonCard,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList, IonLoading,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add, book } from 'ionicons/icons';
import Book from './Book';
import { getLogger } from '../../core';
import { BookContext } from './BookProvider';
import { Link } from 'react-router-dom';

const log = getLogger('BookList');

const BookList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items: books, fetching, fetchingError, fetchMore, disableInfiniteScroll,
          bookNameSearch, setBookNameSearch, readFilter, setReadFilter } = useContext(BookContext);
  log('render');

  async function searchNext($event: CustomEvent<void>) {
    log("fetch more");
    fetchMore && fetchMore();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonItem> 
          <IonToolbar>
            <IonTitle>Pocket Books</IonTitle>
          </IonToolbar>
          
          <Link to='/state'> 
            <IonButton>Go Back</IonButton>
          </Link>
        </IonItem>
      </IonHeader>
      
      <IonContent>
        <IonSearchbar 
          value={bookNameSearch}
          debounce={1000}
          onIonChange={(e) => setBookNameSearch && setBookNameSearch(e.detail.value!)} 
        />
      <IonItem>        
        <IonLabel>Read status: </IonLabel>
        <IonSelect 
          value={readFilter} 
          placeholder="Select if read or not"
          onIonChange={(e) => setReadFilter && setReadFilter(e.detail.value)} >
            <IonSelectOption key="read" value="read"> Read </IonSelectOption>
            <IonSelectOption key="notread" value="nonread"> Not Read </IonSelectOption>
        </IonSelect>
      
      </IonItem>

        <IonLoading isOpen={fetching} message="Fetching books" />

        {books && 
          books
            .filter(bookNameSearch && bookNameSearch !== ""
                ? (book) => book.title.indexOf(bookNameSearch) >= 0
                : (book) => book)
            .map(
              ({_id,
                author,
                title,
                releaseDate,
                readStatus}
                ) => {
                  return <IonList key={`${_id}`} >
                    <Book key={_id} _id={_id} author={author} title={title} releaseDate={releaseDate} readStatus={readStatus}
                        onEdit={_id => {
                          history.push(`/book/${_id}`)
                        }} /> 
                        </IonList>
                })
        }

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch books'}</div>
        )}

       <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more books...">
                    </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/book')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BookList;
