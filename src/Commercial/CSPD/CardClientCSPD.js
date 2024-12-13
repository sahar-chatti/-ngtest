import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import HistoryIcon from '@mui/icons-material/History';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import Grid from '@mui/material/Grid';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import BASE_URL from '../../Utilis/constantes';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { TablePagination } from '@mui/material';
import {
  Collapse, IconButton, FormControl,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import VerifiedIcon from '@mui/icons-material/Verified';

const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: 'calc(33.20% - 16px)',
  margin: theme.spacing(1),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  transform: 'scale(1)', 
  '&:hover': {
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.05)', 
  },
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'auto',
}));
const CustomCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
});
const CustomButton = styled(Button)({
  fontSize: '0.6rem',
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '1px',
});
const GlowingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 20,
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  padding: '10px',
  '&:hover': {
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
  },
}));

function CustomCard({ client, selectedClientType, user }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogCalls, setOpenDialogCalls] = useState(false);
  const [tarifs, setTarifs] = useState([])
  const [openTarifDialog, setOpenTarifDialog] = useState(false)
  const [openHistoriqueDialog, setOpenHistoriqueDialog] = useState(false);
  const [communicationHistory, setCommunicationHistory] = useState([]);
  const [encoursData, setEncoursData] = useState(null);
  const [files, setFiles] = useState([]); 
  const [emailSent, setEmailSent] = useState(false);
  const [isClientDetailsVisible, setIsClientDetailsVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [messages, setMessages] = useState('');
  const [fileNames, setFileNames] = useState([]);
  const [boiteMail, setBoiteMail] = useState("");
  const [catalogFiles, setCatalogFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCatalogFile, setSelectedCatalogFile] = useState('');
  const [currentUser, setCurrentUser] = useState({
    COLLABORATOR: user.LOGIN,
    CALL_DATE: new Date().toISOString().slice(0, 16),
    RAISON: '',
    DESCRIPTION: '',
    CLIENT_ID: ''
  });
  const [editing, setEditing] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [articles, setArticles] = useState([]);

  const fetchEncoursData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientsEncours`, {
        params: {
          searchTerm: client.CODE_CLIENT
        }
      });

      if (response.data.clients && response.data.clients.length > 0) {
        setEncoursData(response.data.clients[0]);
      }
    } catch (error) {
      console.error('Error fetching encours data:', error);
    }
  };
  useEffect(() => {
    fetchEncoursData();
  }, [client.CODE_CLIENT]);

  const handleTarifDialogOpen = async (command) => {
    try {
      const result = await axios.get(`${BASE_URL}/api/tarifsClient`, {
        params: {
          code: command.CODE_CLIENT
        }
      });

      setTarifs(result.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
    setOpenTarifDialog(true)
  }

  const handleDialogOpen = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientsCspd`, {
        params: { CODE_CLIENT: client.CODE_CLIENT }
      });

      if (response.status === 200) {
        const clientData = response.data;
        setCurrentUser(prevState => {
          const newState = {
            ...prevState,
            CODE_CLIENT: client.CODE_CLIENT,
            COLLABORATOR: user.LOGIN,
            CALL_DATE: new Date().toISOString().slice(0, 16),
            RAISON: '',
            DESCRIPTION: '',
          };
          return newState;
        });
        await fetchCommunicationHistory();
        setOpenDialog(true);
      } else {
        throw new Error('Failed to fetch client data');
      }
    } catch (error) {
      console.error('Error during dialog open process:', error);
      alert('Error fetching client data. Please try again.');
    }
  };

  const handleDialogAppels = async () => {
    await fetchCommunicationHistory();
    setOpenDialogCalls(true);

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDialogCalls(false);

    setEditing(false);
  };

  const fetchCommunicationHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/callscspd`, {
        params: { id_client: client.CODE_CLIENT }
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch communication history');
      }
      setCommunicationHistory(response.data);
    } catch (error) {
      console.error('Error fetching communication history:', error);
    }
  };

  const handleSaveUser = async () => {
    try {
      const requiredFields = ['COLLABORATOR', 'CALL_DATE', 'RAISON', 'DESCRIPTION', 'CODE_CLIENT'];
      const missingFields = requiredFields.filter(field => !currentUser[field]);
      if (missingFields.length > 0) {
        alert(`Veuillez remplir tous les champs  `);
        return;
      }
      const apiEndpoint = editing
        ? `${BASE_URL}/api/collaboratorscalls/${currentUser.ID}`
        : `${BASE_URL}/api/collaboratorscalls`;

      const apiMethod = editing ? 'put' : 'post';
      const formatDate = (date) => {
        const dateObj = new Date(date);
        const tunisiaTime = new Date(dateObj.getTime() + (1 * 60 * 60 * 1000));
        return tunisiaTime.toISOString();
      };

      const requestData = {
        COLLABORATOR: user.LOGIN,
        CALL_DATE: formatDate(currentUser.CALL_DATE),
        RAISON: currentUser.RAISON,
        DESCRIPTION: currentUser.DESCRIPTION,
        clientId: currentUser.CODE_CLIENT,
      };
      const response = await axios[apiMethod](apiEndpoint, requestData, { timeout: 5000 });
      if (response.status === 201 || response.status === 200) {
        fetchCommunicationHistory();
        handleCloseDialog();
        alert(`Communication ${editing ? 'modifiée' : 'ajoutée'} avec succès.`);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error saving communication:', error);
      let errorMessage = 'Erreur lors de la sauvegarde de la communication.';

      if (error.response) {
        errorMessage = `Server Error: ${error.response.status} - ${error.response.data.error || error.response.data.message || 'Unknown error'}`;
        if (error.response.data.details) {
          console.error('Error details:', error.response.data.details);
        }
      } else if (error.request) {
        errorMessage = 'Pas de réponse du serveur. Veuillez réessayer plus tard.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'La requête a expiré. Veuillez vérifier votre connexion et réessayer.';
      }
      alert(errorMessage);
    }
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    const names = selectedFiles.map(file => file.name);
    setFileNames(names);
  };
  useEffect(() => {
    const fetchCatalogFiles = async () => {
      try {
        const response = await axios.get('http://192.168.1.170:3300/api/files');
        setCatalogFiles(response.data);
      } catch (error) {
      }
    };
    fetchCatalogFiles();
  }, []);

  useEffect(() => {
    if (client?.ADR_C_FACT_3) {
      setBoiteMail(client.ADR_C_FACT_3);
    }
  }, [client]);

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!subject || !messages || !boiteMail) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('message', messages.trim());
    formData.append('code', boiteMail.trim());

    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    if (selectedCatalogFile) {
      formData.append('selectedCatalogFile', selectedCatalogFile);
    }

    try {
      const response = await axios.post('http://192.168.1.170:3300/mailing', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert('Email sent successfully!');
        setEmailSent(true);
        setSubject('');
        setMessages('');
        setFiles([]);
        setFileNames([]);
        setSelectedCatalogFile('');
        setOpen(false);
      }
    } catch (error) {
      console.error('Mailing error:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to send email'}`);
    }
  };

  const makeCall = (tel) => {
    if (tel && typeof tel === 'string') {
      window.location.href = `sip:${tel.replace(/[^0-9]+/g, '')}`;
    } else {
      console.error('Numéro de téléphone invalide:', tel);
      alert('Numéro de téléphone invalide. Veuillez vérifier le numéro et réessayer.');
    }
  };

  const handleHistoriqueDialogOpen = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/cmdClients`, {
        params: {
          base: selectedClientType === "clientsFdm" ? "fdm" : "cspd",
          code: client.CODE_CLIENT
        }
      });
      setCommandes(result.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
    setOpenHistoriqueDialog(true);
  };

  const handleHistoriqueDialogClose = () => {
    setOpenHistoriqueDialog(false);
  };
  const handleHistoriqueDialogCloseCalls = () => {
    setOpenDialogCalls(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCardClick = async (command) => {
    setExpanded(prev => (prev === command.NUM_BLC ? null : command.NUM_BLC));
    try {
      const result = await axios.get(`${BASE_URL}/api/articlescmd`, {
        params: {
          reference: command.NUM_BLC,
          base: selectedClientType === "clientsFdm" ? "fdm" : "cspd"
        }
      });
      setArticles(result.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  const handleClientClick = () => {
    setIsClientDetailsVisible(prev => !prev);
  };
  const BouncingIcon = styled(AdsClickIcon)`
  animation: bounce 1s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-8px);
    }
    60% {
      transform: translateY(-4px);
    }
  }
