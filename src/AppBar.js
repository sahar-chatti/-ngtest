import * as React from 'react';
import { useState ,useEffect,useRef} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import AssuredWorkloadRoundedIcon from '@mui/icons-material/AssuredWorkloadRounded';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import EmailIcon from '@mui/icons-material/Email';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CallIcon from '@mui/icons-material/Call';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TabsClients from './TabsClients';
import MailingClients from './MailingClients';
import ListRaison from './ListRaison';
import ListQualificationAppel from './ListQualificationAppel';
import ListStatutPart from './ListStatutPart';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CampaignIcon from '@mui/icons-material/Campaign';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/Inbox';
import email from './icons/emailicon.jpg';
import Tooltip from '@mui/material/Tooltip';
import ClientsIcon from './icons/profile.png';
import planningIcon from './icons/planning.png'
import tasksIcon from './icons/task.png'
import administrationIcon from './icons/system-administrator.png'
import settings from './icons/settings.png'
import schedule from './icons/schedule.png'
import marketing from './icons/video.png'
import UserManagement from './UserManagement';
import { useSelector } from 'react-redux';
import BusinessIcon from '@mui/icons-material/Business';
import userIcon from './icons/userIcon.png'
import clientList from './icons/lis.png'
import callSettings from './icons/callsetting.png'
import userSettings from './icons/userSettings.png'
import RaisonStatuts from './StatRaisonParam';
import RaisonQualifications from './QualifRaisonParam';
import callsIcon from './icons/customer-service.png'
import CallsJournal from './CallsJournal';
import settingsIcon from './icons/parametrage.png'
import ManagementComponent from './ParametresBase';
import achatIcon from './icons/achat.png'
import DemAchat from './DemandeAchat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import BASE_URL from './constantes';
import { Badge, Popover ,Avatar, Button} from '@mui/material';
import CardPartenaire from './CardPartenaires';
import CardInvestisseur from './CardInvestisseurs';
import cmdIcon from './icons/cmd.png'
import personIcon from './icons/per.png'
import { BorderColor, Margin } from '@mui/icons-material';
//import { makeStyles } from '@mui/styles';
const drawerWidth = 340;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      marginLeft: `calc(${theme.spacing(8)} + 1px)`,
    },
    width: `calc(100% - ${theme.spacing(7)} - 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${theme.spacing(8)} - 1px)`,
    },
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width:!open? 100:drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      position: 'relative',
      width: !open?100: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
      '&:hover': {
        width: drawerWidth,
      },
      ...(open && {
        ...openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
      }),
    },
  }),
);

