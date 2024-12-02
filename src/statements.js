import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Grid, Select, MenuItem, InputLabel,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { PrintOutlined } from '@mui/icons-material';
import BASE_URL from './constantes';
import { useSelector } from 'react-redux';
import entete from '../src/images/sahar up.png';

const Statements = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const [departmentClaims, setDepartmentClaims] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    USER_NAME: '', DEMAND_DATE: '', DEMAND_TYPE: '', DESCRIPTION: '', STATE: '', ETAT: '', PAR: '', COMMENTAIRE: ''
  });
  const [editing, setEditing] = useState(false);
  const [enteteBase64, setEnteteBase64] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchUsers();
    convertEnteteToBase64();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/statements`);
      let filteredUsers;

      if (user?.ROLE === 'administrateur') {
        filteredUsers = response.data;
      } else if (user?.DEPARTEMENT) {
        filteredUsers = response.data.filter(u =>
          u.USER_NAME === user?.LOGIN ||
          u.DEMAND_TYPE === user?.DEPARTEMENT
        );
      } else {
        filteredUsers = response.data.filter(u => u.USER_NAME === user?.LOGIN);
      }

      setUsers(filteredUsers);

      const departmentSpecificClaims = response.data.filter(
        claim => claim.DEMAND_TYPE === user?.DEPARTEMENT && claim.ETAT === 'En cours'
      );
      setDepartmentClaims(departmentSpecificClaims);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Erreur lors de la récupération des demandes.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/deleteStatement/${id}`);
      fetchUsers();
      alert('Demande supprimée avec succès.');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression de la demande.');
    }
  };

  const handleOpenDialog = (userToEdit) => {
    if (userToEdit) {
      setEditing(true);
      setCurrentUser(userToEdit);
    } else {
      setEditing(false);
      setCurrentUser({
        USER_NAME: user?.LOGIN || '',
        DEMAND_DATE: new Date().toISOString().slice(0, 16),
        DEMAND_TYPE: '',
        DESCRIPTION: '',
        STATE: '',
        ETAT: 'En cours',
        PAR: user.LOGIN,
        COMMENTAIRE: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({
      USER_NAME: '', DEMAND_DATE: '', DEMAND_TYPE: '', DESCRIPTION: '', STATE: '', ETAT: '', PAR: '', COMMENTAIRE: ''
    });
    setEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      const requiredFields = ['USER_NAME', 'DEMAND_DATE', 'DEMAND_TYPE', 'DESCRIPTION'];
      const missingFields = requiredFields.filter(field => !currentUser[field]);

      if (missingFields.length > 0) {
        alert(`Veuillez remplir les champs suivants : ${missingFields.join(', ')}`);
        return;
      }

      const apiEndpoint = editing
        ? `${BASE_URL}/api/updateStatement/${currentUser.ID}`
        : `${BASE_URL}/api/createStatements`;

      const apiMethod = editing ? 'put' : 'post';

      const formatDate = (date) => {
        const dateObj = new Date(date);
        const tunisiaTime = new Date(dateObj.getTime() + (1 * 60 * 60 * 1000));
        return tunisiaTime.toISOString();
      };

      const requestData = {
        USER_NAME: currentUser.USER_NAME,
        DEMAND_DATE: formatDate(currentUser.DEMAND_DATE),
        DEMAND_TYPE: currentUser.DEMAND_TYPE,
        DESCRIPTION: currentUser.DESCRIPTION,
        STATE: "",
        ETAT: currentUser.ETAT,
        PAR: user.LOGIN,
        COMMENTAIRE: currentUser.COMMENTAIRE,
      };

      const response = await axios[apiMethod](apiEndpoint, requestData, { timeout: 5000 });

      if (response.status === 201 || response.status === 200) {
        fetchUsers();
        handleCloseDialog();
        //alert(`Demande ${editing ? 'modifiée' : 'ajoutée'} avec succès.`);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      let errorMessage = 'Erreur lors de la sauvegarde de la demande.';
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

  const handlePrint = () => {
    if (!enteteBase64) {
      alert('L\'image d\'en-tête n\'est pas encore chargée.');
      return;
    }
    const printContent = `
      <html>
        <head>
          <title>Réclamation</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .header-image {
              width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            .content {
              padding: 20px;
              margin-top: -800px;
            }
            h1 { color: #ce362c; text-align: center; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0B4C69; color: white; }
          </style>
        </head>
        <body>
          <img src="${enteteBase64}" alt="En-tête" class="header-image">
          <div class="content">
            <h1>Liste des réclamations</h1>
            <table>
              <thead>
                <tr>
                  <th>Date demande</th>
                  <th>Utilisateur CRM</th>
                  <th>Département à reclamer</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td>${new Date(u.DEMAND_DATE).toLocaleString()}</td>
                    <td>${u.USER_NAME}</td>
                    <td>${u.DEMAND_TYPE}</td>
                    <td>${u.DESCRIPTION}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', 'Liste des demandes d\'achat');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  return (
    <>  
        <Grid container spacing={3} sx={{ p: 3 }}>

          <Typography variant="h5" color="primary" fontWeight="bold">
            Gestion des Réclamations
          </Typography>
    
        <Grid item>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: theme.palette.success.main,
                '&:hover': { backgroundColor: theme.palette.success.dark }
              }}
            >
              Nouvelle Réclamation
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                backgroundColor: theme.palette.info.main,
                '&:hover': { backgroundColor: theme.palette.info.dark }
              }}
            >
              Imprimer
            </Button>
          </Stack>
        </Grid>
     

        </Grid>

  
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>N°</TableCell> {/* Nouvelle colonne pour la numérotation */}

              <TableCell>Utilisateur</TableCell>
              <TableCell>Date demande</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Commentaire</TableCell>
              <TableCell>Réceveur</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.length > 0 ? (
              users.map((user,index) => (
                <TableRow key={user.ID}>
<TableCell>{users.length - index}</TableCell>
<TableCell>{user.USER_NAME}</TableCell>
                  <TableCell>{new Date(user.DEMAND_DATE).toLocaleString()}</TableCell>
                  <TableCell>{user.DEMAND_TYPE}</TableCell>
                  <TableCell>{user.DESCRIPTION}</TableCell>
                  <TableCell>
  <Chip 
    label={user.ETAT} 
    sx={{
      backgroundColor: 
        user.ETAT === 'En cours' ? theme.palette.warning.light :
        user.ETAT === 'Récue' ? '#FFEB3B' :  // Yellow background for 'Récue'

        user.ETAT === 'Terminée' ? theme.palette.success.light :
        user.ETAT === 'Annulée' ? theme.palette.error.light : 
        theme.palette.grey[300],
      color: 
        user.ETAT === 'Annulée' || user.ETAT === 'Terminée' 
          ? theme.palette.common.white 
          : theme.palette.text.primary,
      fontWeight: 'bold',
    }} 
  />
</TableCell>
                  <TableCell>{user.COMMENTAIRE}</TableCell>
                  <TableCell color="primary">{user.PAR}</TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.ID)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={handlePrint}>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">Aucune réclamation trouvée.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Modifier la Réclamation' : 'Nouvelle Réclamation'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{marginTop:5}}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom Utilisateur"
                value={currentUser.USER_NAME}
                onChange={(e) => setCurrentUser({ ...currentUser, USER_NAME: e.target.value })}
                disabled={editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date Demande"
                type="datetime-local"
                value={currentUser.DEMAND_DATE}
                onChange={(e) => setCurrentUser({ ...currentUser, DEMAND_DATE: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Département concernée</InputLabel>
              <Select
                fullWidth
                value={currentUser.DEMAND_TYPE}
                onChange={(e) => setCurrentUser({ ...currentUser, DEMAND_TYPE: e.target.value })}
              >
                <MenuItem value="Direction">Direction</MenuItem>

                <MenuItem value="Commercial">Commercial</MenuItem>

                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Comptabilité">Comptabilité</MenuItem>

                <MenuItem value="Import / Export">Import / Export</MenuItem>
                <MenuItem value="Développement">Développement</MenuItem>
                <MenuItem value="Magasin">Magasin</MenuItem>

                <MenuItem value="RH">RH</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={currentUser.DESCRIPTION}
                onChange={(e) => setCurrentUser({ ...currentUser, DESCRIPTION: e.target.value })}
                multiline
                rows={4}
              />
            </Grid>
            {editing && (
  <>
    <InputLabel id="select-label-etat">État</InputLabel>
    <Select
      margin="dense"
      fullWidth
      value={currentUser.ETAT}
      onChange={(e) => setCurrentUser({ ...currentUser, ETAT: e.target.value })}
    >
      <MenuItem value="En cours">En cours</MenuItem>
      <MenuItem value="Récue">Récue</MenuItem>

      <MenuItem value="Terminée">Terminée</MenuItem>
      <MenuItem value="Annulée">Annulée</MenuItem>
    </Select>
    <TextField
      margin="dense"
      label="Commentaire"
      fullWidth
      value={currentUser.COMMENTAIRE}
      onChange={(e) => setCurrentUser({ ...currentUser, COMMENTAIRE: e.target.value })}
    />
  <TextField
              autoFocus
              margin="dense"
              label="Par"
              fullWidth
              value={currentUser.USER_NAME}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: '#f0f0f0' },
              }}
            />
  </>
)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveUser}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Statements;
