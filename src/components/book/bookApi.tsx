import axios from 'axios';
import { authConfig, getLogger, withLogs } from '../../core';
import { BookProps } from './BookProps';

const baseUrl = 'localhost:3000';
const bookUrl = `http://${baseUrl}/api/book`;

export const getBooks: (token: string) => Promise<BookProps[]> = token => {
  return withLogs(axios.get(bookUrl, authConfig(token)), 'getBooks');
}

export const createBook: (token: string, book: BookProps) => Promise<BookProps[]> = (token, book) => {
  return withLogs(axios.post(bookUrl, book, authConfig(token)), 'createBook');
}

export const updateBook: (token: string, book: BookProps) => Promise<BookProps[]> = (token, book) => {
  return withLogs(axios.put(`${bookUrl}/${book._id}`, book, authConfig(token)), 'updateBook');
}

export const filterBooks: (token: string, readFilter: string | undefined) => Promise<BookProps[]> = (token, readFilter) => {
  console.log("API filter", readFilter);
  return withLogs(axios.get(`${bookUrl}/${readFilter}`, authConfig(token)), 'filterBooks');
}

export const getPartOfBooks: (token: string, index: number, limit: number) => Promise<BookProps[]> = (token, index, limit) => {
  return withLogs(axios.get(`${bookUrl}/${index}/${limit}`, authConfig(token)), 'getPartOfBooks');
}

interface MessageData {
  event: string;
  payload: BookProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
