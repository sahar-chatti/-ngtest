import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import axios from 'axios';
import BASE_URL from './constantes';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Individual access rights as separate state fields
  const [accessRights, setAccessRights] = useState({
    contact: false,
    administration: false,
    parametrage: false,
    magasin: false,
    rh: false,
    mailing: false,
    importExport: false
  });

  const roles = [
    "administrateur",
    "directeur commercial",
    "directeur communication",
    "collaborateur",
    "Import/Export",
    "Finance",
    "Comptabilité",
    "Marketing",
    "magasinier"
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditAccess = (user) => {
    setSelectedUser(user);

    // Set individual access rights based on user's current rights
    setAccessRights({
      contact: user.ACCESS_CONTACT === 1,
      administration: user.ACCESS_ADMINISTRATION === 1,
      parametrage: user.ACCESS_PARAMETRAGE === 1,
      magasin: user.ACCESS_MAGASIN === 1,
      rh: user.ACCESS_RH === 1,
      mailing: user.ACCESS_MAILING === 1,
      importExport: user.ACCESS_IMPORT_EXPORT === 1,
      reception: user.ACCESS_RECEPTION === 1,
     partenaire: user.ACCESS_PARTENAIRE === 1,
     investisseur: user.ACCESS_INVESTISSEUR === 1,
      client_cspd: user.ACCESS_CLIENT_CSPD === 1,
      client_fdm: user.ACCESS_CLIENT_FDM === 1,
      famille: user.ACCESS_FAMILLE=== 1,
      historique_appel: user.ACCESS_HISTORIQUE_APPEL === 1,
      achats: user.ACCESS_ACHATS === 1,
      comptabilite: user.ACCESS_COMPTABILITE === 1,

      finance: user.ACCESS_FINANCE === 1
    });
    
    setOpenDialog(true);
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;
  
    try {
      // Use the userId for the API request
      await axios.put(`http://192.168.1.170:3300/api/users/${selectedUser.ID_UTILISATEUR}/access`, {
        contact: accessRights.contact,
        administration: accessRights.administration,
        parametrage: accessRights.parametrage,
        magasin: accessRights.magasin,
        rh: accessRights.rh,
        mailing: accessRights.mailing,
        importExport: accessRights.importExport,
        partenaire: accessRights.partenaire,
        investisseur: accessRights.investisseur,
        client_cspd: accessRights.client_cspd,
        client_fdm: accessRights.client_fdm,
        famille: accessRights.famille,
        historique_appel: accessRights.historique_appel,
        achats: accessRights.achats,
        comptabilite: accessRights.comptabilite,
        reception: accessRights.reception ? 1 : 0,  // Ensure 'reception' is converted to 1 or 0

        finance: accessRights.finance,

      });
  
      setOpenDialog(false);
      fetchUsers();  // Re-fetch users to reflect changes
    } catch (error) {
      console.error('Error updating access rights:', error);
    }
  };

  const handleAccessChange = (event) => {
    const { name, checked } = event.target;
    setAccessRights((prevRights) => ({
      ...prevRights,
      [name]: checked
    }));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Login</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {users.map((user) => (
    <TableRow key={user.ID_UTILISATEUR}>
      <TableCell>{user.LOGIN}</TableCell>
      <TableCell>{user.ROLE}</TableCell>
      <TableCell>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleEditAccess(user)}
        >
          Edit Access
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User Access Rights</DialogTitle>
        <DialogContent>
        

          <FormGroup>
          <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.reception}
                  onChange={handleAccessChange}
                  name="reception"
                />
              }
              label="Reception role"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.contact}
                  onChange={handleAccessChange}
                  name="contact"
                />
              }
              label="Commercial role"
            />


               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.partenaire}
                  onChange={handleAccessChange}
                  name="partenaire"
                />
              }
              label="Partenaire Module"
            />


               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.investisseur}
                  onChange={handleAccessChange}
                  name="investisseur"
                />
              }
              label="Investisseur Module"
            />


               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.client_cspd}
                  onChange={handleAccessChange}
                  name="client_cspd"
                />
              }
              label="Client Cspd Module"
            />


               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.client_fdm}
                  onChange={handleAccessChange}
                  name="client_fdm"
                />
              }
              label="Client Fdm Module"
            />


               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.famille}
                  onChange={handleAccessChange}
                  name="famille"
                />
              }
              label="Famille"
            />

               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.historique_appel}
                  onChange={handleAccessChange}
                  name="historique_appel"
                />
              }
              label="Historique d'appel"
            />

               <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.achats}
                  onChange={handleAccessChange}
                  name="achats"
                />
              }
              label="Achats Module"
            />
              <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.comptabilite}
                  onChange={handleAccessChange}
                  name="comptabilite"
                />
              }
              label="Comptabilité Module"
            />
              <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.finance}
                  onChange={handleAccessChange}
                  name="finance"
                />
              }
              label="Finance Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.administration}
                  onChange={handleAccessChange}
                  name="administration"
                />
              }
              label="Administration Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.parametrage}
                  onChange={handleAccessChange}
                  name="parametrage"
                />
              }
              label="Parametrage Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.magasin}
                  onChange={handleAccessChange}
                  name="magasin"
                />
              }
              label="Magasin Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.rh}
                  onChange={handleAccessChange}
                  name="rh"
                />
              }
              label="RH Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.mailing}
                  onChange={handleAccessChange}
                  name="mailing"
                />
              }
              label="Marketing Module"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessRights.importExport}
                  onChange={handleAccessChange}
                  name="importExport"
                />
              }
              label="Import/Export Module"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAccess} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
