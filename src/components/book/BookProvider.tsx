import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../core';
import { BookProps } from './BookProps';
import { createBook, filterBooks, getBooks, getPartOfBooks, newWebSocket, updateBook } from './bookApi';
import { AuthContext } from '../../auth';

const log = getLogger('BookProvider');

type SaveBookFn = (book: BookProps) => Promise<any>;

export interface ItemsState {
  items?: BookProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveBookFn,
  index?: number,
  count?: number,
  disableInfiniteScroll?: boolean,
  fetchMore?: Function,
  bookNameSearch?: string,
  setBookNameSearch?: Function,
  readFilter?: string,
  setReadFilter?: Function,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
  index: 0,
  count: 5,
};

const FETCH_BOOKS_STARTED = 'FETCH_BOOKS_STARTED';
const FETCH_BOOKS_SUCCEEDED = 'FETCH_BOOKS_SUCCEEDED';
const FETCH_BOOKS_FAILED = 'FETCH_BOOKS_FAILED';
const SAVE_BOOKS_STARTED = 'SAVE_BOOK_STARTED';
const SAVE_BOOK_SUCCEEDED = 'SAVE_BOOK_SUCCEEDED';
const SAVE_BOOK_FAILED = 'SAVE_BOOK_FAILED';
const FETCH_NEXT = 'FETCH_NEXT';
const SET_INFINITE_SCROLL = 'SET_INFINITE_SCROLL';
const SET_NAME_SEARCH = 'SET_NAME_SEARCH';
const SET_READ_FILTER = 'SET_READ_FILTER';
const FILTER_BOOKS_STARTED = 'FILTER_BOOKS_STARTED';
const FILTER_BOOKS_SUCCEEDED = 'FILTER_BOOKS_SUCCEEDED';
const FILTER_BOOKS_FAILED = 'FILTER_BOOKS_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_BOOKS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_BOOKS_SUCCEEDED:
        if(payload.pagination){
          return {...state, items: state.items ? [...state.items, ...payload.books]: payload.books, fetching: false};
        }
        return { ...state, items: payload.books, fetching: false };
      case FETCH_BOOKS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_BOOKS_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_BOOK_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it._id === item._id);
        if (index === -1) {
          items.splice(0, 0, item);
        } else {
          items[index] = item;
        }
        return { ...state, items, saving: false };
      case SAVE_BOOK_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      case FETCH_NEXT:
          log(state.index);
          return {...state, index: state.index !== undefined && state.count !== undefined ? state.index+ state.count : undefined};
      case SET_INFINITE_SCROLL:
          return {...state, disableInfiniteScroll: payload.disable};
      case SET_NAME_SEARCH:
          return {...state, bookNameSearch: payload.bookName}
      case SET_READ_FILTER:
          return {...state, items: [], index:0, readFilter: payload.read}
      case FILTER_BOOKS_STARTED:
          return {...state, fetching: true, fetchingError:null};
      case FILTER_BOOKS_SUCCEEDED:
          return {...state, items: payload.books, fetching: false};
      case FILTER_BOOKS_FAILED:
          return {...state, fetchingError: payload.error, fetching: false};
      default:
        return state;
    }
  };

export const BookContext = React.createContext<ItemsState>(initialState);

interface BookProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items: books, fetching, fetchingError, saving, savingError, index, count, disableInfiniteScroll,
        bookNameSearch, readFilter} = state;
  useEffect(getItemsEffect, [token, index, count]);
  useEffect(filterBooksEffect, [token, readFilter]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveBookFn>(saveItemCallback, [token]);
  const value = { items: books, fetching, fetchingError, saving, savingError, saveItem, fetchMore, 
    disableInfiniteScroll, bookNameSearch, setBookNameSearch, readFilter, setReadFilter };
  log('returns');
  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );

  function fetchMore() {
    dispatch({type: FETCH_NEXT});
  }

  function setBookNameSearch(bookName: string){
    dispatch({type: SET_NAME_SEARCH, payload: {bookName}});
  }

  function setReadFilter(read: string){
    dispatch({type: SET_READ_FILTER, payload: {read}});
  }

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      if(!token?.trim()) {
        return;
      }
      let books;
      try {
        log('fetchItems started');
        dispatch({ type: FETCH_BOOKS_STARTED });
        log(index, count);
        if(index !== undefined && count !== undefined){
          books = await getPartOfBooks(token, index, count);
          log('fetchItems succeeded');
        
          if (!canceled) {
            dispatch({ type: FETCH_BOOKS_SUCCEEDED, payload: { books, pagination: true } });
            if(books.length < count) {
              dispatch({type: SET_INFINITE_SCROLL, payload: {disable: true}});
            }
          }
        }
        else {
          books = await getBooks(token);
          log('fetchBooks succeeded');
          if(!canceled){
            dispatch({type: FETCH_BOOKS_SUCCEEDED, payload: {books}});
          }
        }
      } catch (error) {
        log('fetchItems failed');
        dispatch({ type: FETCH_BOOKS_FAILED, payload: { error } });
      }
    }
  }

  function filterBooksEffect() {
    let canceled = false;
    getFilteredBooks();
    return () => {
        canceled = true;
    }

    async function getFilteredBooks() {
        if(!token?.trim())
        {
            return;
        }
        try{
            log('filterBooks started');
            dispatch({type: FILTER_BOOKS_STARTED});
            const books = await filterBooks(token, readFilter);
            log('filterBooks succeeded');
            if(!canceled) {
                dispatch({type: FILTER_BOOKS_SUCCEEDED, payload: {books}});
            }
        } catch(error) {
            log('filterBooks failed');
            dispatch({ type: FILTER_BOOKS_FAILED, payload: {error} });
        }
    }
}

  async function saveItemCallback(item: BookProps) {
    try {
      log('saveItem started');
      dispatch({ type: SAVE_BOOKS_STARTED });
      const savedItem = await (item._id ? updateBook(token, item) : createBook(token, item));
      log('saveItem succeeded');
      dispatch({ type: SAVE_BOOK_SUCCEEDED, payload: { item: savedItem } });
    } catch (error) {
      log('saveItem failed');
      dispatch({ type: SAVE_BOOK_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    // log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
        closeWebSocket = newWebSocket(token, message => {
            if (canceled) {
                return;
            }
            const { event, payload: book } = message;
            // log(`ws message, item ${type}`);
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_BOOK_SUCCEEDED, payload: { book } });
            }
        });
    }
    return () => {
        // log('wsEffect - disconnecting');
        canceled = true;
        closeWebSocket?.();
    }
}
};
