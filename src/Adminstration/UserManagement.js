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
  Select,
  Box,
  Typography,
  Card,
  Fade,
  Chip,
  Avatar,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import BASE_URL from '../Utilis/constantes';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 8px'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.2s ease'
  },
  '& td': {
    borderBottom: 'none',
    padding: '16px'
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  borderBottom: 'none',
  '&.header': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.95rem'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  }
}));

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ID_UTILISATEUR: '',
    UTILISATEUR: '',
    LOGIN: '',
    MOT_DE_PASSE: '',
    ROLE: '',
    EMAIL: '',
    NUM_POSTE: '',
    CODE_SOFTWARE: '',
    COMMERCIAL_OK: '',
    DEPARTEMENT: ''
  });
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [repres, setRepres] = useState([]);
  const [selectedRepres, setSelectedRepres] = useState(null);

  const roleOptions = [
    "administrateur",
    "collaborateur",
    "directeur commercial",
    "directeur communication",
    "magasinier",
    "Import/Export",
    "Finance",
    "Comptabilité",
    "Marketing",
    "Chauffeur",
    "Réception",
    "Autre"
  ];

  const departementOptions = [
    "Direction",
    "Commercial",
    "Marketing",
    "Finance",
    "Comptabilité",
    "Import / Export",
    "Développement",
    "Magasin",
    "RH",
    "Réception",
    "Chauffeur",
    "Autre"
  ];

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
      const representant = repres?.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
      setSelectedRepres(representant);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({
      ID_UTILISATEUR: '',
      UTILISATEUR: '',
      LOGIN: '',
      MOT_DE_PASSE: '',
      ROLE: '',
      EMAIL: '',
      NUM_POSTE: '',
      CODE_SOFTWARE: '',
      COMMERCIAL_OK: '',
      DEPARTEMENT: ''
    });
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
      console.error('Error saving user:', error);
    }
  };

  return (
    <Box sx={{ p: 2, width: '100%', margin: '0 auto' }}>
      <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Gestion des Utilisateurs
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Ajouter un utilisateur
          </Button>
        </Box>

        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell className="header">Utilisateur</StyledTableCell>
                <StyledTableCell className="header">Login</StyledTableCell>
                <StyledTableCell className="header">Role</StyledTableCell>
                <StyledTableCell className="header">Email</StyledTableCell>
                <StyledTableCell className="header">Numéro de poste</StyledTableCell>
                <StyledTableCell className="header">Code software</StyledTableCell>
                <StyledTableCell className="header">Représentant commercial</StyledTableCell>
                <StyledTableCell className="header">Département</StyledTableCell>
                <StyledTableCell className="header">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const representative = repres.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
                return (
                  <Fade in={true} key={user.ID_UTILISATEUR}>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="subtitle2">{user.UTILISATEUR}</Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{user.LOGIN}</StyledTableCell>
                      <StyledTableCell>
                        <Chip label={user.ROLE} size="small" color="primary" variant="outlined" />
                      </StyledTableCell>
                      <StyledTableCell>{user.EMAIL}</StyledTableCell>
                      <StyledTableCell>{user.NUM_POSTE}</StyledTableCell>
                      <StyledTableCell>{user.CODE_SOFTWARE}</StyledTableCell>
                      <StyledTableCell>{representative ? representative.INTITULE_REPRES : 'N/A'}</StyledTableCell>
                      <StyledTableCell>{user.DEPARTEMENT}</StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.ID_UTILISATEUR)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  </Fade>
                );
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {editing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Utilisateur"
                value={currentUser?.UTILISATEUR}
                onChange={(e) => setCurrentUser({ ...currentUser, UTILISATEUR: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Login"
                value={currentUser?.LOGIN}
                onChange={(e) => setCurrentUser({ ...currentUser, LOGIN: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={currentUser?.MOT_DE_PASSE}
                onChange={(e) => setCurrentUser({ ...currentUser, MOT_DE_PASSE: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Email"
                value={currentUser?.EMAIL}
                onChange={(e) => setCurrentUser({ ...currentUser, EMAIL: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Numéro de poste"
                type="number"
                value={currentUser?.NUM_POSTE || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, NUM_POSTE: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Code software"
                type="number"
                value={currentUser?.CODE_SOFTWARE || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, CODE_SOFTWARE: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={roleOptions}
                value={currentUser?.ROLE || null}
                onChange={(event, newValue) => setCurrentUser({ ...currentUser, ROLE: newValue })}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    fullWidth
                    label="Role"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Représentant commercial</InputLabel>
              <Select
                fullWidth
                value={selectedRepres || ''}
                onChange={(e) => setSelectedRepres(e.target.value)}
              >
                {repres?.map((rep) => (
                  <MenuItem key={rep.NUM_REPRES} value={rep}>
                    {rep.INTITULE_REPRES}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Département</InputLabel>
              <Select
                fullWidth
                value={currentUser.DEPARTEMENT || ''}
                onChange={(e) => setCurrentUser({ ...currentUser, DEPARTEMENT: e.target.value })}
              >
                {departementOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCloseDialog}
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveUser}
            sx={{ borderRadius: 2 }}
          >
            {editing ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
