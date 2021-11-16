import { IonButton, IonHeader, IonItem, IonPage, IonTitle, IonButtons, createAnimation } from '@ionic/react';
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { getLogger } from '../../core';
import { MyModal } from '../animation/NetworkModal';

const log = getLogger('Home')

const Home: React.FC = () => {
 
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    log('logout');
    logout?.();
  }

  useEffect(animateButton, []);
  
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
      <Link to='/books'>
          <IonButton style={{display: 'flex'}} className="see-books-button">See books</IonButton>
      </Link>
      <MyModal />
    </IonPage>
  );

  function animateButton() {
    const el = document.querySelector('.see-books-button');
    if (el) {
      const animation = createAnimation()
        .addElement(el)
        .duration(1000)
        .direction('alternate')
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'scale(1.0)', opacity: '1' },
          {
            offset: 1, transform: 'scale(0.9)', opacity: '0.7'
          }
        ]);
      animation.play();
    }
  }
};

export default Home;
