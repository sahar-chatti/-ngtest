import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import ContactsIcon from '@mui/icons-material/Contacts';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Box from '@mui/material/Box';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
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
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ListQualificationAppel from './ListQualificationAppel';
import ListStatutPart from './ListStatutPart';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';
import ClientsIcon from './icons/profile.png';
import settings from './icons/settings.png'
import UserManagement from './UserManagement';
import { useSelector } from 'react-redux';
import userIcon from './icons/userIcon.png'
import clientList from './icons/lis.png'
import RaisonStatuts from './StatRaisonParam';
import RaisonQualifications from './QualifRaisonParam';
import callsIcon from './icons/customer-service.png'
import CallsJournal from './CallsJournal';
import ManagementComponent from './ParametresBase';
import achatIcon from './icons/achat.png'
import DemAchat from './DemandeAchat';
import Storekeeper from './Storekeeper';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InventoryIcon from '@mui/icons-material/Inventory';
import axios from 'axios';
import BASE_URL from './constantes';
import { Badge, Popover, Avatar, Button } from '@mui/material';
import cmdIcon from './icons/cmd.png'
import personIcon from './icons/per.png'
import SettingsIcon from '@mui/icons-material/Settings';
import RestoreIcon from '@mui/icons-material/Restore';

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
    width: !open ? 100 : drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      position: 'relative',
      width: !open ? 100 : drawerWidth,
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
    icon: <ContactsIcon />,
  },
  {
    name: 'Administration',
    items: ['Gestion des utilisateurs', 'Gestion des menus'],
    icon:<ManageAccountsIcon/>
    ,
  },
  {
    name: 'Paramétrage',
    items: ['Gestion des statuts partenaires', 'Gestion des qualifications appels', 'Gestion des raisons appels'],
    icon: <img src={settings} alt="Clients Icon" style={{ width: '30px', height: '30px' }} />,
  },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = useState(-1);
  const [openCategory, setOpenCategory] = React.useState(null);
  const user = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState('0')
  const [value, setValue] = useState(0)

  console.log("user", user)

  const handleCategoryClick = (category) => {
    if (openCategory === category) {
      setOpenCategory(null); 
      setSelectedTab(-1); 
    } else {
      setOpenCategory(category); 
      setSelectedTab(-1);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleTabClick = (index) => {
    setSelectedTab(index);
  };
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const sortedNotifications = [...notifications].sort((a, b) => b.ID - a.ID);

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
      if (TYPE === 'cmdpartenaire') {
        setValue(0)
      }
      if (TYPE === 'cmdinvestisseur') {
        setValue(1)
      }
      if (TYPE === 'cmdcspd') {
        setValue(2)
      }
      if (TYPE === 'cmdfdm') {
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


  const handleClearAllNotifications = async () => {
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

    setNotifications([]);

    setAnchorEl(null);
  };

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const clearButtonStyle = {
    fontWeight: 'bold',
    borderRaduis: '20px',
    textAlign: 'end',
    color: 'red',
    backgroundColor: '#3FA2F6',
    BorderColor: 'blue',
    width: '100%',
    Margin: '15px',
    marginTop: '-10px',
    transition: 'background-color 0.3s ease',
    fontSize: '13px' // Transition pour un effet plus doux
  };


  const clearButtonHoverStyle = {
    backgroundColor: '#D1E9F6',
    color: 'gray' // Couleur de fond au survol
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
        <Typography variant="body1" style={{ textAlign: 'center', margin: '10px 0', color: '#555', width: '350px' }}>
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
    <Box sx={{ display: 'flex', backgroundColor: '#F5F7F8' }}>

      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ backgroundColor: '#7695FF' }}>
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
                    <NotificationsIcon style={{ height: "40px", width: "40px", color: "#FAFA33" }} />
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

      <Drawer variant="permanent" open={open} style={{ backgroundColor: '#F5F7F8' }} >

        <DrawerHeader style={{ backgroundColor: '#F5F7F8' }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List style={{ backgroundColor: '#F5F7F8' }}>
          {/* Contact Category */}

          <React.Fragment>

            {user.ROLE === "administrateur" && (
              <>
                <Tooltip title="Contact" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Contact')}>
                      <ListItemIcon>
                      <ContactsIcon/>
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
                          <GroupsIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Liste des clients" />
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                    <Tooltip title="Journal des appels" placement="right">
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleTabClick(1)}>
                          <ListItemIcon>
                          <RestoreIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Journal des appels" />
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                    <Tooltip title="Demande d'achat" placement="right">
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleTabClick(2)}>
                          <ListItemIcon>
                          <StorefrontIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Demande d'achat" />
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  </List>
                </Collapse>
                <Tooltip title="Administration" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Administration')}>
                      <ListItemIcon>
                      <ManageAccountsIcon/>
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
                          <SettingsSuggestIcon/>
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
                {/* storekeeper Category */}
                <Tooltip title="Magasin" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Magasin')}>
                      <ListItemIcon>
                      <InventoryIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Magasin" />
                      {openCategory == 'Magasin'}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                {/* Mailing Category */}

                <Tooltip title="Mailing" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Mailing')}>
                      <ListItemIcon>
                      <MailIcon />                     
                      </ListItemIcon>
                      <ListItemText primary="Mailing" />
                      {openCategory == 'Mailing'}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>


              </>
            )}


            {user.ROLE === "directeur commercial " && (
              <>
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

                {/* storekeeper Category */}
                <Tooltip title="Magasin" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Magasin')}>
                      <InventoryIcon />
                      <ListItemIcon>
                      </ListItemIcon>
                      <ListItemText primary="Magasin" />
                      {openCategory == 'Magasin'}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                {/* Mailing Category */}

                <Tooltip title="Mailing" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleCategoryClick('Mailing')}>
                      <ListItemIcon>
                      <MailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mailing" />
                      {openCategory == 'Mailing'}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>


              </>
            )}
          </React.Fragment>
          {user.ROLE === "directeur communication" && (
            <>
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

              {/* storekeeper Category */}
              <Tooltip title="Magasin" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Magasin')}>
                    <InventoryIcon style={{color:'#4379F2'}}/>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary="Magasin" />
                    {openCategory == 'Magasin'}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {/* Mailing Category */}

              <Tooltip title="Mailing" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Mailing')}>
                    <ListItemIcon>
                    <MailIcon style={{color:'#4379F2'}} />                    
                    </ListItemIcon>
                    <ListItemText primary="Mailing" />
                    {openCategory == 'Mailing'}
                  </ListItemButton>
                </ListItem>
              </Tooltip>


            </>
          )}

          {user.ROLE === "collaborateur" && (
            <>
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
                </List>
              </Collapse>


            </>
          )}


          {user.ROLE === "administrateur" && (
            <>
              <Tooltip title="Paramétrage" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Paramétrage')}>
                    <ListItemIcon>
                    <SettingsIcon style={{color:'#4379F2'}}/>
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
                        <ListItemIcon  >

                        <ViewStreamIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Gestion des statuts partenaires" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>

                  <Tooltip title="Gestion des raisons appels" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(2)}>
                        <ListItemIcon>

                        <ViewStreamIcon/>
                         </ListItemIcon>
                        <ListItemText primary="Gestion des raisons appels" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Gestion des qualifications appels" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(1)}>
                        <ListItemIcon>
                          
                        <ViewStreamIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Gestion des qualifications appels" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Relation statuts raisons d'appel" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(3)}>
                        <ListItemIcon>
                        
                        <ViewStreamIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Relation statuts raisons d'appel" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Relation raisons d'appel qualification" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(4)}>
                        <ListItemIcon>
                     
                        <ViewStreamIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Relation raisons d'appel qualification" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Paramétres de base" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(5)}>
                        <ListItemIcon>
                        <ViewStreamIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Paramétres de base" />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </List>
              </Collapse>

            </>
          )}
          {user.ROLE == "magasinier" && (
            <>

              {/* storekeeper Category */}
              <Tooltip title="Magasin" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Magasin')}>
                    <InventoryIcon />
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary="Magasin" />
                    {openCategory == 'Magasin'}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
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

        {selectedTab === 0 && openCategory === 'Contact' && <TabsClients searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 1 && openCategory === 'Contact' && <CallsJournal />}
        {selectedTab === 2 && openCategory === 'Contact' && <DemAchat />}
        {openCategory === 'Paramétrage' && (
          <>
            {selectedTab === 0 && <ListStatutPart />}
            {selectedTab === 1 && <ListQualificationAppel />}
            {selectedTab === 2 && <ListRaison />}
            {selectedTab === 3 && <RaisonStatuts />}
            {selectedTab === 4 && <RaisonQualifications />}
            {selectedTab === 5 && <ManagementComponent />}
          </>
        )}
        {openCategory === 'Administration' && user?.ROLE === 'administrateur' && (
          <>
            {selectedTab === 0 && <UserManagement />}
          </>
        )}

        {openCategory === 'Mailing' && <MailingClients searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

        {openCategory === 'Magasin' && <Storekeeper searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

      </Box>
    </Box>
  );
};

