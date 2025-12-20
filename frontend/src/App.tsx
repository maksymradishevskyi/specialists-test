import {
  IonApp,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  calendarOutline,
  chatbubbleEllipsesOutline,
  listOutline,
  personCircleOutline
} from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import SpecialistsPage from './features/specialists/SpecialistsPage';
import './App.css';

type PlaceholderProps = {
  title: string;
  subtitle?: string;
};

const PlaceholderPage = ({ title, subtitle }: PlaceholderProps) => (
  <IonPage>
    <IonContent fullscreen>
      <div className="placeholder-card">
        <h2>{title}</h2>
        <p>{subtitle ?? 'Coming soon.'}</p>
      </div>
    </IonContent>
  </IonPage>
);

const Tabs = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/tabs/specialists" component={SpecialistsPage} exact />
      <Route
        path="/tabs/schedule"
        exact
        render={() => <PlaceholderPage title="Schedule" subtitle="Booking is coming soon." />}
      />
      <Route
        path="/tabs/chat"
        exact
        render={() => <PlaceholderPage title="Messages" subtitle="Chat will be available soon." />}
      />
      <Route
        path="/tabs/profile"
        exact
        render={() => <PlaceholderPage title="Profile" subtitle="Profile is coming soon." />}
      />
      <Redirect exact from="/tabs" to="/tabs/specialists" />
    </IonRouterOutlet>

    <IonTabBar slot="bottom" className="bottom-tabbar">
      <IonTabButton tab="schedule" href="/tabs/schedule">
        <IonIcon icon={calendarOutline} />
        <IonLabel>Schedule</IonLabel>
      </IonTabButton>
      <IonTabButton tab="list" href="/tabs/specialists">
        <IonIcon icon={listOutline} />
        <IonLabel>List</IonLabel>
      </IonTabButton>
      <IonTabButton tab="chat" href="/tabs/chat">
        <IonIcon icon={chatbubbleEllipsesOutline} />
        <IonLabel>Chat</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/tabs/profile">
        <IonIcon icon={personCircleOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

function App() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      document.body.classList.add('native-platform');
    } else {
      document.body.classList.remove('native-platform');
    }
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/tabs" component={Tabs} />
          <Redirect exact from="/" to="/tabs/specialists" />
          <Route render={() => <Redirect to="/tabs/specialists" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
