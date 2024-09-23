import React, { useEffect, useState } from 'react';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import RenderStockGros from './renderStock';
import Stock from './Stock';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { InputLabel, MenuItem, Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import BASE_URL from './constantes';
import dateIcon from './icons/NAISS.png';
import addressIcon from './icons/address.png';
import midbattery from './icons/batterie orangé.png';
import blockedIcon from './icons/blockedCli.png';
import cardIcon from './icons/credit-card.png';
import fullbattery from './icons/full-battery.png';
import matricule from './icons/id-card.png';
import emptybattery from './icons/low-battery.png';
import priceIcon from './icons/money.png';
import personIcon from './icons/person.png';
import call from './icons/telephone_724664.png';
import userIcon from './icons/user.png';
import { getArticleById } from "./Api";
import { FormControlLabel, Radio } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';


const CommandesList = ({ base, type, searchTerm }) => {
  const theme = useTheme();
  const [openedHistoryCommand, setOpenedHistoryCommand] = useState();
  const [errorLivraison, setErrorLivraison] = useState('');
  const [loading, setLoading] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [articles, setArticles] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const user = useSelector((state) => state.user);
  const [detailsCommunication, setDetailsCommunication] = useState('');
  const [transporteurs, setTransporteurs] = useState([])
  const [modeLiv, setModeLiv] = useState([])
  const [modePay, setModepay] = useState([])
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dateLivraisonPrevue, setDateLivraisonPrevue] = useState('');
  const [communications, setCommunications] = useState({});
  const [tarifs, setTarifs] = useState([])
  const [openTarifDialog, setOpenTarifDialog] = useState(false)
  const [historyDialog, setHistoryDialog] = useState(false)
  const [modeLivraison, setModeLivraison] = useState('');
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [transporteur, setTransporteur] = useState('');
  const [beneficiaire, setBeneficiaire] = useState('');
  const [matriculeFiscale, setMatriculeFiscale] = useState('');
  const [adresseFacturation, setAdresseFacturation] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [numCheque, setNumCheque] = useState('');
  const [banque, setBanque] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [commandTocom, setCommandTocom] = useState("")
  const [openCommSuccess, setOpenCommSuccess] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [commandToCancel, setCommandToCancel] = useState(null);
  const [expandedClient, setExpandedClient] = useState(null);
  const [isArticleDialogOpened, setArticleDialogOpened] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const handleChangePage = (newPage) => setPage(newPage);


  const resetForm = () => {
    setDateTime('');
    setDetailsCommunication('');
    setAdresseFacturation('');
    setAdresseLivraison('');
    setBanque('');
    setBeneficiaire('');
    setDateEcheance('');
    setMatriculeFiscale('');
    setModeLivraison('');
    setNumCheque('');
    setModePaiement('');
    setDateLivraisonPrevue('');
  }    

  useEffect(() => {
    Promise.all(commandes.map(async (command) => {
      return await axios.get(
        `${BASE_URL}/api/getComCmd`, {
        params: {
          id: command.NUM_CDE_C
        }
      }
      );
    })).then((communicationsResult) => {
      setCommunications(
        communicationsResult.reduce((result, communication) => {
          if (communication.data.length) {
            result[communication.data[0].REF_COMMANDE] = communication.data;
          }
          return result;
        }, {}));
    })
  }, [commandes]);


  const fetchArticleDetails = async (codeArticle) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/articles', {
        params: { searchTerm: codeArticle }
      });
      const foundArticle = response.data.articles[0]; 
      setSelectedArticle(foundArticle);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'article', error);
    } finally {
      setLoading(false);
    }
  };

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


  const CustomCardActions = styled(CardActions)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
    height: '50px',

  }));

  const getGridSizes = (command) => {
    if (expanded === command.NUM_CDE_C) {
      return { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
    } else {
      return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
    }
  };

  const formatDateTr = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const fetchCommandes = async () => {
    try {
      const url = type === "partenaire" ? 
      `${BASE_URL}/api/cmdPartenairesEncours` : type === "investisseur" ? 
      `${BASE_URL}/api/cmdInvestisseursEncours` : 
      `${BASE_URL}/api/cmdClientsEncours/${base}`
      const params = {
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm

      };
      const result = await axios.get(url, { params });
      setCommandes(result.data.commandes);
      setTotal(result.data.total);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  };
  
  const handleCardClick = async (command) => {
    setExpanded(prev => (prev === command.NUM_CDE_C ? null : command.NUM_CDE_C));
    console.log("commandId", command.NUM_CDE_C);

    try {
      const result = await axios.get(`${BASE_URL}/api/articlescmdEncours`, {
        params: {
          reference: command.NUM_CDE_C,
          base: base
        }
      });
      console.log("resultcmd", result)
      setArticles(result.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/api/communicationsCmd`);
        console.log("com", result.data)
      } catch (error) {
        console.error('Error fetching communications:', error);
      }
    };

    axios.get(`${BASE_URL}/api/modeLivraison`)
      .then(response => setModeLiv(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/modePaiement`)
      .then(response => setModepay(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/transporteur`)
      .then(response => setTransporteurs(response.data))
      .catch(error => console.error('Error fetching data:', error));
    fetchCommandes();
    fetchCommunications();
  }, [page, pageSize, searchTerm]);
  const handleSaveCommunication = async () => {
    // Clear previous errors
    setErrorLivraison('');
    resetForm();

    // Check if a date has been selected
    if (!dateLivraisonPrevue) {
      console.log("Erreur : dateLivraisonPrevue est vide");
      setErrorLivraison('Veuillez sélectionner une date de livraison.');
      return; // Prevent further execution if validation fails
    }

    try {
      // Check if commandTocom is not an empty string and has necessary properties
      if (commandTocom && commandTocom.NUM_CDE_C) {
        // Make the POST request to save or update communication details_CDE_C) {
        const response = await axios.post(`${BASE_URL}/api/UpdateOrCreateComCmd`, {
          ref_commande: commandTocom.NUM_CDE_C,
          commercial: user.LOGIN,
          statut: "Validation commerciale",
          datetime: dateTime,
          details_communication: detailsCommunication,
          mode_livraison: modeLivraison.ID,
          adresse_livraison: adresseLivraison,
          transporteur: transporteur.ID,
          beneficiaire: beneficiaire,
          matricule_fiscale: matriculeFiscale,
          adresse_facturation: adresseFacturation,
          mode_paiement: modePaiement.ID,
          num_cheque: numCheque,
          banque: banque,
          date_echeance: dateEcheance,
          base: base,
          dateLivraisonPrevue,
        });

        // Check if the response contains the expected message
        if (response.data && response.data.message) {
          console.log('Communication enregistrée avec succès:', response.data.message);
          setOpenCommSuccess(true);
          await fetchCommandes(); // Await fetchCommandes if it's an async function
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } else {
        console.error('Command to communicate is not properly defined');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la communication:', error);
    } finally {
      // Reset form fields and close dialog regardless of success or error
      setOpenDialog(false);
      setDateTime('');
      setDetailsCommunication('');
      setAdresseFacturation('');
      setAdresseLivraison('');
      setBanque('');
      setBeneficiaire('');
      setDateEcheance('');
      setMatriculeFiscale('');
      setModeLivraison('');
      setNumCheque('');
      setModePaiement('');
    }
  };

  const handleConfirmCancel = async () => {
    if (commandToCancel) {
      try {
        await axios.put(
          `${BASE_URL}/api/updateEtatCmd`,
          { reference: commandToCancel.NUM_CDE_C, etat: "Annulée", base: base }
        );


      } catch (err) {
        console.error('Erreur lors de l\'annulation de la commande:', err);

      }
      setOpenCancelDialog(false);
      setCommandToCancel(null);
      fetchCommandes()
    }
  };
  const handleOpenDialog = async (command) => {
    setCommandTocom(command)
    setBeneficiaire(command.CC_UTILIS || '');
    setMatriculeFiscale(
      `${command.CL_MAT_F1 || ''} ${command.CL_MAT_F2 || ''} ${command.CL_MAT_F3 || ''} ${command.CL_MAT_F4 || ''}`.trim()
    );
    setAdresseFacturation(
      `${command.ADR_C_C_2 || ''}, ${command.ADR_C_C_3 || ''}`.trim()
    );
    setOpenDialog(true);
    console.log("cmd", command)

    setDateTime(new Date().toISOString().slice(0, 16));
    if (!command.CC_CHAMP_3) {
      try {
        console.log("start")

        await axios.put(
          `${BASE_URL}/api/updateEtatCmd`,
          { reference: command.NUM_CDE_C, etat: "En cours de traitement", base: base }
        );


      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
  };
  
  const handleTarifDialogOpen = async (command) => {

    try {
      console.log("client", command.CODE_CLIENT)

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

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '-';
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleCloseSuccessDialog = () => {
    setOpenCommSuccess(false);
  };

  const makeCall = (tel) => {
    window.location.href = `sip:${tel.replace(/[^0-9]+/g, '')}`;
  };

  const handleOpenCancelDialog = (command) => {
    setCommandToCancel(command);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCommandToCancel(null);
  };

  
  const handleOpenHistoriqueDialog = (command) => {
    setOpenedHistoryCommand(command.NUM_CDE_C);
    setHistoryDialog(true)
  };

  const openDialogIfNeeded = (command) => {
    // Fetch data without immediately opening the dialog
    handleOpenHistoriqueDialog(command);
  };
  

  const handleClientClick = (commandId) => {
    setExpandedClient(prev => (prev === commandId ? null : commandId));
  };

  

  const openArticleDialog = (articleId) => {
    if (articleId) {
      getArticleById(articleId, 'cspd').then((article) => {
        setSelectedArticle(article);
        setArticleDialogOpened(true);
      }); // Use CODE_ARTICLE from the article parameter
    } else {
      console.error("Mismatch between CCL_ARTICLE and CODE_ARTICLE, or article is undefined");
    }
  };
  const handleCloseArticleDialog = () => {
    setArticleDialogOpened(false);
  };

  {/*const handleOpenHistoriqueDialog = async (command) => {
  try {
    setTargetCommand(command);
    setHistoryDialog(true); // Optionally open the dialog
  } catch (error) {
    console.error('Error fetching communications:', error);
  }
};*/}

  return (

    <Grid container spacing={2} >
      {commandes.map((command) => {
        const etat = command.NUM_CDE_CL ? 'Livré' : command.CC_CHAMP_3 ? command.CC_CHAMP_3 : "Non encore traité"
        const etatColor = etat === "Non encore traité" ? "red" : etat === "En cours de traitement" ? "orange" : etat === "Trait@" ? "green" : etat === "Annul@e" ? "purple" : "blue";
        const isClientDetailsVisible = expandedClient === command.NUM_CDE_C;
        console.table([{ etat, etatColor, numCl: command.NUM_CDE_CL, champ3: command.CC_CHAMP_3 }]);

        return (
          <Grid
            item
            xs={getGridSizes(command).xs}
            sm={getGridSizes(command).sm}
            md={getGridSizes(command).md}
            lg={getGridSizes(command).lg}
            xl={getGridSizes(command).xl}
            key={command.NUM_CDE_C}
          >
            <Card style={{ backgroundColor: 'white', borderRadius: '10px', border: 'transparent', height: '100%' }}
              sx={{
                height: !isClientDetailsVisible ? '100%' : '650px',
                transition: 'height 0.3s ease-in-out'
              }}
            >
              <CardContent sx={{ cursor: 'pointer', position: 'relative', height: type === "partenaire" ? '400px' : '420px', marginBottom: "20px" }}>
                <GlowingBox style={{ backgroundColor: etatColor, borderRadius: '10px' }}>
                  <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    style={{
                      color: "white",
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '1.1rem',

                    }}
                  > {etat}</Typography>
                </GlowingBox>
                <Typography variant="h6" style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>

                  <img src={cardIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
                  Commande: {command.NUM_CDE_C}</Typography>


                {type === "partenaire" && (
                  <>

                  </>
                )}

                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                  <img src={dateIcon} alt="date icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
                  Date: {formatDate(command.DATE_CDE_C)} {command.CC_CHAMP_6}
                </Typography>
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: '10px', color: command.BLOQUER_CLIENT === 1 ? "red" : "green", fontWeight: "bold" }} onClick={() => handleClientClick(command.NUM_CDE_C)}>
                  <img src={command.BLOQUER_CLIENT === 1 ? blockedIcon : personIcon} alt="status icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
                  Client: {command.CLIENT_CDE}, {command.ADR_C_C_1}
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
                    onClick={() => handleClientClick(command.NUM_CDE_C)}
                  >
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>Mode de règlement:</strong> {command.LIBEL_REGL_C}
                    </Typography>
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>{command.CL_CHAMP_11}</strong>
                    </Typography>
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>Échéance:</strong> {command.ECHEANCE_REG_C}
                    </Typography>
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>Encours client:</strong> {/*command.ENCOURSREG*/}{Number(command.ENCOURSREG) + Number(command.SOLDE_CLIENT) + Number(command.BLNONFACT)}
                    </Typography>
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>Encours autorisé:</strong> {command.ENCOURS_MAX_C}
                    </Typography>
                    <Typography style={{ display: "flex", alignItems: "center", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
                      <strong>Encours supp:</strong> {command.ENCOURS_SUPP}
                    </Typography>

                  </Box>
                )}
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}><img src={addressIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />Adresse Client:  {command.ADR_C_C_2} ,{command.ADR_C_C_3}</Typography>
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}><img src={priceIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />Total: {command.CC_TOTAL} TND</Typography>
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}><img src={matricule} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />Matricule : {command.ADR_C_C_3}</Typography>
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: "10px",
                    color: '#545454',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}>
                  <img
                    src={call}
                    alt="person icon"
                    style={{ marginRight: 8, width: "25px", height: "25px" }}
                  />    Numéro: <Button onClick={() => makeCall(command.TEL_CLIENT_F)} >
                    {command.TEL_CLIENT_F} </Button>
                </Typography>
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}><img src={userIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />Traité par : {command.CC_CHAMP_7} le {formatDateTr(command.DATETRAIT)}</Typography>
                <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}><img src={personIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />Date livraison prévue :  {communications[command.NUM_CDE_C]?.find(communication => communication.DATELIVRAISONPREVUE?.length)?.DATELIVRAISONPREVUE ? (
                  <span style={{ color: 'red' }}>
                    {communications[command.NUM_CDE_C]?.find(communication => communication.DATELIVRAISONPREVUE?.length)?.DATELIVRAISONPREVUE}
                  </span>
                ) : (
                  ' '
                )}</Typography>
                <IconButton
                  onClick={() => handleCardClick(command)}
                  aria-expanded={expanded === command.NUM_CDE_C}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}> Articles commandés </Typography>

                </IconButton>
              </CardContent>
              <Collapse in={expanded === command.NUM_CDE_C} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Article</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Description</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Pu TTC</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Quantité</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Montant TTC</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Mode de paiement</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Quantité cmd clients</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Quantité cmd fournisseurs</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Date réception prv</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Remise</TableCell>
                        <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Disponibilité</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles.length > 0 && articles.map((cardItem) => {

                        //const difference = (Number(article.STOCK_PHYSIQUE ) + Number(article.STOCK_AUT_DEPOT)) + Number(article.QTE_CMD_ANNUL) - (Number(article.CDES_CLIENTS));
                        //console.log("difference",difference)
                        const difference = (Number(cardItem.STOCK_PHYSIQUE) - Number(cardItem.CDES_CLIENTS));

                        return (
                          <TableRow key={cardItem.CCL_ARTICLE}>
                            <TableCell>
                              <Button onClick={() => openArticleDialog(cardItem?.CCL_ARTICLE)}>{cardItem.CCL_ARTICLE}</Button>
                            </TableCell>

                            <TableCell>{cardItem.CCL_DES_ART}</TableCell>          
                            <TableCell>{cardItem.CCL_PXU_TTC}</TableCell>
                            <TableCell>{cardItem.CCL_QTE_C}</TableCell>
                            <TableCell>{cardItem.CCL_MONTANT_TTC}</TableCell>
                            <TableCell>{command.LIBEL_REGL_C}</TableCell>
                            <TableCell>{cardItem.CDES_CLIENTS}</TableCell>
                            <TableCell>{cardItem.CDES_FOURNIS}</TableCell>
                            <TableCell> {formatDate(cardItem.LATEST_DATE_LIV_CF_P)}</TableCell>
                            <TableCell>
                              {[
                                { keyword: "OZKA", amount: 30 },
                                { keyword: "OTANI", amount: 35 },
                                { keyword: "STARMAXX", amount: 30 },
                                { keyword: "STIP", amount: 22.17 },
                                { keyword: "PETLAS", amount: 30 },
                                { keyword: "KUMHO", amount: 33 },
                                { keyword: "SIOC", amount: 20 },
                                { keyword: "ZEETEX", amount: 28 },
                              ].some(({ keyword, amount }) =>
                                ((cardItem.CCL_ARTICLE && cardItem.CCL_ARTICLE.includes(keyword)) ||
                                  (cardItem.CCL_DES_ART && cardItem.CCL_DES_ART.includes(keyword))) &&
                                cardItem.CCL_TX_REM === amount
                              ) ? "Comptant" : "à termes"}
                            </TableCell>
                            <TableCell>
                              {/*difference*/}
                              <img
                                src={
                                  difference <= 0
                                    ? emptybattery
                                    : difference <= 8
                                      ? midbattery
                                      : fullbattery
                                }
                                alt={
                                  difference <= 0
                                    ? 'Empty Battery'
                                    : difference <= 8
                                      ? 'Mid Battery'
                                      : 'Full Battery'
                                }
                                style={{ width: '24px', height: '24px' }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              <CustomCardActions>
                <Button startIcon={<CallIcon />} color="primary" onClick={() => handleOpenDialog(command)} style={{ marginTop: !isClientDetailsVisible ? "4%" : '40%', fontSize: "10px", fontWeight: "bold" }} disabled={command.CC_CHAMP_7 && command.CC_CHAMP_7 !== user.LOGIN}>
                  Appeler
                </Button>
                <Button startIcon={<HistoryIcon />} onClick={() => handleOpenHistoriqueDialog(command)} style={{ marginTop: !isClientDetailsVisible ? "4%" : '40%', fontWeight: "bold", color: "#478CCF", fontSize: "10px", }} >
                  Historique
                </Button>
                <Button startIcon={<LocalAtmIcon />} onClick={() => handleTarifDialogOpen(command)} style={{ marginTop: !isClientDetailsVisible ? "4%" : '40%', fontWeight: "bold", fontSize: "10px", color: "#478CCF" }} >
                  tarifs
                </Button>
                {!command.NUM_CDE_CL && etat !== "Traité" && (
                  <Button
                    startIcon={<CancelIcon />}
                    style={{ marginTop: !isClientDetailsVisible ? "4%" : '60%', fontWeight: "bold", color: "red", fontSize: "10px" }}
                    onClick={() => handleOpenCancelDialog(command)}
                  >
                    Annuler
                  </Button>
                )}
                {/* <Button startIcon={<CheckCircleIcon />} color="success">
                  Validation commercial
                </Button> */}
              </CustomCardActions>
            </Card>
          </Grid>
        );
      })}
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
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Annuler la commande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler cette commande ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            NON
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary">
            OUI
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={historyDialog} onClose={() => setHistoryDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Historique de Communication
          <Button onClick={() => setHistoryDialog(false)} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 1, width: '100%' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Historique communication
            </Typography>
            <TableContainer >
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

                    }}>Collaborateur</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Mode de livraison</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Addresse de livraison</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Transporteur</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Béneficaire</TableCell>
                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Mode de paiement</TableCell>

                    <TableCell sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',

                    }}>Date de livraison prévue </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {(communications[openedHistoryCommand] ?? []).map((c, i) => (
                    <TableRow key={c.ID + i}>
                      <TableCell>{formatDate(c.DATETIME)}</TableCell>
                      <TableCell>{c.DETAILS_COMMUNICATION}</TableCell>
                      <TableCell>{c?.COMMERCIAL}</TableCell>
                      <TableCell>{c?.MODE_LIV}</TableCell>
                      <TableCell>{c.ADRESSE_LIVRAISON}</TableCell>
                      <TableCell>{c.TRANSP}</TableCell>
                      <TableCell>{c?.BENEFICIAIRE}</TableCell>
                      <TableCell>{c?.MODE_PAY}</TableCell>
                      <TableCell>{c?.DATELIVRAISONPREVUE}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          Communication de {commandTocom ? commandTocom.NUM_CDE_C : ''}
          <Button onClick={handleCloseDialog} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Saisissez les détails de la communication.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="datetime"
            label="Date/Heure"
            type="datetime-local"
            fullWidth
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="details-communication"
            label="Détails Communication"
            multiline
            rows={4}
            fullWidth
            value={detailsCommunication}
            onChange={(e) => setDetailsCommunication(e.target.value)}
          />
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
            <Typography variant="h6">Détails de livraison</Typography>
            <InputLabel id="select-label-1">Mode de livraison</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              // value={modeLivraison}
              value={modeLivraison}
              onChange={(e) => setModeLivraison(e.target.value)}
              fullWidth
            >
              {modeLiv.map((raison) => (
                <MenuItem key={raison.ID} value={raison}>{raison.LIBELLE}</MenuItem>
              ))}
            </Select>
            {/* <TextField
            margin="dense"
            id="mode-livraison"
            label="Mode de livraison"
            fullWidth 
            value={modeLivraison}
            onChange={(e) => setModeLivraison(e.target.value)}
          /> */}
            <TextField
              margin="dense"
              id="adresse-livraison"
              label="Adresse de livraison"
              fullWidth
              value={adresseLivraison}
              onChange={(e) => setAdresseLivraison(e.target.value)}
            />
            <InputLabel id="select-label-1">Transporteur</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={transporteur}
              onChange={(e) => setTransporteur(e.target.value)}
              fullWidth
            >
              {transporteurs.map((raison) => (
                <MenuItem key={raison.ID} value={raison}>{raison.LIBELLE}</MenuItem>
              ))}
            </Select>

          </Box>
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
            <Typography variant="h6">Facturation </Typography>
            <TextField
              margin="dense"
              id="beneficiaire"
              label="Bénéficiaire"
              value={beneficiaire}
              onChange={(e) => setBeneficiaire(e.target.value)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="matricule-fiscale"
              label="Matricule fiscale"
              value={matriculeFiscale}
              onChange={(e) => setMatriculeFiscale(e.target.value)}
              fullWidth
            />
            <TextField
              margin="dense"
              id="adresse-facturation"
              label="Adresse de facturation"
              value={adresseFacturation}
              onChange={(e) => setAdresseFacturation(e.target.value)}
              fullWidth
            />

            <Typography variant="h6" gutterBottom>
              Date de livraison prévue
            </Typography>
            {errorLivraison && <span style={{ color: 'red' }}>{errorLivraison}</span>}

            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={dateLivraisonPrevue}
              onChange={(e) => {
                setDateLivraisonPrevue(e.target.value);
                setErrorLivraison('');
              }}

            >
              <FormControlLabel value="Indéterminée" control={<Radio />} label="Indéterminée" />
              <FormControlLabel value="Immediatement" control={<Radio />} label="Immediatement" />
              <FormControlLabel value="24 H" control={<Radio />} label="24 H" />
              <FormControlLabel value="48 H" control={<Radio />} label="48 H" />
              <FormControlLabel value="72 H" control={<Radio />} label="72 H" />
            </RadioGroup>

          </Box>
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
            <Typography variant="h6">Détails de paiement</Typography>
            <InputLabel id="select-label-1">Mode de paiement</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={modePaiement}
              onChange={(e) => setModePaiement(e.target.value)}
              fullWidth
            >
              {modePay.map((raison) => (
                <MenuItem key={raison.ID} value={raison}>{raison.LIBELLE}</MenuItem>
              ))}
            </Select>

            {modePaiement.LIBELLE === 'chéque' && (
              <>
                <TextField
                  margin="dense"
                  id="num-cheque"
                  label="Num chéque"
                  fullWidth
                  value={numCheque}
                  onChange={(e) => setNumCheque(e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="banque"
                  label="Banque"
                  fullWidth
                  value={banque}
                  onChange={(e) => setBanque(e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="date-echeance"
                  label="Date échéance"
                  type="date"
                  fullWidth
                  value={dateEcheance}
                  onChange={(e) => setDateEcheance(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            style={{
              color: 'black',
              backgroundColor: 'white',
              transition: 'background-color 0.3s',
              width: '150px',
              height: '40px',
              marginTop: '10px',
              marginLeft: '650px',
            }}
            startIcon={<SaveOutlinedIcon />}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#C4D6E8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            onClick={() => handleSaveCommunication()}
          >
            Enregistrer
          </Button>
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

      <Dialog open={openCommSuccess} onClose={handleCloseSuccessDialog} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#4CAF50', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <CheckCircleOutlineIcon style={{ marginRight: '8px', color: '#fff' }} />
          <Typography variant="h6">Communication enregistrée avec succès</Typography>
          <IconButton aria-label="close" style={{ position: 'absolute', top: '8px', right: '8px', color: '#fff' }} onClick={handleCloseSuccessDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <Typography>Votre communication a été enregistrée avec succès.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary" variant="contained" size="small">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isArticleDialogOpened} onClose={handleCloseArticleDialog} aria-describedby="alert-dialog-slide-description">
        <DialogContent>
          <DialogContentText>
            {loading ? (
              <Typography>Chargement des données...</Typography>
            ) : selectedArticle ? (
              <div>
                       {selectedArticle.CODE_ARTICLE&& (
                        <Typography style={{color:'black'}}>
  <span style={{ color: 'black', fontWeight: 'bold' , color:'#4379F2',marginBottom:'0.5em'}}>Code Article :</span> {selectedArticle.CODE_ARTICLE}
</Typography>
)}
 {selectedArticle.INTIT_ARTICLE&& (
                          <Typography style={{color:'black'}}>
  <span style={{ color: 'black', fontWeight: 'bold' , color:'#4379F2',marginBottom:'0.5em'}}>Description :</span> {selectedArticle.INTIT_ARTICLE}
  </Typography>
)}
{selectedArticle.ART_GR3_DESC&& (
                          <Typography style={{color:'black'}}>
  <span style={{ color: 'black', fontWeight: 'bold' , color:'#4379F2',marginBottom:'0.5em'}}>Vitesse:</span>  {selectedArticle.ART_GR3_DESC}
  </Typography>
)}
{selectedArticle.ART_GR2_DESC&& (
                        <Typography style={{color:'black'}}>
  <span style={{ color: 'black', fontWeight: 'bold' , color:'#4379F2',marginBottom:'0.5em'}}>Charge :</span>  {selectedArticle.ART_GR2_DESC}
  </Typography>
)}
{selectedArticle.INTIT_ART_3 && (
                        <Typography style={{ color: 'black', fontWeight: 'bold' , color:'red',marginBottom:'0.5em'}}>
    {selectedArticle.INTIT_ART_3}
  </Typography>
)}
{selectedArticle.INTIT_ART_2 && (
                          <Typography style={{color:'black'}}>
  <span style={{ color: 'black', fontWeight: 'bold' , color:'#4379F2'}}>NB :</span>  {selectedArticle.INTIT_ART_2}
  </Typography>
)}
 <RenderStockGros article={selectedArticle} />  

 {selectedArticle.file && (
            <Box
              component="img"
              alt={selectedArticle.INTIT_ARTICLE}
              src={`https://api.click.com.tn/imgmobile/${selectedArticle.file}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '16px',
              }}
            />
          )}  </div>
            ) : (
              <Typography>Aucune donnée disponible pour cet article.</Typography>
            )}
                  

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseArticleDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CommandesList;
