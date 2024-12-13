import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import SmsIcon from '@mui/icons-material/Sms';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import BASE_URL from '../../Utilis/constantes';
const ClientList = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md')); // Check for medium screen size
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false); // État pour gérer l'ouverture du popup
  const [selectedPartner, setSelectedPartner] = useState(null); // État pour stocker les détails du partenaire sélectionné
  const [dateTime, setDateTime] = useState(''); // État pour la date et l'heure de la communication
  const [details, setDetails] = useState(''); // État pour les détails de la communication
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user);
  const [openDialog, setOpenDialog] = useState(false)
  const [communications, setCommunications] = useState([])
  const fetchPartners = async () => {
    const URL = user.ROLE === "collaborateur" ? `${BASE_URL}/api/partenairesCollaborateur` : `${BASE_URL}/api/partenaires`;
    setLoading(true);
    try {
      const params = {
        page: page,
        pageSize: pageSize,

      };

      if (user.ROLE === "collaborateur") {
        params.user = user.LOGIN;
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


  }

  useEffect(() => {
    fetchPartners();
  }, [page, pageSize]);

  const columns = [
    { id: 'ID_PARTENAIRE', label: 'ID Partenaire', minWidth: 100 },
    { id: 'NOM_PRENOM', label: 'Nom Prénom', minWidth: 150 },
    { id: 'NUMERO_TELEPHONE', label: 'Numéro de téléphone', minWidth: 150 },
    { id: 'EMAIL', label: 'Email', minWidth: 200 },
    { id: 'ADRESSE', label: 'Adresse', minWidth: 200 },
    { id: 'MOT_DE_PASSE', label: 'Mot de passe', minWidth: 150 },
    { id: 'DATE_NAISSANCE', label: 'Date de naissance', minWidth: 150 },
    { id: 'USER_IN_CHARGE', label: 'Affecté à', minWidth: 150 },
    { id: 'actions', label: 'Actions', minWidth: 300, align: 'center' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };
  const handleOpenDialog = async (client) => {



    setDateTime(new Date().toISOString().slice(0, 16));
    setOpenDialog(true);
    if (!client.USER_IN_CHARGE) {
      try {
        console.log("start")

        await axios.put(
          `${BASE_URL}/api/updatePartUser`,
          { id: client.ID_PARTENAIRE, USER_IN_CHARGE: user.LOGIN }
        );
        console.log("end")

      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
    const coms = await axios.get(
      `${BASE_URL}/api/getComPart`, {
      params: {
        id: client.ID_PARTENAIRE
      }
    }
    );
    console.log("coms", coms.data)
    setCommunications(coms.data)
  };
  const handleOpen = (partner) => {
    setSelectedPartner(partner);
    setOpen(true);
    // Initialiser les détails de communication avec la date et l'heure actuelles
    const currentDateTime = new Date().toISOString().slice(0, 16);
    setDateTime(currentDateTime);
    setDetails('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPartner(null);
  };

  const handleSaveCommunication = () => {
    // Ici, vous pouvez envoyer les détails de la communication à votre backend ou effectuer toute autre action nécessaire
    console.log('Date/Heure:', dateTime);
    console.log('Détails:', details);

    // Fermer le popup après enregistrement
    setOpen(false);
    setSelectedPartner(null);
  };

  if (loading) {
    return (
      <Container sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  return (
    <Box sx={{ height: '77vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Paper elevation={3} sx={{ flex: '1', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Statut</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Nom Prénom</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Numéro de téléphone</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Email</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Adresse</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Mot de passe</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Date de naissance</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='left'>Affecté à</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }} align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index} hover>
                  <TableCell align='left'> {client.AVANCEMENT ? client.AVANCEMENT : client.STATUS ? client.STATUS : "Non encore traité"}</TableCell>
                  <TableCell align='left'>{client.NOM_PRENOM}</TableCell>
                  <TableCell align='left'>{client.NUMERO_TELEPHONE}</TableCell>
                  <TableCell align='left'>{client.EMAIL}</TableCell>
                  <TableCell align='left'>{client.ADRESSE}</TableCell>
                  <TableCell align='left'>{client.MOT_DE_PASSE}</TableCell>
                  <TableCell align='left'>{client.DATE_NAISSANCE}</TableCell>
                  <TableCell align='left'>{client.USER_IN_CHARGE}</TableCell>
                  <TableCell align='center'>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      {(user.ROLE !== "collaborateur" || (user.ROLE === 'collaborateur' && client.AVANCEMENT === "Acceptation")) && (

                        <Tooltip title="Enregistrer">
                          <IconButton color="primary">
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Appeler">
                        <IconButton color="primary">
                          <PhoneIcon disabled={user.ROLE === "collaborateur" ? client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN : false}
                            style={{
                              backgroundColor: 'white',
                              color: client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN ? 'grey' : 'green',
                            }}
                            onClick={() => handleOpenDialog(client)} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Envoyer un email">
                        <IconButton color="primary">
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Planifier un événement">
                        <IconButton color="primary">
                          <EventIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Envoyer un SMS">
                        <IconButton color="primary">
                          <SmsIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Détails de la Communication
          <IconButton onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remplissez les détails de la communication.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="datetime"
            type="datetime-local"
            fullWidth
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          <TextField
            margin="dense"
            id="details"
            label="Détails Communication"
            multiline
            rows={4}
            fullWidth
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveCommunication} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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

export default ClientList;