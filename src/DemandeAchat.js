import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,Grid,useTheme,useMediaQuery,InputLabel,MenuItem,Select
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BASE_URL from './constantes';
import Email from '@mui/icons-material/Email';
import { useSelector } from 'react-redux';
const DemAchat = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({ ID:'',UTILISATEUR: '',CLIENT:'',DES_ART:'',DATE_DEMANDE:''});;
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [repres,setRepres]=useState([])
const [selectedRepres,setSelectedRepres]=useState(null)
const user=useSelector((state)=>state.user)
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/demandesAchat`);
      console.log("achat",response.data)
      setUsers(response.data);
     
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/deleteDemande/${id}`);
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
    setCurrentUser({...currentUser,DATE_DEMANDE:new Date().toISOString().slice(0, 16)});
    setOpenDialog(true);
  };
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({ ID:'',UTILISATEUR: '',CLIENT:'',DES_ART:'',DATE_DEMANDE:''});
    setEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      if (editing) {
     
        await axios.put(`${BASE_URL}/api/updateDemande/${currentUser.ID}`,
            
            {
           CLIENT:currentUser.CLIENT,
           DES_ART:currentUser.DES_ART
             
            });
      } else {
        await axios.post(`${BASE_URL}/api/createAchatDem`,{
            DATE_DEMANDE:currentUser.DATE_DEMANDE,
            UTILISATEUR:user.LOGIN,
            CLIENT:currentUser.CLIENT,
            DES_ART:currentUser.DES_ART
        });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  return (
    <Grid container spacing={2} style={{justifyContent:"center"}}>
      <Grid item xs={8}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter une demande d'achat article
          </Button>
        </div>
      </Grid>
      <Grid item xs={8} >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow> 
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Date demande</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Utilisateur</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Client</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Des article</TableCell>
              
                                         <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                       
                                        }}>Actions </TableCell>
                                        
              </TableRow>
            </TableHead>
            <TableBody>
  {users.map((u) => {
  
    return (
      <TableRow key={u.ID}>
        <TableCell>{u.DATE_DEMANDE}</TableCell>
        <TableCell>{u.UTILISATEUR}</TableCell>
        <TableCell>{u.CLIENT}</TableCell>
        <TableCell>{u.DES_ART}</TableCell>
       
        <TableCell>
          <IconButton color="primary" onClick={() => handleOpenDialog(u)} disabled={user.LOGIN!==u.UTILISATEUR}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteUser(u.ID)}  disabled={user.LOGIN!==u.UTILISATEUR}>
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
          <DialogTitle>{editing ? 'Modifier la demande d\'achat' : 'Ajouter demande d\'achat'}</DialogTitle>
          <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="datetime"
            label="Date/Heure"
            type="datetime-local"
            fullWidth
            value={currentUser?.DATE_DEMANDE}
            onChange={(e) => setCurrentUser({ ...currentUser, DATE_DEMANDE: e.target.value })}
          />
            <TextField
              autoFocus
              margin="dense"
              label="Client"
              type="text"
              fullWidth
              value={currentUser?.CLIENT}
              onChange={(e) => setCurrentUser({ ...currentUser, CLIENT: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Des article"
              type="text"
              fullWidth
              value={currentUser?.DES_ART}
              onChange={(e) => setCurrentUser({ ...currentUser, DES_ART: e.target.value })}
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

export default DemAchat;