`;
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <CustomCardWrapper style={{ backgroundColor: 'white', borderRadius: '15px', border: 'transparent' }}>
      <CustomCardContent>
        <GlowingBox style={{ backgroundColor: client.BLOQUER_CLIENT ? "red" : "#7695FF", borderRadius: '11px' }}>
          <Typography
            variant="h6"
            component="div"
            align="center"
            style={{
              color: "white",
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {client.INTITULE_CLIENT.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>{client.INTITULE_GR ? client.INTITULE_GR.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
              : " " 
            }</span> </Typography>
        </GlowingBox>
        {client.BLOQUER_CLIENT ? (
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              marginTop: "10px",
              color: "red"
            }}
          >
            Client bloqué
          </Typography>
        ) : <></>}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            color: '#545454',
            fontWeight: 'bold',
            marginTop: '1em',
            fontSize: '16px',
            cursor: 'pointer' 
          }}
          onClick={handleClientClick} 
        >
          <PersonIcon style={{ marginRight: '0.5em' }} /> <span style={{ color: 'green' }}> {client.INTITULE_CLIENT.replace(/\w\S*/g, text =>
            text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())},
            {client.CODE_CLIENT}  </span><BouncingIcon style={{ marginRight: '0.5em', color: 'green' }} />
        </Typography>
        {isClientDetailsVisible && (
          <Box
            sx={{
              padding: '16px',
              borderTop: '1px solid #ccc',
              marginTop: '10px',
              backgroundColor: '#f9f9f9',
              marginBottom: "10px"
            }}
            onClick={() => handleClientClick(encoursData.NUM_CDE_C)}
          >
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>Mode de règlement:</strong> {encoursData.LIBEL_REGL_C}
            </Typography>
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>{encoursData.CL_CHAMP_11}</strong>
            </Typography>
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>Échéance:</strong> {encoursData.ECHEANCE_REG_C}
            </Typography>
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>Encours client:</strong> {/*command.ENCOURSREG*/}{Number(encoursData.ENCOURSREG) + Number(encoursData.SOLDE_CLIENT) + Number(encoursData.BLNONFACT)}
            </Typography>
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>Encours autorisé:</strong> {encoursData.ENCOURS_MAX_C}
            </Typography>
            <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
              <strong>Encours supp:</strong> {encoursData.ENCOURS_SUPP}
            </Typography>
          </Box>
        )}
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 12, color: '#545454', fontWeight: 'bold', marginTop: '1em', fontSize: '16px' }}>
          <CallIcon style={{ marginRight: '0.5em' }} />
          {client.TEL_CLIENT_F}
          -
          {client.TELCOP_CLIENT_F}
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10, color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <LocationOnIcon style={{ marginRight: '0.5em' }} />
          {client.ADR_C_FACT_1
            ? client.ADR_C_FACT_1.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
            : ""
          }
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10, color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <VerifiedIcon style={{ marginRight: '0.5em' }} /> MF:
          {client.ADR_C_FACT_4
            ? client.ADR_C_FACT_4
              .replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
            : "Pas d'information"
          }
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <CoPresentIcon style={{ marginRight: '0.5em' }} />
          {client.INTITULE_REPRES ? client.INTITULE_REPRES.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
            : ""
          }
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 12, color: '#545454', fontWeight: 'bold', marginTop: '1em', fontSize: '16px' }}>
          <MarkunreadIcon style={{ marginRight: '0.5em' }} />
          {client.ADR_C_FACT_3
          }  <Button onClick={handleClickOpen}>
            envoyer un catalogue   </Button>
        </Typography>
        <>
          {client.NUM_DER_BON ? (
            <Typography variant="body2" color="text.secondary">
              <Grid container style={{ marginTop: '10px', color: "black", alignItems: 'flex-start', fontFamily: 'sans-serif', display: 'inline-flex', fontWeight: 'bold' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead style={{ fontSize: '10px' }}>
                      <TableRow>
                        <TableCell style={{ fontSize: '12px' }}>
                          N°
                        </TableCell>
                        <TableCell style={{ fontSize: '12px' }}>Date</TableCell>
                        <TableCell style={{ fontSize: '12px' }}>Prix</TableCell>
                        <TableCell style={{ fontSize: '12px' }}>nb jours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={client.ID_CLIENT} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell style={{ fontWeight: 'bold', color: '#387ADF', borderRadius: '12px' }}>{client.NUM_DER_BON}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'black', borderRadius: '12px' }}>{new Date(client.DATE_DER_BON).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'green', borderRadius: '12px' }}>{client.TOT_TTC_BLC}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'red', borderRadius: '12px' }}>{client.NBR_JOURS}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Typography>
          ) : (
            <Typography color="text.secondary" gutterBottom>
              <Grid container style={{ marginTop: '10px', color: "black", alignItems: 'flex-start', fontFamily: 'sans-serif', display: 'inline-flex', fontWeight: 'bold' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow key={client.ID_CLIENT} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell style={{ fontWeight: 'bold', color: '#5E6073', borderRadius: '12px', textAlign: 'center' }}> Aucune commande! </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Typography>
          )}
        </>

      </CustomCardContent>
      <CustomCardActions style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CustomButton
          style={{
            color: "green",
            fontWeight: 'bold',
            minWidth: '120px'  // Ajustez cette valeur selon vos besoins
          }}
          startIcon={<PhoneForwardedIcon />}
          size="medium"
          onClick={handleDialogOpen}
        >
          Sortant
        </CustomButton>
        <CustomButton
          style={{
            color: "green",
            fontWeight: 'bold',
            // Ajustez cette valeur selon vos besoins
          }}
          startIcon={<PhoneCallbackIcon />}
          size="medium"
          onClick={handleDialogOpen}
        >
          Entrant
        </CustomButton>

        <CustomButton
          style={{
            color: "#478CCF",
            fontWeight: 'bold',
          }}
          startIcon={<HistoryIcon />}
          onClick={() => handleDialogAppels()}
          size="medium"
        >
          Historique des appels
        </CustomButton>
        <CustomButton
          style={{
            color: "#478CCF",
            fontWeight: 'bold',
            minWidth: '60px'  // Ajustez cette valeur selon vos besoins
          }}
          startIcon={<HistoryIcon />}
          onClick={() => handleHistoriqueDialogOpen()}
          size="medium"
        >
          Historique des commandes
        </CustomButton>
        <CustomButton
          style={{
            color: "#478CCF",
            fontWeight: 'bold',
          }}
          startIcon={<LocalAtmIcon />} onClick={() => handleTarifDialogOpen(client)}
          size="medium"
        >
          tarifs
        </CustomButton>
      </CustomCardActions>

      <Dialog open={openDialog} >
        <DialogTitle>{editing ? 'Modifier la communication' : 'Nouvelle communication'}</DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px" }}
          >
            <CallIcon />
            {client.TEL_CLIENT_L ? (
              <Button onClick={() => makeCall(client.TEL_CLIENT_L)}>
                {client.TEL_CLIENT_L}
              </Button>
            ) : (
              <span style={{ fontSize: '12px' }}>Pas d'information</span>
            )}
            {client.TEL_CLIENT_F ? (
              <Button onClick={() => makeCall(client.TEL_CLIENT_F)}>
                {client.TEL_CLIENT_F}
              </Button>
            ) : (
              <span style={{ fontSize: '12px' }}>Pas d'information</span>
            )}   -
            {client.TELCOP_CLIENT_F ? (
              <Button onClick={() => makeCall(client.TELCOP_CLIENT_F)}>
                {client.TELCOP_CLIENT_F}
              </Button>
            ) : (
              <span style={{ fontSize: '12px' }}>Pas d'information</span>
            )}
            -
            {client.TELCOP_CLIENT_L ? (
              <Button onClick={() => makeCall(client.TELCOP_CLIENT_L)}>
                {client.TELCOP_CLIENT_L}
              </Button>
            ) : (
              <span style={{ fontSize: '12px' }}>Pas d'information</span>
            )}
          </Typography>
          <TextField
            margin="dense"
            label="Utilisateur CRM"
            type="text"
            fullWidth
            value={currentUser.COLLABORATOR}
            InputProps={{
              readOnly: true,
            }} />
          <TextField
            margin="dense"
            label="Date de l'appel"
            type="datetime-local"
            fullWidth
            value={currentUser.CALL_DATE}
            onChange={(e) => setCurrentUser({ ...currentUser, CALL_DATE: e.target.value })}
          />
          <InputLabel>Raison</InputLabel>
          <Select
            fullWidth
            value={currentUser.RAISON}
            onChange={(e) => setCurrentUser({ ...currentUser, RAISON: e.target.value })}
          >
            <MenuItem value="Prospection">Prospection</MenuItem>
            <MenuItem value="Formation">Formation en ligne</MenuItem>
            <MenuItem value="Information">Demande d'information</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentUser.DESCRIPTION}
            onChange={(e) => setCurrentUser({ ...currentUser, DESCRIPTION: e.target.value })}
          />

          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Historique des communications
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date et heure</TableCell>
                <TableCell>Commercial</TableCell>
                <TableCell>Raison</TableCell>
                <TableCell>Détails</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communicationHistory.length > 0 ? (
                communicationHistory.map((comm, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(comm.CALL_DATE).toLocaleString()}</TableCell>
                    <TableCell>{comm.COLLABORATOR}</TableCell>
                    <TableCell>{comm.RAISON}</TableCell>
                    <TableCell>{comm.DESCRIPTION}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">Aucun historique de communication trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveUser} color="primary">{editing ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTarifDialog} onClose={() => setOpenTarifDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Tarifs
        </DialogTitle>
        <DialogContent>
          <TableContainer style={{ maxHeight: '80%', overflowY: 'auto', border: '1px solid black' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Famille</TableCell>
                  <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Remise CSPD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tarifs.length > 0 && tarifs.map((t) => (
                  <TableRow >
                    <TableCell>{t.INTITULE_FAM}</TableCell>
                    <TableCell>{t.REMISE_TF}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTarifDialog(false)} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openDialogCalls} >
        <DialogTitle>    Historique des communications</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date et heure</TableCell>
                <TableCell>Commercial</TableCell>
                <TableCell>Raison</TableCell>
                <TableCell>Détails</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communicationHistory.length > 0 ? (
                communicationHistory.map((comm, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(comm.CALL_DATE).toLocaleString()}</TableCell>
                    <TableCell>{comm.COLLABORATOR}</TableCell>
                    <TableCell>{comm.RAISON}</TableCell>
                    <TableCell>{comm.DESCRIPTION}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">Aucun historique de communication trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoriqueDialogCloseCalls} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHistoriqueDialog} onClose={handleHistoriqueDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Historique des commandes client
        </DialogTitle>
        <DialogContent>

          {commandes.map((command) => {

            return (
              <Card sx={{
                height: '100%',
                marginBottom: "20px",
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}>
                <CardContent sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  height: '200px',
                  marginBottom: "20px",
                  padding: '16px',
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2196F3',
                      textShadow: '0 0 8px rgba(33, 150, 243, 0.7)',
                      fontWeight: 'bold',
                      border: '1px solid #2196F3',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    Bon de livraison: {command.NUM_BLC} | {command.DATE_BLC}
                  </Typography>
                  <Typography sx={{ marginTop: '8px' }}>Code Client: {command.CLIENT_BLC}</Typography>
                  <Typography sx={{ marginTop: '8px' }}>Client: {command.ADR_BLC_1}</Typography>
                  <Typography sx={{ marginTop: '8px' }}>Adresses Client: {command.ADR_BLC_2}, {command.ADR_BLC_3}</Typography>
                  <Typography sx={{ marginTop: '8px', fontWeight: 'bold' }}>Total: {command.BLC_TOTAL}</Typography>
                  <IconButton
                    onClick={() => handleCardClick(command)}
                    aria-expanded={expanded === command.NUM_BLC}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#f0f0f0',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardContent>
                <Collapse in={expanded === command.NUM_BLC} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ marginTop: '20px', color: '#0B4C69' }}>
                      Historique des communications
                    </Typography>
                    <Table sx={{ marginTop: '16px', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#0B4C69', color: 'white', fontWeight: 'bold', borderRadius: '4px 4px 0 0' }}>Article</TableCell>
                          <TableCell sx={{ backgroundColor: '#0B4C69', color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                          <TableCell sx={{ backgroundColor: '#0B4C69', color: 'white', fontWeight: 'bold' }}>Pu TTC</TableCell>
                          <TableCell sx={{ backgroundColor: '#0B4C69', color: 'white', fontWeight: 'bold' }}>Quantité</TableCell>
                          <TableCell sx={{ backgroundColor: '#0B4C69', color: 'white', fontWeight: 'bold', borderRadius: '0 0 4px 4px' }}>Montant TTC</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {articles.length > 0 && articles.map((article, index) => (
                          <TableRow
                            key={article.BLCL_ARTICLE}
                            sx={{
                              backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                              '&:hover': {
                                backgroundColor: '#f1f1f1',
                              },
                            }}
                          >
                            <TableCell>{article.BLCL_ARTICLE}</TableCell>
                            <TableCell>{article.BLC_DES_ART}</TableCell>
                            <TableCell>{article.BLCL_PXU_TTC}</TableCell>
                            <TableCell>{article.BLCLQTE_L}</TableCell>
                            <TableCell>{article.BLCL_MONTANT_TTC}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoriqueDialogClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New Message</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              placeholder="To:"
              value={boiteMail}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              placeholder="Subject:"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Type your message"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" style={{
                cursor: 'pointer',
                color: '#3477d3',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AttachFileIcon />
                Attach files
              </label>
              {fileNames.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">
                    Selected files:
                  </Typography>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {fileNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Catalog File</InputLabel>
              <Select
                value={selectedCatalogFile}
                onChange={(e) => setSelectedCatalogFile(e.target.value)}
              >
                {catalogFiles.map((file) => (
                  <MenuItem key={file.FILE_NAME} value={file.FILE_NAME}>
                    {file.FILE_NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions >
            <Button
              style={{ fontSize: '15px', color: 'white', backgroundColor: '#3477d3', width: '120px', textAlign: 'center', height: '40px' }}
              onClick={handleSendCode}
            >
              Envoyé <SendIcon style={{ marginLeft: '10px' }} />
            </Button>
            <Button onClick={handleClose} style={{ fontSize: '15px' }} color="primary">
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </CustomCardWrapper>
  );
}


const CardContainer = ({ searchTerm, selectedClientType, selectedTri }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);
  const fetchPart = async () => {
    const URL = `${BASE_URL}/api/${selectedClientType}`;

    setLoading(true);
    try {
      const params = {
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
        selectedTri: selectedTri
      };

      if (user.ROLE === "collaborateur" && selectedClientType === "clientsCspd") {
        params.repres = user.COMMERCIAL_OK;
      }
      const response = await axios.get(URL, { params });
      setClients(response.data.clients);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching the clients!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPart();
  }, [page, pageSize, searchTerm, selectedClientType, selectedTri]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ overflowY: 'auto', maxHeight: 'auto' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {clients.map(client => (
          <CustomCard
            key={client.ID_CLIENT}
            client={client}
            selectedClientType={selectedClientType}
            user={user}
            CODE_CLIENT={client.CODE_CLIENT} 
          />
        ))}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          padding: '8px 16px',
          zIndex: 1000,
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 150, 200]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
};
export default CardContainer;

