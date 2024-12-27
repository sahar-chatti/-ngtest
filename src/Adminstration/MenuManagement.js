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
  FormControlLabel,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  styled,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SecurityIcon from '@mui/icons-material/Security';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import BASE_URL from '../Utilis/constantes';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  margin: theme.spacing(3),
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600
  }
}));

const AccessCheckbox = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(1),
  '& .MuiCheckbox-root': {
    color: theme.palette.primary.main
  }
}));

const ModuleSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2)
}));

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accessRights, setAccessRights] = useState({
    contact: false,
    administration: false,
    parametrage: false,
    magasin: false,
    rh: false,
    mailing: false,
    importExport: false,
    reception: false,
    partenaire: false,
    vehicules: false,

    investisseur: false,
    client_cspd: false,
    client_fdm: false,
    famille: false,
    historique_appel: false,
    achats: false,
    comptabilite: false,
    finance: false
  });

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
      vehicules: user.ACCESS_VEHICULE === 1,
      investisseur: user.ACCESS_INVESTISSEUR === 1,
      client_cspd: user.ACCESS_CLIENT_CSPD === 1,
      client_fdm: user.ACCESS_CLIENT_FDM === 1,
      famille: user.ACCESS_FAMILLE === 1,
      historique_appel: user.ACCESS_HISTORIQUE_APPEL === 1,
      achats: user.ACCESS_ACHATS === 1,
      comptabilite: user.ACCESS_COMPTABILITE === 1,
      finance: user.ACCESS_FINANCE === 1,
      reception: user.ACCESS_RECEPTIONIST === 1,

    });
    setOpenDialog(true);
  };
  const sortedUsers = users.sort((a, b) => a.LOGIN.localeCompare(b.LOGIN));
  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'administrateur':
        return <AdminPanelSettingsIcon color="primary" />;
      case 'directeur':
        return <SupervisorAccountIcon color="secondary" />;
      case 'commercial':
        return <BusinessCenterIcon color="success" />;
      default:
        return <PersonIcon color="action" />;
    }
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;
    
    const requestData = Object.keys(accessRights).reduce((acc, key) => ({
      ...acc,
      [key]: accessRights[key] ? 1 : 0
    }), {});

    try {
      await axios.put(`${BASE_URL}/api/users/${selectedUser.ID_UTILISATEUR}/access`, requestData);
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating access rights:', error);
    }
  };

  const handleAccessChange = (event) => {
    const { name, checked } = event.target;
    setAccessRights(prev => ({ ...prev, [name]: checked }));
  };

  const moduleGroups = {
    core: ['reception', 'contact', 'administration'],
    clients: ['partenaire', 'investisseur', 'client_cspd', 'client_fdm', 'famille'],
    operations: ['magasin', 'importExport', 'achats'],
    finance: ['comptabilite', 'finance'],
    other: ['parametrage', 'rh', 'mailing', 'historique_appel', 'vehicules']
  };

  return (
    <Box sx={{ p: 3 }}>
      <StyledTableContainer component={Paper}>
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SortIcon />
                  Login
                </Box>
              </TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.ID_UTILISATEUR} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getRoleIcon(user.ROLE)}
                    <Typography>{user.LOGIN}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<SecurityIcon />}
                    label={user.ROLE}
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditAccess(user)}
                    sx={{ borderRadius: 2 }}
                  >
                    Modifier les accès
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <SecurityIcon />
          <Typography variant="h6">
            Droits d'accès - {selectedUser?.LOGIN}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {Object.entries(moduleGroups).map(([groupName, modules]) => (
              <Grid item xs={12} key={groupName}>
                <ModuleSection>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {groupName.toUpperCase()}
                  </Typography>
                  <FormGroup>
                    <Grid container>
                      {modules.map((moduleName) => (
                        <Grid item xs={12} sm={6} md={4} key={moduleName}>
                          <AccessCheckbox
                            control={
                              <Checkbox
                                checked={accessRights[moduleName]}
                                onChange={handleAccessChange}
                                name={moduleName}
                              />
                            }
                            label={moduleName.replace('_', ' ').toUpperCase()}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </ModuleSection>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setOpenDialog(false)}
            color="error"
          >
            Annuler
          </Button>
          <Button 
            variant="contained"
            onClick={handleSaveAccess}
            color="primary"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
