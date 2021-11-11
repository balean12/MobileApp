import { IonBadge, IonButton, IonContent, IonLabel, IonHeader, IonItem, IonPage, IonTitle, IonButtons } from '@ionic/react';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { getLogger } from '../../core';
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';

const log = getLogger('Home')

const Home: React.FC = () => {
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    log('logout');
    logout?.();
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonItem>
          <IonTitle>
            Home Page
          </IonTitle>
          <IonButtons>
            <IonButton color='primary' onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonItem>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel>App state is</IonLabel>
          <IonBadge color="primary"> {JSON.stringify(appState.isActive)}</IonBadge>
        </IonItem>
        <IonItem>
          <IonLabel>Network status is</IonLabel>
          <IonBadge color="secondary"> {JSON.stringify(networkStatus.connected)}</IonBadge>
        </IonItem>
        <IonItem>
          <IonLabel>Network connection type is</IonLabel>
          <IonBadge color="secondary"> {JSON.stringify(networkStatus.connectionType)}</IonBadge>
        </IonItem>
        <Link to='/books'>
          <IonButton>See books</IonButton>
        </Link>
      </IonContent>
    </IonPage>
  );
};

export default Home;
