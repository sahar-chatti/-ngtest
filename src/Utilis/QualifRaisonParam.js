import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Grid, useTheme, useMediaQuery
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BASE_URL from '../Utilis/constantes';
const RaisonQualifications = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    ID: '', ID_QUALIFICATION: '',
    ID_STATUT: ''
  });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState([])
  const [raisons, setRaisons] = useState([])
  const [params, setParams] = useState([])
  const roleOptions = ["administrateur", "collaborateur", "financier", "logistique", "Chef d equipe"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const parameters = await axios.get(`${BASE_URL}/api/raisonQualifications`);
      setParams(parameters.data);
      const response = await axios.get(`${BASE_URL}/api/RaisonsList`);
      setRaisons(response.data);
      const res = await axios.get(`${BASE_URL}/api/QualificationAppels`);
      setStatus(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/DeleteRaisonQualification/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenDialog = (user) => {

    if (user) {
      setEditing(true);
      setCurrentUser(user);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({
      ID: '', ID_QUALIFICATION: '',
      ID_RAISON: ''
    });
    setEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      if (editing) {
        await axios.put(`${BASE_URL}/api/updateRaisonQualification/${currentUser.ID}`,

          {
            id_qualification: currentUser.ID_QUALIFICATION,
            id_raison: currentUser.ID_RAISON,
          });
      } else {
        await axios.post(`${BASE_URL}/api/createRaisonQualification`, {
          id_qualification: currentUser.ID_QUALIFICATION,
          id_raison: currentUser.ID_RAISON,

        });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  return (
    <Grid container spacing={2} style={{ justifyContent: "center" }}>
      <Grid item xs={8}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter
          </Button>
        </div>
      </Grid>
      <Grid item xs={8} >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Raison</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Qualification</TableCell>
                <TableCell sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',

                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {params.map((p) => (
                <TableRow key={p.ID}>
                  <TableCell>{p.RAISON}</TableCell>
                  <TableCell>{p.QUALIFICATION}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(p)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteUser(p.ID)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12}>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editing ? 'Modification' : 'Création'}</DialogTitle>
          <DialogContent>

            <Autocomplete
              options={raisons}
              getOptionLabel={(option) => option.LIBELLE}
              value={currentUser.ID_RAISON ? raisons.find((r) => r.ID_RAISON === currentUser.ID_RAISON) : null}
              onChange={(event, newValue) => setCurrentUser({ ...currentUser, ID_RAISON: newValue ? newValue.ID_RAISON : '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Raison"
                  type="text"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              options={status}
              getOptionLabel={(option) => option.LIBELLE}
              value={currentUser.ID_QUALIFICATION ? status.find((s) => s.ID_QUALIFICATION === currentUser.ID_QUALIFICATION) : null}
              onChange={(event, newValue) => setCurrentUser({ ...currentUser, ID_QUALIFICATION: newValue ? newValue.ID_QUALIFICATION : '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Qualification"
                  type="text"
                  fullWidth
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
            <Button onClick={handleSaveUser} color="primary">{editing ? 'Modifier' : 'Ajouter'}</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default RaisonQualifications;