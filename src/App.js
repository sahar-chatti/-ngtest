import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ClientList from './ClientList';
import Login from './Login';
import AppBar from './AppBar';
import BasicTabs from './TabsClients';
import BASE_URL from './constantes';
import axios from 'axios';
import Notification from './components/notification';


const wsInvestisseur = new WebSocket('ws://localhost:8020');
const wsPartenaire = new WebSocket('ws://localhost:8080');


function App() {
  useEffect(() => {
    // Function to handle notification clicks
    const handleNotificationClick = () => {
      window.focus();
      const user = localStorage.getItem('user');
      if (user) {
        window.location.href = 'http://192.168.1.170:3100/tabClients';
      } else {
        window.location.href = 'http://192.168.1.170:3100/login';
      }
    };
  
   
    wsPartenaire.onopen = () => {
      console.log('Connected to WebSocket server for new_partenaire');
    };
  
    wsPartenaire.onmessage = (message) => {
      const notification = JSON.parse(message.data);
  
      if (notification.type === 'new_partenaire') {
        if (document.hidden) {
          if (Notification.permission === 'granted') {
            const audio = new Audio('/notification_sound.mp3');
            audio.play();
            const notif = new Notification('Nouvelle demande de partenariat', {
              body: `Nouvelle demande de partenariat de la part de "${notification.data.nom}"`,
            });
            notif.onclick = handleNotificationClick;
          }
        } else {
          alert(`Nouvelle demande de partenariat de la part de "${notification.data.nom}"`);
        }
      }
    };
  
    wsPartenaire.onclose = () => {
      console.log('Disconnected from WebSocket server for new_partenaire');
    };

    wsInvestisseur.onopen = () => {
      console.log('Connected to WebSocket server for new_investisseur');
    };
  
    wsInvestisseur.onmessage = (message) => {
      const notification = JSON.parse(message.data);
  
      if (notification.type === 'new_investisseur') {
        if (document.hidden) {
          if (Notification.permission === 'granted') {
            const audio = new Audio('/notification_sound.mp3');
            audio.play();
            const notif = new Notification('Nouvelle demande investisseur', {
              body: `Nouvelle demande investisseur de la part de "${notification.data.nom}"`,
            });
            notif.onclick = handleNotificationClick;
          }
        } else {
          alert(`Nouvelle demande investisseur de la part de "${notification.data.nom}"`);
        }
      }
    };
  
    wsInvestisseur.onclose = () => {
      console.log('Disconnected from WebSocket server for new_investisseur');
    };
  
    return () => {
      wsPartenaire.close();
      wsInvestisseur.close();
    };
  }, []);
  
  // const [notifications, setNotifications] = useState([]);
  // const handleNotificationClick = (type) => {
  //   window.focus();
  //   const user = localStorage.getItem('user');
  //   if (user) {
  //     window.location.href = type === 'partenaire' 
  //       ? 'http://192.168.1.170:3250/tabClients' 
  //       : 'http://192.168.1.170:3250/tabClients'; 
  //   } else {
  //     window.location.href = 'http://192.168.1.170:3250/login';
  //   }
  // };

  // useEffect(() => {
 
    
  //   const checkNewEntries = async () => {
  //     try {
  //       const partenaireResponse = await axios.get(`${BASE_URL}/api/getNewpart`);
  //       const investisseurResponse = await axios.get(`${BASE_URL}/api/getNewInv`);

  //       if (partenaireResponse.data.length > 0) {
  //         partenaireResponse.data.forEach((row) => {
  //           setNotifications((prev) => [...prev, {
  //             type: 'partenaire',
  //             message: `Nouvelle demande de partenariat de la part de "${row.NOM_PRENOM}"`,
  //             id: row.ID_PARTENAIRE,
  //           }]);

  //           axios.put(`${BASE_URL}/api/updateNewPart/${row.ID_PARTENAIRE}`);
  //         });
  //       }

  //       if (investisseurResponse.data.length > 0) {
  //         investisseurResponse.data.forEach((row) => {
  //           setNotifications((prev) => [...prev, {
  //             type: 'investisseur',
  //             message: `Nouvelle demande investisseur de la part de "${row.NOM_PRENOM}"`,
  //             id: row.ID_INVESTISSEUR,
  //           }]);

           
  //           axios.put(`${BASE_URL}/api/updateNewInv/${row.ID_INVESTISSEUR}`);
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error fetching new entries:', error);
  //     }
  //   };

  
  //   const intervalId = setInterval(checkNewEntries, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/appBar" element={<AppBar />} />
          <Route path="/" element={<Login />} />
          <Route path="/tabClients" element={<BasicTabs />} />
        </Routes>
      </Router>
      
    </Provider>
  );
}

export default App;