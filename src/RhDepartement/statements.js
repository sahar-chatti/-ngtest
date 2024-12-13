import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Grid, Select, MenuItem, InputLabel,

} from '@mui/material';
import {
  Avatar,
  FormControl,
 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import BASE_URL from '../Utilis/constantes';
import { useSelector } from 'react-redux';
import entete from '../images/sahar up.png';

const Statements = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const [setDepartmentClaims] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    USER_NAME: '',
    DEMAND_DATE: '',
    DEMAND_TYPE: '',
    DESCRIPTION: '',
    STATE: 'En cours',  // Set default value here
    ETAT: 'En cours',   // Set default value here
    PAR: '',
    COMMENTAIRE: ''
  });

  const [editing, setEditing] = useState(false);
  const [enteteBase64, setEnteteBase64] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
    convertEnteteToBase64();
  }, [user?.LOGIN]); // Add user?.LOGIN as dependency

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      alert('Erreur lors de la récupération des utilisateurs.');
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/statements`);

      if (user?.ROLE === 'administrateur') {
        // Admin sees all statements
        setUsers(response.data);
      } else {
        // Regular users see only statements where they are the sender (USER_NAME) 
        // or receiver (DEMAND_TYPE)
        const filteredStatements = response.data.filter(statement =>
          statement.USER_NAME === user?.LOGIN ||
          statement.DEMAND_TYPE === user?.UTILISATEUR
        );
        setUsers(filteredStatements);
      }
    } catch (error) {
      console.error('Error fetching statements:', error);
      alert('Erreur lors de la récupération des réclamations.');
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
        STATE: 'En cours',
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
      const shouldUpdatePAR = !currentUser.PAR || currentUser.PAR === '';

      if (missingFields.length > 0) {
        alert(`Veuillez remplir les champs suivants : ${missingFields.join(', ')}`);
        return;
      }

      const requestData = {
        USER_NAME: currentUser.USER_NAME,
        DEMAND_DATE: new Date(currentUser.DEMAND_DATE),
        DEMAND_TYPE: currentUser.DEMAND_TYPE,
        DESCRIPTION: currentUser.DESCRIPTION,
        COMMENTAIRE: currentUser.COMMENTAIRE || '',
        STATE: editing ? currentUser.STATE : 'En cours',
        ETAT: editing ? currentUser.ETAT : 'En cours',
        PAR: shouldUpdatePAR ? user.LOGIN : currentUser.PAR

   

      };

      if (user?.ROLE === 'administrateur') {
        requestData.DECISION = currentUser.DECISION || '';
      }

      const apiEndpoint = editing
        ? `${BASE_URL}/api/updateStatement/${currentUser.ID}`
        : `${BASE_URL}/api/createStatements`;

      const apiMethod = editing ? 'put' : 'post';
      const response = await axios[apiMethod](apiEndpoint, requestData, { timeout: 5000 });

      if (response.status === 201 || response.status === 200) {
        fetchUsers();
        handleCloseDialog();
        alert(`Demande ${editing ? 'modifiée' : 'ajoutée'} avec succès.`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erreur lors de la sauvegarde de la demande.');
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
                  <th>Personne </th>
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

              <TableCell>Réclamant</TableCell>
              <TableCell>Date demande</TableCell>
              <TableCell>Personne à notifier</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Commentaire</TableCell>
              <TableCell>Réceveur</TableCell>
              <TableCell>Décision Administartion</TableCell>
              <TableCell>Avis Administartion</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.length > 0 ? (
              users.map((user, index) => (
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
                    <Chip
                      label={user.STATE}
                      sx={{
                        backgroundColor:
                          user.STATE === 'En cours' ? theme.palette.warning.light :
                            user.STATE === 'Accepté' ? theme.palette.success.light :
                              user.STATE === 'Réfusé' ? theme.palette.error.light :
                                theme.palette.grey[300],
                        color:
                          user.STATE === 'Réfusé' ? theme.palette.common.white :
                            user.STATE === 'Accepté' ? theme.palette.common.white :
                              theme.palette.text.primary,
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell color="primary">{user.DECISION}</TableCell>


                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
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
      <Dialog 
  open={openDialog} 
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
>
  <DialogTitle sx={{ 
    backgroundColor: theme.palette.primary.main, 
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    {editing ? <EditIcon /> : <AddIcon />}
    {editing ? 'Modifier la Réclamation' : 'Nouvelle Réclamation'}
  </DialogTitle>

  <DialogContent dividers>
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* User Information Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color="primary" gutterBottom>
          Informations de base
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Nom Utilisateur"
          value={currentUser.USER_NAME}
          onChange={(e) => setCurrentUser({ ...currentUser, USER_NAME: e.target.value })}
          disabled={editing}
          variant="outlined"
        />
      </Grid>

  

      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="notify-user-label">Utilisateur à Notifier</InputLabel>
          <Select
            labelId="notify-user-label"
            value={currentUser.DEMAND_TYPE || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, DEMAND_TYPE: e.target.value })}
            label="Utilisateur à Notifier"
            disabled={editing}

          >
            {allUsers.map((user) => (
              <MenuItem key={user.ID} value={user.LOGIN}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>
                      {user.UTILISATEUR.charAt(0)}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    {user.UTILISATEUR} - {user.DEPARTEMENT}
                  </Grid>
                </Grid>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          value={currentUser.DESCRIPTION}
          onChange={(e) => setCurrentUser({ ...currentUser, DESCRIPTION: e.target.value })}
          multiline
          rows={4}
          variant="outlined"
          disabled={editing}

        />
      </Grid>

      {editing && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary" gutterBottom>
              État et commentaires
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>État</InputLabel>
              <Select
                value={currentUser.ETAT}
                onChange={(e) => setCurrentUser({ ...currentUser, ETAT: e.target.value })}
                label="État"
              >
                <MenuItem value="En cours">En cours</MenuItem>
                <MenuItem value="Récue">Récue</MenuItem>
                <MenuItem value="Terminée">Terminée</MenuItem>
                <MenuItem value="Annulée">Annulée</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Commentaire"
              value={currentUser.COMMENTAIRE}
              onChange={(e) => setCurrentUser({ ...currentUser, COMMENTAIRE: e.target.value })}
              variant="outlined"
            />
          </Grid>

          {user?.ROLE === 'administrateur' && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Décision administrative
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>État administratif</InputLabel>
                  <Select
                    value={currentUser.STATE}
                    onChange={(e) => setCurrentUser({ ...currentUser, STATE: e.target.value })}
                    label="État administratif"
                  >
                    <MenuItem value="En cours">En cours</MenuItem>
                    <MenuItem value="Accepté">Accepté</MenuItem>
                    <MenuItem value="Réfusé">Réfusé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Avis administratif"
                  value={currentUser.DECISION || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, DECISION: e.target.value })}
                  variant="outlined"
                />
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  </DialogContent>

  <DialogActions sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
    <Button 
      onClick={handleCloseDialog}
      variant="outlined"
      startIcon={<CloseIcon />}
    >
      Annuler
    </Button>
    <Button 
      onClick={handleSaveUser}
      variant="contained"
      startIcon={<SaveIcon />}
      color="primary"
    >
      Enregistrer
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default Statements;
