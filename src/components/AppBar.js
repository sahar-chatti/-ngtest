import * as React from 'react';
import PhonePausedIcon from '@mui/icons-material/PhonePaused';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ReorderIcon from '@mui/icons-material/Reorder';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import CalculateIcon from '@mui/icons-material/Calculate';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import FacebookIcon from '@mui/icons-material/Facebook';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactsIcon from '@mui/icons-material/Contacts';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Box from '@mui/material/Box';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import GroupsIcon from '@mui/icons-material/Groups';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import BadgeIcon from '@mui/icons-material/Badge';
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
import EmployeeRequestsTabs from '../RhDepartement/EmployeeReqTabs';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import TabsPartenaires from '../Commercial/Partenaires/TabsPartenaires';
import TabsInvestisseurs from '../Commercial/Investisseurs/TabsInvestisseur';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import TabsCspd from '../Commercial/CSPD/TabsCspd';
import TabsClientFdm from '../Commercial/FDM/TabsClientFdm';
import Reception from '../Commercial/Reception';
import UserEvaluationDialog from '../Adminstration/UserEvaluationDialog';
import Tabsfamily from '../Commercial/Family/TabsFamily';
import AssuredWorkloadRoundedIcon from '@mui/icons-material/AssuredWorkloadRounded';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MailingClients from '../Mailing/MailingClients';
import ListRaison from '../Utilis/ListRaison';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ListQualificationAppel from '../Utilis/QualifRaisonParam';
import ListStatutPart from '../Utilis/ListStatutPart';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';
import settings from '../icons/settings.png'
import UserManagement from '../Adminstration/UserManagement';
import MenuManagement from '../Adminstration/MenuManagement';
import SavManagement from '../Sav/Savmanagement';
import RenseignementFinancier from '../Finance/RenseignementFinancier';
import RenseignementDirection from '../Adminstration/RenseignementDirection';
import RenseignementCommercial from '../Commercial/RenseignementCommercial';
import JournalCommercial from '../Commercial/JournalCommercial';
import PaidIcon from '@mui/icons-material/Paid';
import { useSelector } from 'react-redux';
import userIcon from '../icons/userIcon.png'
import RaisonStatuts from '../Utilis/StatRaisonParam';
import RaisonQualifications from '../Utilis/QualifRaisonParam';
import CallsJournal from '../Commercial/CallsJournal';
import ManagementComponent from '../Utilis/ParametresBase';
import DemAchat from '../Commercial/DemandeAchat';
import Catalogues from '../Utilis/catalogues';
import RhTabs from '../RhDepartement/RhTabs';
import Storekeeper from '../Magasin/Storekeeper';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import ShopTwoIcon from '@mui/icons-material/ShopTwo';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import BASE_URL from '../Utilis/constantes';
import { Badge, Popover, Avatar, Button } from '@mui/material';
import cmdIcon from '../icons/cmd.png'
import personIcon from '../icons/per.png'
import SettingsIcon from '@mui/icons-material/Settings';
import RestoreIcon from '@mui/icons-material/Restore';
import { useAccessRights } from '../Utilis/accessRights';
import OrdresAdministration from '../Adminstration/OrdreAdministration';
import ReclamationsList from '../Sav/ReclamationsList';
import Maintenance from '../MaintenanceVoiture'
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
    name: 'Commercial',
    items: ['Liste des clients'],
    icon: <ContactsIcon />,
  },
  {
    name: 'Administration',
    items: ['Gestion des utilisateurs', 'Gestion des menus'],
    icon: <ManageAccountsIcon />
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
  const accessRights = useAccessRights(user?.LOGIN);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [evaluationCount, setEvaluationCount] = useState(0);
  const prevEvaluationCount = useRef(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newNotification, setNewNotification] = useState(null);

  const fetchEvaluationCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/evaluations`);
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const count = response.data.filter(evaluation => {
        const evalDate = new Date(evaluation.EVALUATION_DATE);
        return evaluation.USER_ID === user.ID_UTILISATEUR && evalDate >= startOfMonth;
      }).length;


      setEvaluationCount(count);

      if (count !== prevEvaluationCount.current) {
        const audio = new Audio('/notification_sound.mp3');
        audio.play();
      }

      prevEvaluationCount.current = count;
    } catch (error) {
      console.error('Error fetching evaluation count:', error);
    }
  };
  const handleEvaluationClick = () => {
    setEvaluationCount(0);
    prevEvaluationCount.current = 0;
    setEvaluationDialogOpen(true);
  };
  useEffect(() => {
    fetchEvaluationCount();
    const intervalId = setInterval(fetchEvaluationCount, 30000);

    return () => clearInterval(intervalId);
  }, [user.LOGIN]);


  useEffect(() => {
    if (accessRights) {
      setIsLoading(false);
    }
  }, [user, accessRights]);

  const handleCategoryClick = (category) => {
    if (openCategory === category) {
      setOpenCategory(null);
      setSelectedTab(-1);
    } else {
      setOpenCategory(category);
      setSelectedTab(-1);
    }
  };
  console.log('Access Rights Reception:', accessRights?.ACCESS_RECEPTION);

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
  const navigate = useNavigate();

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
    setSearchTerm(term);
    setOpenCategory('Commercial');
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
  const openNot = Boolean(anchorEl);
  const id = openNot ? 'simple-popover' : undefined;
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
  const popupAnimation = {
    '@keyframes popIn': {
      '0%': {
        transform: 'scale(0.3)',
        opacity: 0
      },
      '50%': {
        transform: 'scale(1.1)',
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1
      }
    }
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
    fontSize: '13px'
  };
  const clearButtonHoverStyle = {
    backgroundColor: '#D1E9F6',
    color: 'gray'
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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

        // Check if there are new notifications
        if (response.data.length > notifications.length) {
          // Get the newest notification
          const newestNotification = response.data[0];
          setNewNotification(newestNotification);
          setOpenSnackbar(true);

          // Play notification sound
          const audio = new Audio('/notification_sound.mp3');
          audio.play();
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  useEffect(() => {
    const checkNewEntries = async () => {
      try {
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

  const boldTextStyle = {
    '& .MuiListItemText-primary': {
      fontWeight: 'bold',
    }
  };


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F5F7F8' }}>

      <CssBaseline />
      <AppBar position="fixed" open={open} style={{ backgroundColor: '#3572EF' }}>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          sx={{
            '& .MuiAlert-root': {
              animation: 'popIn 0.5s ease-out',
              ...popupAnimation,
              minWidth: '400px',
              maxWidth: '600px',
              borderRadius: '15px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="info"
            sx={{
              backgroundColor: '#3572EF',
              color: 'white',
              padding: '20px',
              '& .MuiAlert-icon': {
                color: 'white',
                fontSize: '28px'
              },
              '& .MuiAlert-message': {
                fontSize: '16px',
                fontWeight: 500
              },
              '& .MuiAlert-action': {
                paddingTop: '8px'
              },
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Avatar
                src={newNotification?.TYPE?.includes('cmd') ? cmdIcon : personIcon}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid white'
                }}
              />
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Nouvelle notification
                </Typography>
                <Typography variant="body1">
                  {newNotification?.MESSAGE}
                </Typography>
              </div>
            </div>
          </Alert>
        </Snackbar>
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
                {user?.ROLE === 'administrateur' ? (
                  <Tooltip title="Ticket de caisse" arrow>
                    <IconButton
                      color="inherit"
                      onClick={() => navigate('/tickets')}
                    >
                      <Badge
                        sx={{
                          '& .MuiBadge-dot': {
                            backgroundColor: 'red',
                          },
                          '& .MuiBadge-standard': {
                            backgroundColor: 'red',
                            color: '#fff',
                          },
                        }}
                      >
                        <img
                          src={require('../icons/save.png')}
                          alt="Savings Icon"
                          style={{ height: "40px", width: "40px" }}
                        />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Évaluation" arrow>
                    <IconButton
                      color="inherit"
                      onClick={handleEvaluationClick}
                    >
                      <Badge
                        badgeContent="+"
                        invisible={evaluationCount === 0}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#FAFA33',
                            color: '#000000',
                            animation: evaluationCount > 0 ? 'pulse 2s infinite' : 'none',
                          },
                        }}
                      >
                        <img
                          src={require('../icons/save.png')}
                          alt="Savings Icon"
                          style={{ height: "40px", width: "40px" }}
                        />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}

                <UserEvaluationDialog
                  open={evaluationDialogOpen}
                  onClose={() => setEvaluationDialogOpen(false)}
                  userLogin={user?.LOGIN}
                />
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

          {!isLoading && accessRights.ACCESS_CONTACT === 1 && (<>
            <Tooltip title="Commercial" placement="right">
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleCategoryClick('Commercial')}>
                  <ListItemIcon>
                    <ContactsIcon style={{ color: '#4379F2' }} />
                  </ListItemIcon>
                  <ListItemText primary="Commercial" />
                  {openCategory === 'Commercial' ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
            </Tooltip>


            <Collapse in={openCategory === 'Commercial'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {!isLoading && accessRights.ACCESS_PARTENAIRE === 1 && (<>

                  <Tooltip title="Partenaires" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(1)}>
                        <ListItemIcon>
                          <Diversity3Icon />
                        </ListItemIcon>
                        <ListItemText primary="Partenaires" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}
                {!isLoading && accessRights.ACCESS_INVESTISSEUR === 1 && (<>

                  <Tooltip title="Investisseurs" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(2)}>
                        <ListItemIcon>
                          <AssuredWorkloadRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Investisseurs" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}
                {!isLoading && accessRights.ACCESS_CLIENT_CSPD === 1 && (<>

                  <Tooltip title="ClientS CSPD" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(3)}>
                        <ListItemIcon>
                          <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clients CSPD" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}

                {!isLoading && accessRights.ACCESS_CLIENT_FDM === 1 && (<>

                  <Tooltip title="Clients FDM" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(4)}>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clients FDM" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}
                {!isLoading && accessRights.ACCESS_FAMILLE === 1 && (<>

                  <Tooltip title="Famille" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(5)}>
                        <ListItemIcon>
                          <FamilyRestroomIcon />
                        </ListItemIcon>
                        <ListItemText primary="Famille" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}
                {!isLoading && accessRights.ACCESS_HISTORIQUE_APPEL === 1 && (<>

                  <Tooltip title="Journal des appels" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(6)}>
                        <ListItemIcon>
                          <RestoreIcon />
                        </ListItemIcon>
                        <ListItemText primary="Journal des appels" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>
                )}
                {!isLoading && accessRights.ACCESS_ACHATS === 1 && (<>

                  <Tooltip title="Demande d'achat" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(7)}>
                        <ListItemIcon>
                          <ProductionQuantityLimitsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Demande d'achat" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </>)}

                <Tooltip title="Sav" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(8)}>
                      <ListItemIcon>
                        <SettingsApplicationsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sav" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                <Tooltip title="Renseignement client" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(10)}>
                      <ListItemIcon>
                        <PersonSearchIcon />
                      </ListItemIcon>
                      <ListItemText primary="Renseignements commerciaux " sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                <Tooltip title="Demandes et Réclamations" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(9)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations " sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>

                <Tooltip title="Ordre Administration" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(11)}>
                      <ListItemIcon>
                        <SettingsApplicationsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Administration" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Réclamation Clients (Application)" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(12)}>
                      <ListItemIcon>
                        <ShopTwoIcon />
                      </ListItemIcon>
                      <ListItemText primary="Réclamation Clients (Application) " sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Mon journal d'appel" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(13)}>
                      <ListItemIcon>
                        <PhonePausedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mon journal d'appel" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </List>
            </Collapse>
          </>
          )}
          {accessRights.ACCESS_MAGASIN === 1 && (
            <>
              <Tooltip title="Magasininier" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Magasin')}>
                    <ListItemIcon>
                      <StorefrontIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Magasininier" />
                    {openCategory === 'Magasin' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Magasin'} timeout="auto" unmountOnExit>
                <Tooltip title="Magasin" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        <StoreIcon />
                      </ListItemIcon>
                      <ListItemText primary="Magasin" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Ressources Humaines" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(1)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Ressources Humaines" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}

          {accessRights.ACCESS_RH === 1 && (
            <>
              <Tooltip title="Ressources Humaines" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Ressources Humaines')}>
                    <ListItemIcon>
                      <BadgeIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Ressources Humaines" />
                    {openCategory === 'Ressources Humaines' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Ressources Humaines'} timeout="auto" unmountOnExit>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        <DomainAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_RECEPTIONIST === 1 &&(
            <>
              <Tooltip title="Réception" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Réception')}>
                    <ListItemIcon>
                      <BusinessIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Réception" />
                    {openCategory === 'Réception' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Réception'} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Tooltip title="Visiteurs" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(0)}>
                        <ListItemIcon>
                          <PersonAddAlt1Icon />
                        </ListItemIcon>
                        <ListItemText primary="Visiteurs" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Demandes et réclamations" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(1)}>
                        <ListItemIcon>
                          <PersonAddAlt1Icon />
                        </ListItemIcon>
                        <ListItemText primary="Demandes et réclamations" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </List>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_FINANCE === 1 && (
            <>
              <Tooltip title="Finance" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Finance')}>
                    <ListItemIcon>
                      <PaidIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Finance" />
                    {openCategory === 'Finance' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Finance'} timeout="auto" unmountOnExit>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        < ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(1)}>
                      <ListItemIcon>
                        < PersonSearchIcon />
                      </ListItemIcon>
                      <ListItemText primary="Renseignements Financier" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_COMPTABILITE === 1 && (
            <>
              <Tooltip title="Comptabilité" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Comptabilité')}>
                    <ListItemIcon>
                      <CalculateIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Comptabilité" />
                    {openCategory === 'Comptabilité' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Comptabilité'} timeout="auto" unmountOnExit>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_IMPORT_EXPORT === 1 && (
            <>
              <Tooltip title="Import / Export" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Import / Export')}>
                    <ListItemIcon>
                      <DirectionsBoatIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Import / Export" />
                    {openCategory === 'Import / Export' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Import / Export'} timeout="auto" unmountOnExit>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="Réclamation Clients (Application)" placement="right" >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(2)}>
                      <ListItemIcon>
                        <ShopTwoIcon />
                      </ListItemIcon>
                      <ListItemText primary="Réclamation Clients (Application) " sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="SAV" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(1)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="SAV" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}

          {accessRights.ACCESS_MAILING === 1 && (
            <>
              <Tooltip title="Marketing" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Marketing')}>
                    <ListItemIcon>
                      <FacebookIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Marketing" />
                    {openCategory === 'Marketing' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Marketing'} timeout="auto" unmountOnExit>
                <Tooltip title="Mailing" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(0)}>
                      <ListItemIcon>
                        <MailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mailing" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
              <Collapse in={openCategory === 'Marketing'} timeout="auto" unmountOnExit>
                <Tooltip title="Demandes et Réclamations" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(1)}>
                      <ListItemIcon>
                        <ApartmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Demandes et Réclamations" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_ADMINISTRATION === 1 && (
            <>
              <Tooltip title="Administration" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Administration')}>
                    <ListItemIcon>
                      <ManageAccountsIcon style={{ color: '#4379F2' }} />
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
                          <SettingsSuggestIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des utilisateurs" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Gestion des menus" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(1)}>
                        <ListItemIcon>
                          <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des menus" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Gestion des renseignements" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(2)}>
                        <ListItemIcon>
                          <PersonSearchIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des renseignements" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </List>
                <Tooltip title="Ordre administration" placement="right">
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleTabClick(3)}>
                      <ListItemIcon>
                        <ReorderIcon />
                      </ListItemIcon>
                      <ListItemText primary="Ordre administration" sx={boldTextStyle} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Collapse>
            </>
          )}
          {accessRights.ACCESS_PARAMETRAGE === 1 && (
            <>

              <Tooltip title="Paramétrage" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Paramétrage')}>
                    <ListItemIcon>
                      <SettingsIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Paramétrage" />
                    {openCategory === 'Paramétrage' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Paramétrage'} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Tooltip title="Gestion des statuts partenaires" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(0)}>
                        <ListItemIcon  >

                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des statuts partenaires" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>

                  <Tooltip title="Gestion des raisons appels" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(2)}>
                        <ListItemIcon>

                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des raisons appels" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Gestion des qualifications appels" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(1)}>
                        <ListItemIcon>

                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des qualifications appels" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Relation statuts raisons d'appel" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(3)}>
                        <ListItemIcon>

                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Relation statuts raisons d'appel" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Relation raisons d'appel qualification" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(4)}>
                        <ListItemIcon>
                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Relation raisons d'appel qualification" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Paramétres de base" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(5)}>
                        <ListItemIcon>
                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Paramétres de base" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Tooltip title="Paramétres de base" placement="right">
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(6)}>
                        <ListItemIcon>
                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Catalogues" sx={boldTextStyle} />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                </List>
              </Collapse>
            </>
          )}
          {!isLoading && accessRights.ACCESS_VEHICULE === 1 && (
            <>

              <Tooltip title="Maintenance véhicule" placement="right">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleCategoryClick('Maintenance véhicule')}>
                    <ListItemIcon>
                      <CarRepairIcon style={{ color: '#4379F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Maintenance véhicule" />
                    {openCategory === 'Maintenance véhicule' ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Collapse in={openCategory === 'Maintenance véhicule'} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Tooltip title="Gestion des voitures" placement="right" >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleTabClick(0)}>
                        <ListItemIcon  >

                          <ViewStreamIcon />
                        </ListItemIcon>
                        <ListItemText primary="Gestion des voitures" sx={boldTextStyle} />
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


        {selectedTab === 1 && openCategory === 'Commercial' && <TabsPartenaires searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 2 && openCategory === 'Commercial' && <TabsInvestisseurs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 3 && openCategory === 'Commercial' && <TabsCspd searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 4 && openCategory === 'Commercial' && <TabsClientFdm searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 5 && openCategory === 'Commercial' && <Tabsfamily searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 6 && openCategory === 'Commercial' && <CallsJournal searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 7 && openCategory === 'Commercial' && <DemAchat searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 9 && openCategory === 'Commercial' && <EmployeeRequestsTabs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 8 && openCategory === 'Commercial' && <SavManagement searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 10 && openCategory === 'Commercial' && <RenseignementCommercial searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 11 && openCategory === 'Commercial' && <OrdresAdministration searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 12 && openCategory === 'Commercial' && <ReclamationsList searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
        {selectedTab === 13 && openCategory === 'Commercial' && <JournalCommercial searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

        {openCategory === 'Paramétrage' && (
          <>
            {selectedTab === 0 && <ListStatutPart />}
            {selectedTab === 1 && <ListQualificationAppel />}
            {selectedTab === 2 && <ListRaison />}
            {selectedTab === 3 && <RaisonStatuts />}
            {selectedTab === 4 && <RaisonQualifications />}
            {selectedTab === 5 && <ManagementComponent />}
            {selectedTab === 6 && <Catalogues />}
          </>
        )}

        {openCategory === 'Administration' && (
          <>
            {selectedTab === 0 && <UserManagement />}
            {selectedTab === 1 && <MenuManagement />}
            {selectedTab === 2 && <RenseignementDirection searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 3 && <OrdresAdministration searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

          </>
        )}

        {openCategory === 'Marketing' && (
          <>
            {selectedTab === 0 && <MailingClients searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 1 && <EmployeeRequestsTabs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Magasin' && (
          <>
            {selectedTab === 0 && <Storekeeper searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 1 && <EmployeeRequestsTabs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Ressources Humaines' && (
          <>
            {selectedTab === 0 && <RhTabs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Réception' && (
          <>
            {selectedTab === 0 && <Reception searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 1 && <EmployeeRequestsTabs searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Finance' && (
          <>
            {selectedTab === 1 && <RenseignementFinancier searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 0 && <EmployeeRequestsTabs earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Comptabilité' && (
          <>
            {selectedTab === 0 && <EmployeeRequestsTabs earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
          </>
        )}
        {openCategory === 'Import / Export' && (
          <>
            {selectedTab === 0 && <EmployeeRequestsTabs earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}
            {selectedTab === 2 && <ReclamationsList searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

            {/*selectedTab === 1 && <SavImport earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />*/}
          </>
        )}
        {openCategory === 'Maintenance véhicule' && (
          <>
            {selectedTab === 0 && <Maintenance earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />}

            {/*selectedTab === 1 && <SavImport earchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} value={value} setValue={setValue} />*/}
          </>
        )}
      </Box>
    </Box>
  );
};

