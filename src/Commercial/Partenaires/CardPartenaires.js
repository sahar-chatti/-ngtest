import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import TablePagination from '@mui/material/TablePagination';
import { Select, MenuItem, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import CallIcon from '@mui/icons-material/Call';
import DescriptionIcon from '@mui/icons-material/Description';
import { Grid } from '@mui/material';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  FormHelperText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BASE_URL from '../../Utilis/constantes';
import entete from '../../images/sahar up.png';
import HistoryIcon from '@mui/icons-material/History';
import { CalendarIcon } from '@mui/x-date-pickers';


const GlowingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  padding: '10px',
  '&:hover': {
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
  },
}));

const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  height: '380px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'auto',
}));
const CustomCardActions = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  height: '50px',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
}));

const GreenButton = styled(CustomButton)(({ theme }) => ({
  color: theme.palette.success.main,
  '& .MuiButton-startIcon': {
    color: theme.palette.success.main,
  },
}));

function CustomCard({ client, user, fetchPart }) {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [details, setDetails] = useState('');
  const [SelectValue1, setSelectValue1] = useState('');
  const [SelectValue2, setSelectValue2] = useState('');
  const [dSelectValue2, setSelectValue3] = useState('');
  const [detailsCommunication, setDetailsCommunication] = useState('');
  const [raisonList, setRaisonList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);
  const [selectedPartenaire, setSelectedPartenaire] = useState('');
  const [selectedQualification, setSelectedQualification] = useState("")
  const [selectedRaison, setSelectedRaison] = useState("")
  const [statuts, setStatus] = useState([])
  const [params, setParams] = useState([])
  const [filteredQualificationList, setFilteredQualificationList] = useState([]);
  const [contrat, setContrat] = useState(client.CONTRAT);
  const [selectedFile, setSelectedFile] = useState(null)
  const contratUrl = client.CONTRAT ? `http://192.168.1.195/api/Requests/contrat_partenaires/${client.CONTRAT}` : null;
  const [list, setList] = useState([])
  const [cv, setCv] = useState(client.CV);
  const [selectedCv, setSelectedCv] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [enteteBase64, setEnteteBase64] = useState('');
  const [openHistorique, setOpenHistorique] = useState(false);

  const handleOpenHistorique = async (client) => {
    setSelectedPartenaire(client);
    setOpenHistorique(true);

    const coms = await axios.get(
      `${BASE_URL}/api/getComPart`,
      {
        params: {
          id: client.ID_PARTENAIRE
        }
      }
    );
    setCommunications(coms.data);

  };
  const handleCloseHistorique = () => setOpenHistorique(false);
  useEffect(() => {

    convertEnteteToBase64();
  }, []);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("file", file.name)
      setContrat(file.name);
    }
  };

  const convertEnteteToBase64 = () => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      setEnteteBase64(dataURL);
    };
    img.onerror = function (err) {
      console.error('Error loading image for Base64 conversion:', err);
    };
    img.src = entete;
  };
  const handlePrint = (client) => {
    if (!enteteBase64) {
      alert('L\'image d\'en-tête n\'est pas encore chargée.');
      return;
    }
    const printContent = `
      <html>
        <head>
          <img src="${enteteBase64}" alt="En-tête" class="header-image">

          <title>Nouvelle demande de partenariat  - ${client.NOM_PRENOM}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .content {
              padding: 20px;
              margin-top: -800px;
            }
            .info-row {
              margin: 10px 0;
              display: flex;
              align-items: center;

            }
            .label {
              font-weight: bold;
              width: 150px;
              color: #333;
            }
            .value {
              color: black;
            }
           .header-image {
            width: 100%;
            max-height: 100%;
            object-fit: contain;
             }
          </style>
        </head>
        <body>
          <div class="header">

          </div>
          <div class="content">
            <h1>Nouvelle demanade de partenariat  </h1>
            <h3>Détails de profils : </h3>
          <div class="info-row">
              <span class="value">Date demande :${client.DATE_COMMUNICATION}</span>
            </div>
            <div class="info-row">
              <span class="value">Nom et Prénom:${client.NOM_PRENOM}</span>
            </div>
            <div class="info-row">
              <span class="value">Téléphone:${client.NUMERO_TELEPHONE}</span>
            </div>
            <div class="info-row">
              <span class="value">Date de Naissance:${formatDate(client.DATE_NAISSANCE)}</span>
            </div>
            <div class="info-row">
              <span class="value">Adresse:${client.ADRESSE}</span>
            </div>
            <div class="info-row">
              <span class="value">Email:${client.EMAIL}</span>
            </div>
            <div class="info-row">
              <span class="value">Niveau scolaire :${client.NIVEAU_SCOLAIRE} </span>
            </div>
            <div class="info-row">
              <span class="value">Formation :${client.FORMATION}</span>
            </div>
             </div>
           
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', `Fiche_${client.NOM_PRENOM}`);
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    } else {
      console.error('Failed to open print window.');
      alert('Impossible d\'ouvrir la fenêtre d\'impression.');
    }
  };

  const makeCall = () => {
    const sipUrl = `sip:${client.TEL_CLIENT_F}`;
    console.log("SIP URL:", sipUrl);
    window.location.href = sipUrl;
  };

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedCv(file);
      console.log("file", file.name)
      setCv(file.name);
    }
  };
  const handleSaveContrat = async () => {
    if (!selectedFile && !selectedCv) {
      alert('Veuillez télécharger un contrat ou bien cv');
      return;
    }
    try {
      const uploadFile = async (url, formData) => {
        const response = await axios.post(url, formData);
        console.log("response", response)
        if (response.status === 200) {
          return true;
        } else {
          console.error('Erreur lors de l\'envoi du fichier :', response.data.message);
          alert(`Échec de l'enregistrement : ${response.data.message}`);
          return false;
        }
      };
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await axios.put(`${BASE_URL}/api/updatePartContrat`, {
          id: client.ID_PARTENAIRE,
          contrat: selectedFile.name,
        });
        const id = statuts.find((s) => s.AVANCEMENT === 'Contrat signé');
        await axios.put(
          `${BASE_URL}/api/updatePartStatus`,
          { id: client.ID_PARTENAIRE, id_statut: id?.ID_STATUT }
        );
        const contractUploadSuccess = await uploadFile('http://192.168.1.195/api/Requests/upload_contrat.php', formData);
        if (contractUploadSuccess) {
          alert('Contrat enregistré avec succès !');
          fetchPart();
        }
      }
      if (selectedCv) {
        const formDataCv = new FormData();
        formDataCv.append('file', selectedCv);
        await axios.put(`${BASE_URL}/api/updatePartCv`, {
          id: client.ID_PARTENAIRE,
          cv: selectedCv.name
        });
        const cvUploadSuccess = await uploadFile('http://192.168.1.195/api/Requests/upload_cv.php', formDataCv);
        if (cvUploadSuccess) {
          alert('Cv enregistré avec succès !');
          fetchPart();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier :', error);
      alert('Échec de l\'enregistrement du fichier.');
    }
  };

  const handleAcceptPart = async () => {
    const id = statuts.filter((s) => s.AVANCEMENT === 'En cours de signature')
    console.log(id)
    await axios.put(
      `${BASE_URL}/api/updatePartStatus`,
      { id: client.ID_PARTENAIRE, id_statut: id[0]?.ID_STATUT }
    );
    await fetchPart()
    setOpenInfoDialogue(false)
  }
  useEffect(() => {
    axios.get(`${BASE_URL}/api/RaisonsList`)
      .then(response => setRaisonList(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/QualificationAppels`)
      .then(response => setQualificationList(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/raisonQualifications`)
      .then(response => setParams(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/raisonStatuts`)
      .then(response => setList(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/StatutPartenaires`)
      .then(response => setStatus(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [openPartSuccess, setOpenPartSuccess] = useState(false);
  const [openCommSuccess, setOpenCommSuccess] = useState(false);
  const [communications, setCommunications] = useState([])
  const [typeAppel, setTypeAppel] = useState("")
  const handleOpenDialog = async (client, type) => {
    setTypeAppel(type);
    setSelectedPartenaire(client);
    setDateTime(new Date().toISOString().slice(0, 16));
    setOpenDialog(true);
    await axios.put(
      `${BASE_URL}/api/updatePartUser`,
      { id: client.ID_PARTENAIRE }
    );
    console.log("Updated partenaire status");
    const coms = await axios.get(
      `${BASE_URL}/api/getComPart`,
      {
        params: {
          id: client.ID_PARTENAIRE
        }
      }
    );
    console.log("Fetched communications:", coms.data);
    setCommunications(coms.data);
    setSelectedQualification("");
    setSelectedRaison("");
    setDetailsCommunication("");
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleSaveCommunication = async (client) => {
    if (client && selectedQualification && selectedRaison) {
      try {
        console.log("start create");
        await axios.post(
          `${BASE_URL}/api/CreateCommunication`,
          {
            ID_PARTENAIRE: client.ID_PARTENAIRE,
            ID_STATUT: selectedQualification.UPDATE_STATUS,
            ID_RAISON: selectedRaison.ID_RAISON,
            ID_QUALIFICATION: selectedQualification.ID_QUALIFICATION,
            DATE_COMMUNICATION: dateTime,
            DETAILS_COMMUNICATION: detailsCommunication,
            TYPE_APPEL: typeAppel,
            COLLABORATOR: user.LOGIN
          }
        );
        console.log("end");
        await axios.put(
          `${BASE_URL}/api/updatePartStatus`,
          {
            id: client.ID_PARTENAIRE, id_statut: selectedQualification.UPDATE_STATUS, collaborator: user.COLLABORATOR
          }
        );
        await fetchPart()
        setOpenCommSuccess(true);

      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
    setOpenDialog(false);
    setDateTime('');
    setDetailsCommunication('');
    setDetails('');
    setSelectValue1('');
    setSelectValue2('');
    setSelectValue3('');
    setSelectedPartenaire("");
    setSelectedQualification("");
    setSelectedRaison("");
  };
  const [openInfoDialogue, setOpenInfoDialogue] = useState(false)

  const onClose = () => {
    setOpenInfoDialogue(false)
  }
  const cvUrl = client.CV ? `http://192.168.1.195/api/Requests/cv_partenaires/${client.CV}` : null;
  const [messages, setMessages] = useState('');
  const [codeSent, setCodeSent] = useState();
  const handleSendCode = async (e) => {
    let loginmail = (client.NUMERO_TELEPHONE)
    let code = (client.MOT_DE_PASSE)
    let username = (client.NOM_PRENOM)
    return await axios.post('http://192.168.1.170:3200/signin', { email: client.EMAIL, loginmail, username, code }, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': ''
      }
    })
      .then(res => {
        alert(res.data)
        setMessages(res.data);
        setCodeSent(true);
      })
      .catch(error => {
        alert(error)
        setMessages('Error sending verification code');
      });
  }
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setClientToDelete(null);
  };
  const handleConfirmDelete = async () => {
    try {
      await axios.post('http://192.168.1.195/api/Requests/jeux.php?action=delete-profil-part', {
        id: clientToDelete.ID_PARTENAIRE
      });
      await axios.delete(`${BASE_URL}/api/deletePart/${clientToDelete.ID_PARTENAIRE}`);
      fetchPart();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };
  return (
    <CustomCardWrapper style={{ backgroundColor: 'white', borderRadius: '15px', border: 'transparent', height: '100%', width: '100%' }}>
      <CustomCardContent >
        <GlowingBox style={{ backgroundColor: client.COULEUR ? client.COULEUR : "white", borderRadius: '11px' }}>
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
            {client.AVANCEMENT ? client.LIBELLE : client.STATUS ? client.STATUS : "Non encore traité"}
          </Typography>
          {/* Example icon */}
        </GlowingBox>
        <Grid container style={{ display: 'flex', alignItems: 'center' }} >
          <PersonIcon />
          <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
            {client.NOM_PRENOM}
          </Typography>
        </Grid>
        <Typography color="text.secondary" gutterBottom style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <CallIcon />
          <Button onClick={makeCall} variant="text" color="primary" style={{ display: "flex", alignItems: "center", fontWeight: 'bold', fontSize: '16px' }}>
            {client.NUMERO_TELEPHONE} </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <CalendarIcon />
          {formatDate(client.DATE_NAISSANCE)}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <FmdGoodIcon />
          {client.ADRESSE}
        </Typography>
        <Typography id="x" variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <EmailIcon />
          {client.EMAIL}
          <Button onClick={handleSendCode} size="small" style={{ color: '#FF8C00', fontWeight: 'bold', fontSize: '12px', textTransform: 'none' }}>
            Mot de passe oublié
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <HistoryIcon />
          {formatDate(client.DATE_COMMUNICATION)}
        </Typography>
      </CustomCardContent>
      <CustomCardActions>
        <GreenButton
          startIcon={<PhoneForwardedIcon />}
          size="small"
          style={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={() => handleOpenDialog(client, 'appel sortant')}
          disabled={client.AVANCEMENT === "Enregistre"}
        >
          Sortant
        </GreenButton>
        <GreenButton
          startIcon={<PhoneCallbackIcon />}
          size="small"
          style={{
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={() => handleOpenDialog(client, 'appel entrant')}
          disabled={client.AVANCEMENT === "Enregistre"}
        >
          Entrant
        </GreenButton>
        <Button
          startIcon={<DescriptionIcon />}
          size="small"
          style={{
            color: '#FF8C00',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={() => setOpenInfoDialogue(true)}
          disabled={client.AVANCEMENT === "Enregistre"}
        >
          Document
        </Button>
        <Button
          startIcon={<HistoryIcon />}
          size="small"
          style={{
            color: 'red',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={() => handleOpenHistorique(client)}
          disabled={client.AVANCEMENT === "Enregistre"}
        >
          Historique
        </Button>
        <Button
          startIcon={<LocalPrintshopIcon />}
          size="small"
          style={{
            color: '#7695FF',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            marginLeft: 14
          }}
          onClick={() => handlePrint(client)}
          disabled={client.AVANCEMENT === "Enregistre"}
        >
          Imprimer
        </Button>
      </CustomCardActions>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce partenaire?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Non
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Oui
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            if (!dateTime || !selectedRaison || !detailsCommunication || !selectedQualification) {
              return;
            }
          }
          handleCloseDialog();
        }}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          Communication de {client.NOM_PRENOM}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Saisissez les détails de la communication.</DialogContentText>
          <TextField
            required
            error={!dateTime}
            helperText={!dateTime ? "Ce champ est obligatoire" : ""}
            autoFocus
            margin="dense"
            id="datetime"
            label="Date/Heure"
            type="datetime-local"
            fullWidth
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          <InputLabel id="select-label-1" required>Raison d'appel</InputLabel>
          <Select
            required
            error={!selectedRaison}
            labelId="select-label-1"
            id="select-1"
            value={selectedRaison}
            onChange={(e) => setSelectedRaison(e.target.value)}
            fullWidth
          >
            {raisonList.map((raison) => (
              <MenuItem key={raison.ID_RAISON} value={raison}>{raison.LIBELLE}</MenuItem>
            ))}
          </Select>
          {!selectedRaison && <FormHelperText error>Ce champ est obligatoire</FormHelperText>}

          <TextField
            required
            error={!detailsCommunication}
            helperText={!detailsCommunication ? "Ce champ est obligatoire" : ""}
            margin="dense"
            id="details-communication"
            label="Détails Communication"
            multiline
            rows={2}
            fullWidth
            value={detailsCommunication}
            onChange={(e) => setDetailsCommunication(e.target.value)}
          />

          <InputLabel id="select-label-2" required>Qualification d'appel</InputLabel>
          <Select
            required
            error={!selectedQualification}
            labelId="select-label-2"
            id="select-2"
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            fullWidth
          >
            {qualificationList
              .filter((qualification) => {
                const libelleNormalized = qualification.LIBELLE.trim().toLowerCase();
                if (libelleNormalized.includes('accepter par admin')) {
                  return true;
                }
                if (user.ROLE !== 'administrateur' && libelleNormalized.includes('enregistre')) {
                  return false;
                }
                return true;
              })
              .map((qualification) => (
                <MenuItem
                  key={qualification.ID_QUALIFICATION}
                  value={qualification}
                >
                  {qualification.LIBELLE}
                </MenuItem>
              ))
            }
          </Select>
          {!selectedQualification &&
            <FormHelperText error>Ce champ est obligatoire</FormHelperText>
          }
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{
              color: "black",
              backgroundColor: "white",
              transition: "background-color 0.3s",
              width: "150px",
              height: "40px",
              marginTop: "10px",
              marginLeft: "650px",
            }}
            startIcon={<SaveOutlinedIcon />}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#C4D6E8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
            onClick={() => {
              if (dateTime && selectedRaison && detailsCommunication && selectedQualification) {
                handleSaveCommunication(client);
              } else {
                alert("Veuillez remplir tous les champs obligatoires");
              }
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialogue} onClose={onClose} maxWidth="md"
        fullWidth >
        <DialogTitle>
          Plus d'informations
          <Button onClick={onClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ display: "flex", flexDirection: "column" }}>
            <Grid item xs={12} md={12}>
              <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
                <Typography variant="h6">CV</Typography>
                <TextField
                  margin="dense"
                  id="niveau-scolaire"
                  label="Niveau Scolaire"
                  type="text"
                  fullWidth
                  value={client.NIVEAU_SCOLAIRE}
                />
                <TextField
                  margin="dense"
                  id="formations"
                  label="Formations"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  value={client.FORMATION}
                />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    {contratUrl ? (
                      <a href={contratUrl} target="_blank" rel="noopener noreferrer">
                        <TextField
                          margin="dense"
                          id="cv"
                          label="CV"
                          type="text"
                          fullWidth
                          value={cv || "cv non disponible"}
                          style={{ cursor: 'pointer', color: 'blue' }}
                          disabled={!client.CV}
                        />
                      </a>
                    ) : (
                      <TextField
                        margin="dense"
                        id="cv"
                        label="CV"
                        type="text"
                        fullWidth
                        value={cv || "cv non disponible"}
                        disabled
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <IconButton
                      style={{ color: 'blue', width: '100%', height: '100%' }}
                      onClick={() => document.getElementById('cv-input').click()}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                    <input
                      type="file"
                      id="cv-input"
                      style={{ display: 'none' }}
                      onChange={handleCvUpload}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={12} >
              <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
                <Typography variant="h6">Contrat</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    {contratUrl ? (
                      <a href={contratUrl} target="_blank" rel="noopener noreferrer">
                        <TextField
                          margin="dense"
                          id="contrat"
                          label="Contrat"
                          type="text"
                          fullWidth
                          value={contrat || "Contrat non disponible"}
                          style={{ cursor: 'pointer', color: 'blue' }}
                          disabled={!client.CONTRAT}
                        />
                      </a>
                    ) : (
                      <TextField
                        margin="dense"
                        id="contrat"
                        label="Contrat"
                        type="text"
                        fullWidth
                        value={contrat || "Contrat non disponible"}
                        disabled
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <IconButton
                      style={{ color: 'blue', width: '100%', height: '100%' }}
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                    <input
                      type="file"
                      id="file-input"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </Grid>
                  {(user.ROLE === "administrateur" && client.CONTRAT === '') && (
                    <Grid item xs={12} md={5}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        style={{ width: '100%', height: '100%', fontSize: '16px' }}
                        onClick={handleAcceptPart}
                      >
                        Accepter comme partenaire
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
            <DialogActions>
              <Button
                variant="contained"
                size="small"
                style={{
                  color: "black",
                  backgroundColor: "white",
                  transition: "background-color 0.3s",
                  width: "150px",
                  height: "40px",
                  marginTop: "10px",
                }}
                startIcon={<SaveOutlinedIcon />}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#C4D6E8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
                onClick={() => handleSaveContrat(client)}
              >
                Enregistrer</Button>
            </DialogActions>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPartSuccess}
        onClose={() => setOpenPartSuccess(false)}
        PaperProps={{
          style: { borderRadius: 15, padding: '20px' }
        }}
      >
        <DialogTitle style={{ color: '#4CAF50', textAlign: 'center', fontWeight: 'bold' }}>
          Succès
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ textAlign: 'center', fontSize: '16px' }}>
            Partenaire enregistré avec succès.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenPartSuccess(false)}
            variant="contained"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCommSuccess}
        onClose={() => setOpenCommSuccess(false)}
        PaperProps={{
          style: { borderRadius: 15, padding: '20px' }
        }}
      >
        <DialogTitle style={{ color: '#4CAF50', textAlign: 'center', fontWeight: 'bold' }}>
          Succès
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ textAlign: 'center', fontSize: '16px' }}>
            Communication enregistrée avec succès.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setOpenCommSuccess(false)}
            variant="contained"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openHistorique}
        onClose={handleCloseHistorique}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          style: {
            height: 'auto',
            maxHeight: '90vh',
            width: '90%',
            margin: '20px'
          }
        }}
      >
        <DialogContent style={{ padding: '24px' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseHistorique}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Box style={{ width: '100%', height: '100%' }}>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              style={{ marginBottom: '20px' }}
            >
              Historique communication
            </Typography>
            <TableContainer style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    }}>Date communication</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    }}>Détails communication</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    }}>Raison d'appel</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    }}>Qualification d'appel</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    }}>collaborateur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {communications.map((c) => (
                    <TableRow key={c.ID_COMMUNICATION}>
                      <TableCell>{formatDate(c.DATE_COMMUNICATION)}</TableCell>
                      <TableCell>{c.DETAILS_COMMUNICATION}</TableCell>
                      <TableCell>{c?.RAISON}</TableCell>
                      <TableCell>{c?.QUALIFICATION}</TableCell>
                      <TableCell>{c.COLLABORATOR}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
        </DialogActions>
      </Dialog>
    </CustomCardWrapper>
  );
}
function CardContainer({ searchTerm, selectedAvancement, setTotalObj }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user);
  const fetchPart = async () => {
    const URL = user.ROLE === "collaborateur" ? `${BASE_URL}/api/partenaires` : `${BASE_URL}/api/partenaires`
    setLoading(true);
    console.log('clientttt:', URL)
    try {
      const params = {
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
        avancement: selectedAvancement
      };
      if (user.ROLE === "collaborateur") {
        params.user = user.LOGIN;
      }
      const response = await axios.get(URL, { params });
      console.log(response.data)
      let listClient = [...response.data.clients]
      let listFinale = []
      console.log("listClient")
      listClient.map((row) => {
        listFinale.push({ ...row, selectedCli: false, collab: false, })
      })
      console.log("listclient", listFinale)
      setClients(listFinale);
      setTotal(response.data.total);
      setTotalObj("par", response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching the clients!');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPart();
  }, [page, pageSize, searchTerm, selectedAvancement]);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredClients = clients
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box sx={{
        flex: '1 1 auto',
        maxHeight: `100vh`,
        overflowY: 'auto',
        padding: '16px'
      }}>
        <Grid container spacing={2}>
          {filteredClients.map((client, i) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={client.ID_PARTENAIRE}>
              <CustomCard client={client} setClients={setClients} user={user} fetchPart={fetchPart} />
            </Grid>
          ))}
        </Grid>
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
    </Box>
  );
};

export default CardContainer;
