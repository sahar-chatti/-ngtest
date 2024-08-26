import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions,Autocomplete, Button, Typography, IconButton, Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CallIcon from '@mui/icons-material/Call';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
const CommandesList = () => {
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [articles, setArticles] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dateTime, setDateTime] = useState('');

  const [detailsCommunication, setDetailsCommunication] = useState('');
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const result = await axios.get('http://41.226.2.230:3200/api/cmdPartenairesEncours');
        setCommandes(result.data);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    };

    fetchCommandes();
  }, []);

  const handleCardClick = async (commandId) => {
    setExpanded(prev => (prev === commandId ? null : commandId));
console.log("commandId",commandId)
    if (!articles[commandId]) {
      try {
        const result = await axios.get('http://41.226.2.230:3200/api/articlescmdEncours', {
          ref: commandId
        });
        setArticles( result.data );
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
  };
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

  const handleModePaiementChange = (event, value) => {
    setModePaiement(value);
    if (value !== 'chéque') {
      setNumCheque('');
      setBanque('');
      setDateEcheance('');
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleCloseDialog = () => setOpenDialog(false);
  
  const handleSaveCommunication = async (command) => {
    // if (client && selectedQualification && selectedRaison && detailsCommunication) {
    //   try {
    //     console.log("start create");
    //     await axios.post(
    //       `http://41.226.2.230:3200/api/CreateCommunication`,
    //       {
    //         ID_PARTENAIRE: client.ID_PARTENAIRE,
    //         ID_STATUT: selectedQualification.UPDATE_STATUS,
    //         ID_RAISON: selectedRaison.ID_RAISON,
    //         ID_QUALIFICATION: selectedQualification.ID_QUALIFICATION,
    //         DATE_COMMUNICATION: dateTime,
    //         DETAILS_COMMUNICATION: detailsCommunication
    //       }
    //     );
    //     console.log("end");
    //     await axios.put(
    //       `http://41.226.2.230:3200/api/updatePartStatus`,
    //       { id: client.ID_PARTENAIRE, id_statut: selectedQualification.UPDATE_STATUS }
    //     );
    //     setOpenCommSuccess(true);
    //   } catch (error) {
    //     console.error('Error updating partenaire:', error);
    //   }
    // }
  
    setOpenDialog(false);
    setDateTime('');
    setDetailsCommunication('');
    
  };
  

  const handleOpenDialog = async (client) => {
   

    
    setDateTime(new Date().toISOString().slice(0, 16));
    setOpenDialog(true);
 
  };
    return (
      <Grid container spacing={2}>
        {commandes.map((command) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={command.NUM_CDE_C}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ cursor: 'pointer', position: 'relative', height: '200px',marginBottom:"20px" }}>
                <Typography variant="h6">Commande: {command.NUM_CDE_C}</Typography>
                <Typography>État: {command.ETAT_CDE_C}</Typography>
                <Typography>Code Partenaire: {command.CLIENT_CDE}</Typography>
                <Typography>Partenaire: {command.CC_UTILIS}</Typography>
                <Typography>Date: {formatDate(command.DATE_CDE_C)}</Typography>
                <Typography>Client: {command.ADR_C_C_1}</Typography>
                <Typography>Adresses Client: {command.ADR_C_C_2}, {command.ADR_C_C_3}</Typography>
                <Typography>Total: {command.CC_TOTAL}</Typography>
                <IconButton
                  onClick={() => handleCardClick(command.NUM_CDE_C)}
                  aria-expanded={expanded === command.NUM_CDE_C}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardContent>
              <Collapse in={expanded === command.NUM_CDE_C} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Article</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Quantité</TableCell>
                        <TableCell>Montant TTC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles[command.NUM_CDE_C] && articles[command.NUM_CDE_C].map((article) => (
                        <TableRow key={article.CCL_ARTICLE}>
                          <TableCell>{article.CCL_ARTICLE}</TableCell>
                          <TableCell>{article.CCL_DES_ART}</TableCell>
                          <TableCell>{article.CCL_QTE_C}</TableCell>
                          <TableCell>{article.CCL_MONTANT_TTC}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
              <CardActions>
                <Button startIcon={<CallIcon />} color="primary" onClick={handleOpenDialog()}>
                  Appeler
                </Button>
                <Button startIcon={<CheckCircleIcon />} color="success">
                  Validation commercial
                </Button>
              </CardActions>
            </Card>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        Communication de {}
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
          <TextField
            margin="dense"
            id="mode-livraison"
            label="Mode de livraison"
            fullWidth
            value={modeLivraison}
            onChange={(e) => setModeLivraison(e.target.value)}
          />
          <TextField
            margin="dense"
            id="adresse-livraison"
            label="Adresse de livraison"
            fullWidth
            value={adresseLivraison}
            onChange={(e) => setAdresseLivraison(e.target.value)}
          />
          <TextField
            margin="dense"
            id="transporteur"
            label="Transporteur"
            fullWidth
            value={transporteur}
            onChange={(e) => setTransporteur(e.target.value)}
          />
        </Box>
        <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
          <Typography variant="h6">Facturation</Typography>
          <TextField
            margin="dense"
            id="beneficiaire"
            label="Bénéficiaire"
            fullWidth
            value={beneficiaire}
            onChange={(e) => setBeneficiaire(e.target.value)}
          />
          <TextField
            margin="dense"
            id="matricule-fiscale"
            label="Matricule fiscale"
            fullWidth
            value={matriculeFiscale}
            onChange={(e) => setMatriculeFiscale(e.target.value)}
          />
          <TextField
            margin="dense"
            id="adresse-facturation"
            label="Adresse de facturation"
            fullWidth
            value={adresseFacturation}
            onChange={(e) => setAdresseFacturation(e.target.value)}
          />
        </Box>
        <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
          <Typography variant="h6">Détails de paiement</Typography>
          <Autocomplete
            options={['espèce', 'traite', 'chéque', 'virement']}
            renderInput={(params) => <TextField {...params} label="Mode de paiement" />}
            value={modePaiement}
            onChange={handleModePaiementChange}
            fullWidth
          />
          {modePaiement === 'chéque' && (
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
          onClick={() => handleSaveCommunication(command )}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
          </Grid>
        ))}
      </Grid>
    );
  };

export default CommandesList;
