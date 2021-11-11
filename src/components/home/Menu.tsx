import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { bookOutline } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { PrivateRoute } from '../../auth'
import { BookEdit, BookList } from '../book'
import { BookProvider } from '../book/BookProvider'
import Home from './Home'

const Menu: React.FC<RouteComponentProps> = ({ history }) => {
  return (
      <IonTabs>
        <IonRouterOutlet>
        <BookProvider>
            <PrivateRoute path="/books" component={BookList} exact={true} />
            <PrivateRoute path="/book" component={BookEdit} exact={true} />
            <PrivateRoute path="/book/:id" component={BookEdit} exact={true} />
          </BookProvider>
          <Route exact path="/" render={() => <Redirect to="/books" />} />
        </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton 
              tab="books" 
              onClick={
              () => history.push('/books')
              }>
              <IonIcon icon={bookOutline} />
              <IonLabel>My Books</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Home" href='/state'>
              <IonIcon icon={bookOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          </IonTabBar>
      </IonTabs>
)
}

export default Menu
