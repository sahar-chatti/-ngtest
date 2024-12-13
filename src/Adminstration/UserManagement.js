import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  useTheme,

  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BASE_URL from '../Utilis/constantes';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({ ID_UTILISATEUR: '', UTILISATEUR: '', LOGIN: '', MOT_DE_PASSE: '', ROLE: '', EMAIL: '', NUM_POSTE: '', CODE_SOFTWARE: '', COMMERCIAL_OK: '', DEPARTEMENT: '' });;
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [repres, setRepres] = useState([])
  const [selectedRepres, setSelectedRepres] = useState(null)
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const roleOptions = ["administrateur", "collaborateur", "directeur commercial ", "directeur communication", "magasinier", "Import/Export ", "Finance", "Comptabilité", "Marketing"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setUsers(response.data);
      const res = await axios.get(`${BASE_URL}/api/representant`);
      setRepres(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/DeleteUser/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenDialog = (user) => {
    if (user) {
      setEditing(true);
      setCurrentUser(user);
      if (repres.length > 0) {
        const representant = repres?.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
        setSelectedRepres(representant);
      }
    }
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({ ID_UTILISATEUR: '', UTILISATEUR: '', LOGIN: '', MOT_DE_PASSE: '', ROLE: '', EMAIL: '', NUM_POSTE: '', CODE_SOFTWARE: '', COMMERCIAL_OK: '', DEPARTEMENT: '' });
    setEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      if (editing) {
        await axios.put(`${BASE_URL}/api/updateUser/${currentUser.ID_UTILISATEUR}`, {
          utilisateur: currentUser.UTILISATEUR,
          password: currentUser.MOT_DE_PASSE,
          role: currentUser.ROLE,
          login: currentUser.LOGIN,
          EMAIL: currentUser.EMAIL,
          NUM_POSTE: currentUser.NUM_POSTE,
          CODE_SOFTWARE: currentUser.CODE_SOFTWARE,
          COMMERCIAL_OK: selectedRepres?.NUM_REPRES,
          DEPARTEMENT: currentUser.DEPARTEMENT,
        });
      } else {
        await axios.post(`${BASE_URL}/api/createUser`, {
          utilisateur: currentUser.UTILISATEUR,
          password: currentUser.MOT_DE_PASSE,
          role: currentUser.ROLE,
          login: currentUser.LOGIN,
          EMAIL: currentUser.EMAIL,
          NUM_POSTE: currentUser.NUM_POSTE,
          CODE_SOFTWARE: currentUser.CODE_SOFTWARE,
          COMMERCIAL_OK: selectedRepres?.NUM_REPRES,
          DEPARTEMENT: currentUser.DEPARTEMENT,
        });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error.message);
    }
  };

  return (
    <Grid container spacing={2} style={{ justifyContent: "center" }}>
      <Grid item xs={8}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter un utilisateur
          </Button>
        </div>
      </Grid>
      <Grid item xs={8} >
        <TableContainer component={Paper} style={{ maxHeight: "70vh", overflowY: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Utilisateur</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Login</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Role</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Email</TableCell>

                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Numéro de poste</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Code software</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Representant commercial </TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Département </TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: "center"
                }}>Actions </TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const representative = repres.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
                return (
                  <TableRow key={user.ID_UTILISATEUR}>

                    <TableCell>{user.UTILISATEUR}</TableCell>
                    <TableCell>{user.LOGIN}</TableCell>
                    <TableCell>{user.ROLE}</TableCell>
                    <TableCell>{user.EMAIL}</TableCell>
                    <TableCell>{user.NUM_POSTE}</TableCell>
                    <TableCell>{user.CODE_SOFTWARE}</TableCell>
                    <TableCell>{representative ? representative.INTITULE_REPRES : 'N/A'}</TableCell>
                    <TableCell>{user.DEPARTEMENT}</TableCell>

                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteUser(user.ID_UTILISATEUR)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>


        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Utilisateur"
              type="text"
              style={{ width: '49%', }}
              value={currentUser?.UTILISATEUR}
              onChange={(e) => setCurrentUser({ ...currentUser, UTILISATEUR: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Login"
              type="text"
              style={{ width: '49%', marginLeft: '0.5em' }}
              value={currentUser?.LOGIN}
              onChange={(e) => setCurrentUser({ ...currentUser, LOGIN: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              style={{ width: '49%', }}
              value={currentUser?.MOT_DE_PASSE}
              onChange={(e) => setCurrentUser({ ...currentUser, MOT_DE_PASSE: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="dense"
              label="Email"
              type="text"
              style={{ width: '49%', marginLeft: '0.5em' }}
              value={currentUser?.EMAIL}
              onChange={(e) => setCurrentUser({ ...currentUser, EMAIL: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Numéro de poste"
              type="number"
              style={{ width: '49%', }}
              value={currentUser?.NUM_POSTE || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, NUM_POSTE: e.target.value })}
            />

            <TextField
              margin="dense"
              label="Code software"
              type="number" // Correction de l'attribut `type` incorrectement fermé
              style={{ width: '49%', marginLeft: '0.5em' }}
              value={currentUser?.CODE_SOFTWARE || ''} // Ajout d'une valeur par défaut pour éviter les erreurs "uncontrolled to controlled"
              onChange={(e) => setCurrentUser({ ...currentUser, CODE_SOFTWARE: e.target.value })}
            />

            <Autocomplete
              options={roleOptions}
              getOptionLabel={(option) => option}
              value={currentUser?.ROLE || null} // Ajout d'une valeur par défaut
              onChange={(event, newValue) => setCurrentUser({ ...currentUser, ROLE: newValue })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Role"
                  type="text"
                  fullWidtstyle={{ width: '70%', margin: '0.5em' }} h
                />
              )}
            />

            <InputLabel id="select-label-1">Représentant commercial</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={selectedRepres}
              onChange={(e) => setSelectedRepres(e.target.value)}
              fullWidth
            >
              {repres?.map((rep) => (
                <MenuItem key={rep.NUM_REPRES} value={rep}>{rep.INTITULE_REPRES}</MenuItem>
              ))}
            </Select>

            {/*<TextField
              margin="dense"
              label="Partenaires non enregistrés"
              type="text"
              style={{width:'22.8%', }}
            />
             <TextField
              margin="dense"
              label="Investisseurs"
              type="text"
              style={{width:'22.8%', margin:'0.5em'}}
            />
            <TextField
              margin="dense"
              label="Client CSPD"
              type="text"
              style={{width:'22.8%', margin:'0.5em'}}
            />
            <TextField
              margin="dense"
              label="Client Fdm"
              type="text"
              style={{width:'22.9%', margin:'0.5em'}}
            /> */}
            <InputLabel id="select-label-1">Département</InputLabel>
            <Select
              labelId="select-label-1"
              id="select-1"
              value={currentUser.DEPARTEMENT || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, DEPARTEMENT: e.target.value })}
              fullWidth
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

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} style={{ color: 'red' }}>Annuler</Button>
            <Button onClick={handleSaveUser} color="primary">{editing ? 'Modifier' : 'Ajouter'}</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default UserManagement;