import React, { useState } from 'react';
import { createAnimation, IonModal, IonButton, IonContent, IonItem, IonLabel, IonBadge } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useAppState } from '../home/useAppState';
import { useNetwork } from '../home/useNetwork';

export const MyModal: React.FC = ({content}: any) => {
  const [showModal, setShowModal] = useState(false);

  const enterAnimation = (baseEl: any) => {
    const backdropAnimation = createAnimation()
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }

  const leaveAnimation = (baseEl: any) => {
    return enterAnimation(baseEl).direction('reverse');
  }
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  return (
    <>
      <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
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
      </IonContent>
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton>
    </>
  );
};