const categories = [
  {
    name: 'Contact',
    items: ['Liste des clients'],
    icon:<ContactsIcon/>,
  },
  // {
  //   name: 'Planning collaborateurs',
  //   icon: <img src={planningIcon} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  // },
  // {
  //   name: 'Tâches effectuées',
  //   icon: <img src={tasksIcon} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  // },
  {
    name: 'Administration',
    items: ['Gestion des utilisateurs', 'Gestion des menus'],
    icon: <img  alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  },
  {
    name: 'Paramétrage',
    items: ['Gestion des statuts partenaires', 'Gestion des qualifications appels', 'Gestion des raisons appels'],
    icon: <img src={settings} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  },
  // {
  //   name: 'Planification des collaborateurs',
  //   icon: <img src={schedule} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  // },
  // {
  //   name: 'Marketing',
  //   items: ['Mailing', "L'envoi SMS"],
  //   icon: <img src={marketing} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  // },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = useState(-1);
  const [openCategory, setOpenCategory] = React.useState(null);
  const user = useSelector((state) => state.user);
  const[index,setIndex]=useState('')
  const[searchTerm,setSearchTerm]=useState('')
  const [selectedOption,setSelectedOption]=useState('0')
  const [value,setValue]=useState(0)

console.log("user",user)

const handleDrawerOpen = () => {
  setOpen(true);
}; 
const handleDrawerClose = () => {
  setOpen(false);
};

//ouvrir les notificaion
const handleCategoryClick = (category) => {
  if (openCategory === category) {
    setOpenCategory(null); // Close the category if already open
    setSelectedTab(-1); // Reset selected tab
  } else {
    setOpenCategory(category); // Open the clicked category
    setSelectedTab(-1); // Reset selected tab
  }
};


const handleTabClick = (index) => {
  setSelectedTab(index);
};
const [notifications, setNotifications] = useState([]);
const [anchorEl, setAnchorEl] = useState(null);

 // Fonction pour trier les notifications par date (du plus récent au plus ancien)
const sortedNotifications = [...notifications].sort((a, b) => b.ID - a.ID);


//evenement de survol pour le boutton
const [isHovered, setIsHovered] = useState(false);

const handleMouseEnter = () => {
  setIsHovered(true);
};

const handleMouseLeave = () => {
  setIsHovered(false);
};

const handleNotificationClick = async (notification) => {
  const { TYPE, MESSAGE, ID } = notification;

  let term = '';
  
  if (['cmdpartenaire', 'cmdfdm', 'cmdcspd', 'cmdinvestisseur'].includes(TYPE)) {
   
    const match = MESSAGE.match(/Num:\s*'([^']+)'/);
    if (match) {
      term = match[1];
    }
    setSelectedOption('2')
    if(TYPE==='cmdpartenaire'){
      setValue(0)
    }
    if(TYPE==='cmdinvestisseur'){
      setValue(1)
    }
    if(TYPE==='cmdcspd'){
      setValue(2)
    }
    if(TYPE==='cmdfdm'){
      setValue(3)
    }
  } else if (TYPE === 'investisseur' || TYPE === 'partenaire') {

    term = MESSAGE.split(' de la part de ')[1].replace(/'/g, "");
    setSelectedOption('0')
  }
  
  console.log("term", term);
  setSearchTerm(term);
  setOpenCategory('Contact');
  setSelectedTab(0);

 
  setNotifications((prev) => prev.filter((notif) => notif.ID !== ID));

  try {
   
    await axios.post(`${BASE_URL}/api/createNotifUser`, {
      userLogin: user.LOGIN,
      id: ID
    });
  } catch (error) {
    console.error('Error creating notification user:', error);
  }

 
  setAnchorEl(null);
};


// Fonction pour marquer toutes les notifications comme lues et les retirer de l'affichage
const handleClearAllNotifications = async () => {
  // Boucle sur toutes les notifications pour les marquer comme lues
  for (const notification of notifications) {
    try {
      await axios.post(`${BASE_URL}/api/createNotifUser`, {
        userLogin: user.LOGIN,
        id: notification.ID
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Vider les notifications de l'état pour les retirer du popover                         
  setNotifications([]);
  
  // Fermer le Popover si besoin
  setAnchorEl(null);
};

const handleBellClick = (event) => {
  setAnchorEl(event.currentTarget);
}; 

const clearButtonStyle = {
  fontWeight: 'bold',
  borderRaduis:'20px',
  textAlign: 'end',
  color: 'red',
  backgroundColor: '#3FA2F6',
  BorderColor:'blue',
  width: '100%' ,
  Margin:'15px',
  marginTop:'-10px',
  transition: 'background-color 0.3s ease',
  fontSize: '13px' // Transition pour un effet plus doux
};


const clearButtonHoverStyle = {
  backgroundColor: '#D1E9F6',
  color:'gray' // Couleur de fond au survol
};
const handleClose = () => {
  setAnchorEl(null);
};
const prevNotificationLength = useRef(0);

  const playNotificationSound = () => {
    const audio = new Audio('/notification_sound.mp3');
    audio.play();
  };
  const renderNotificationHeader = () => {
    if (notifications.length === 0) {
      return (
        <Typography variant="body1" style={{ textAlign: 'center', margin: '10px 0', color: '#555', width:'350px' }}>
          Il n'existe aucune notification pour vous à l'instant !
        </Typography>
      );
    } else {
      return (
        <Button
         
        variant="body1"
        style={{
          ...clearButtonStyle,
          ...(isHovered && clearButtonHoverStyle),
        }}
          onClick={handleClearAllNotifications}
          onMouseEnter={handleMouseEnter} // Déclenché lors du survol
          onMouseLeave={handleMouseLeave} // Déclenché lorsque le curseur quitte le bouton
        >
         Marquer tous les notificaions comme lus 
        </Button>
      );
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getNotifications`, {
          params: { userLogin: user.LOGIN },
         
        });
        console.log('hello there', response)
        if (response.data.length > prevNotificationLength.current) {
          console.log("New notification");
          playNotificationSound();
        }

        setNotifications(response.data);
        prevNotificationLength.current = response.data.length;
      } catch (error) {
       
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

  
    const intervalId = setInterval(fetchNotifications, 50000);

    return () => clearInterval(intervalId); 
  }, [user.LOGIN]);


const openNot = Boolean(anchorEl);
const id = openNot ? 'simple-popover' : undefined;

useEffect(() => {
  const checkNewEntries = async () => {
    try {
      const partenaireResponse = await axios.get(`${BASE_URL}/api/getNewpart`);
      const investisseurResponse = await axios.get(`${BASE_URL}/api/getNewInv`);
      await axios.get(`${BASE_URL}/api/getNewCmdInv`)
      await axios.get(`${BASE_URL}/api/getNewCmdPart`)
      await axios.get(`${BASE_URL}/api/getNewCmdFdm`)
      await axios.get(`${BASE_URL}/api/getNewCmdCspd`)
    } catch (error) {
      console.error('Error fetching new entries:', error);
    }
  };

  const intervalId = setInterval(checkNewEntries, 50000);

  return () => clearInterval(intervalId);
}, []);


return (
  <Box sx={{ display: 'flex', backgroundColor:'#F5F7F8'}}>
  
    <CssBaseline />
    <AppBar position="fixed" open={open} style={{backgroundColor:'#7695FF'}}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {openCategory ? openCategory : 'Menu'}
          {selectedTab !== -1 && ` - ${categories.find((cat) => cat.name === openCategory)?.items[selectedTab]}`}
        </Typography>
        <Box sx={{ marginLeft: 'auto', marginRight: 3, fontWeight: 'bold' }}>
            {user && user.ROLE && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: 8 }}>
                  <img src={userIcon} alt="person icon" style={{ width: "30px", height: "30px" }} />
                </div>
                <div>
                  <Typography variant="body1" color="secondary" style={{ fontSize: "25px", fontWeight: "bold", color: "#e99c05", marginTop: "5px" }}>
                    {user.LOGIN}
                  </Typography>
                  <Typography variant="body2" color="white" style={{ fontSize: "14px", fontWeight: "normal", marginLeft: 10 }}>
                    {user.ROLE}
                  </Typography>
                </div>
                <IconButton color="inherit" onClick={handleBellClick}>
                <Badge
          badgeContent={notifications.length}
          sx={{ 
            '& .MuiBadge-dot': {
              backgroundColor: 'red' 
            },
            '& .MuiBadge-standard': {
              backgroundColor: 'red',
              color: '#fff' 
            }
          }}
        >
                    <NotificationsIcon style={{height:"40px",width:"40px",color: "#FAFA33"}}/>
                  </Badge>
                </IconButton>
                <Popover
                  id={id}
                  open={openNot}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                
                >
               <List>
               {renderNotificationHeader()} 

  {sortedNotifications.map((notification, index) => (
    
    <ListItem button key={index} onClick={() => handleNotificationClick(notification)}>
 
      <ListItemIcon>
        {['cmdpartenaire', 'cmdfdm', 'cmdcspd', 'cmdinvestisseur'].includes(notification.TYPE) ? (
          <Avatar src={cmdIcon} alt="Command Icon" />
        ) : (
          <Avatar src={personIcon} alt="pers Icon" />
        )}
      </ListItemIcon>
      
      <ListItemText
        primary={
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>
            {notification.MESSAGE}
          </Typography>
        }
    
      />
    </ListItem>
  ))}
</List>
                </Popover>
              </div>
            )}
          </Box>
      </Toolbar>
    </AppBar>

    <Drawer variant="permanent" open={open} style={{backgroundColor:'#F5F7F8'}} >
      
      <DrawerHeader  style={{backgroundColor:'#F5F7F8'}}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List style={{backgroundColor:'#F5F7F8'}}>
        {/* Contact Category */}
        
          <React.Fragment>
            <Tooltip title="Contact" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleCategoryClick('Contact')}>
                  <ListItemIcon>
                    <img src={ClientsIcon} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Contact" />
                  {openCategory === 'Contact' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Collapse in={openCategory === 'Contact'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Tooltip title="Liste des clients" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                      <img src={clientList} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Liste des clients" />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Journal des appels" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(1)}>
                      <ListItemIcon>
                      <img src={callsIcon} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Journal des appels" />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Demande d'achat" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(2)}>
                      <ListItemIcon>
                      <img src={achatIcon} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />
                      </ListItemIcon>
                      <ListItemText primary="Demande d'achat" />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </List>
            </Collapse>
            
          </React.Fragment>
        

        {/* Administration Category */}
        {user.ROLE!=="collaborateur" &&(
          <>
        <Tooltip title="Administration" placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleCategoryClick('Administration')}>
              <ListItemIcon>
                <img src={administrationIcon} alt="Administration Icon" style={{ width: '30px', height: '30px' }} />
              </ListItemIcon>
              <ListItemText primary="Administration" />
              {openCategory === 'Administration' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
        <Collapse in={openCategory === 'Administration'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip title="Gestion des utilisateurs" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(0)}>
                  <ListItemIcon>
                  <img src={userSettings} alt="Administration Icon" style={{ width: '30px', height: '30px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des utilisateurs" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Tooltip title="Gestion des menus" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(1)}>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des menus" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
           
          </List>
        </Collapse>
        {/* Mailing Category */}

        <Tooltip title="Mailing" placement="right">
          <ListItem disablePadding>
            <ListItemButton  onClick={() => handleCategoryClick('Mailing')}>
              <ListItemIcon>
                <img src={email} alt="Administration Icon" style={{ width: '30px', height: '30px' }} />
              </ListItemIcon>
              <ListItemText primary="Mailing" />
              {openCategory=='Mailing' }
            </ListItemButton>
          </ListItem>
        </Tooltip>
       
        
        
</>
)}
        {user.ROLE!=="collaborateur" &&(
          <>
        <Tooltip title="Paramétrage" placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleCategoryClick('Paramétrage')}>
              <ListItemIcon>
                <img src={settings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} />
              </ListItemIcon>
              <ListItemText primary="Paramétrage" />
              {openCategory === 'Paramétrage' ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
        <Collapse in={openCategory === 'Paramétrage'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip title="Gestion des statuts partenaires" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(0)}>
                  <ListItemIcon>
                    
                <img src={callSettings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des statuts partenaires" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          
            <Tooltip title="Gestion des raisons appels" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(2)}>
                  <ListItemIcon>
                  <img src={callSettings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} /> 
                  </ListItemIcon>
                  <ListItemText primary="Gestion des raisons appels" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Tooltip title="Gestion des qualifications appels" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(1)}>
                  <ListItemIcon>
                  <img src={callSettings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Gestion des qualifications appels" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Tooltip title="Relation statuts raisons d'appel" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(3)}>
                  <ListItemIcon>
                  <img src={callSettings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} /> 
                  </ListItemIcon>
                  <ListItemText primary="Relation statuts raisons d'appel" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Tooltip title="Relation raisons d'appel qualification" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(4)}>
                  <ListItemIcon>
                  <img src={callSettings} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} /> 
                  </ListItemIcon>
                  <ListItemText primary="Relation raisons d'appel qualification" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            <Tooltip title="Paramétres de base" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleTabClick(5)}>
                  <ListItemIcon>
                  <img src={settingsIcon} alt="Paramétrage Icon" style={{ width: '30px', height: '30px' }} /> 
                  </ListItemIcon>
                  <ListItemText primary="Paramétres de base" />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>
        </Collapse>

       </>
)}

      </List>
    </Drawer>
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        bgcolor: '#F5F5F5',
        p: 1,
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <DrawerHeader />

      {selectedTab === 0 && openCategory === 'Contact' && <TabsClients searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue}/>}
      {selectedTab === 1 && openCategory === 'Contact' && <CallsJournal />}
      {selectedTab === 2 && openCategory === 'Contact' && <DemAchat />}
      {openCategory === 'Paramétrage' && (
        <>
          {selectedTab === 0 && <ListStatutPart />}
          {selectedTab === 1 && <ListQualificationAppel />}
          {selectedTab === 2 && <ListRaison />}
          {selectedTab === 3 && <RaisonStatuts/>}
          {selectedTab === 4 && <RaisonQualifications />}

          {selectedTab === 5 && <ManagementComponent />}
        </>
      )}
      {openCategory === 'Administration' && user?.ROLE === 'administrateur' && (
        <>
          {selectedTab === 0 && <UserManagement />}
        </>
      )}
         {openCategory === 'Mailing'  && <MailingClients searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue}/>}
       
      
    </Box>
  </Box>
);
};

