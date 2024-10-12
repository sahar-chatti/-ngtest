import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  Grid, useTheme, Typography
} from '@mui/material';
import { format, parse, isValid } from 'date-fns';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import BASE_URL from './constantes';
import { useSelector } from 'react-redux';
import entete from '../src/images/sahar up.png';

const DemAchat = () => {
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({ ID: '', UTILISATEUR: '', CLIENT: '', DES_ART: '', DATE_DEMANDE: '' });
  const [editing, setEditing] = useState(false);
  const user = useSelector((state) => state.user);
  const [enteteBase64, setEnteteBase64] = useState('');

  useEffect(() => {
    fetchUsers();
    convertEnteteToBase64();
  }, []);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : '';
  };

  const parseDateFromInput = (dateString) => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy HH:mm", new Date());
    return isValid(parsedDate) ? parsedDate.toISOString() : null;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/demandesAchat`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const convertEnteteToBase64 = () => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      setEnteteBase64(dataURL);
    };
    img.src = entete;
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
    setCurrentUser({ ...currentUser, DATE_DEMANDE: new Date().toISOString().slice(0, 16) });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser({ ID: '', UTILISATEUR: '', CLIENT: '', DES_ART: '', DATE_DEMANDE: '' });
    setEditing(false);
  };

  const handleSaveUser = async () => {
    try {
      if (editing) {
        await axios.put(`${BASE_URL}/api/updateDemande/${currentUser.ID}`, {
          CLIENT: currentUser.CLIENT,
          DES_ART: currentUser.DES_ART
        });
      } else {
        await axios.post(`${BASE_URL}/api/createAchatDem`, {
          DATE_DEMANDE: currentUser.DATE_DEMANDE,
          UTILISATEUR: user.LOGIN,
          CLIENT: currentUser.CLIENT,
          DES_ART: currentUser.DES_ART
        });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Liste des demandes d'achat</title>
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
              margin-top: -800px;
              padding: 20px;
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
            <h1>Liste des demandes d'achat</h1>
            <table>
              <thead>
                <tr>
                  <th>Date demande</th>
                  <th>Utilisateur</th>
                  <th>Client</th>
                  <th>Des article</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td>${formatDateForInput(u.DATE_DEMANDE)}</td>
                    <td>${u.UTILISATEUR}</td>
                    <td>${u.CLIENT}</td>
                    <td>${u.DES_ART}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', 'Liste des demandes d\'achat');
    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Grid container spacing={2} style={{ justifyContent: "center" }}>
      <Grid item xs={8}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <Button style={ {marginRight:20, backgroundColor:'#7695FF'}} variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Imprimer la liste des demandes d'achat
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter une demande d'achat article
          </Button>
        </div>
      </Grid>
      <Grid item xs={8}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Date demande</TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Utilisateur</TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Client</TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Des article</TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white, fontWeight: 'bold', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.ID}>
                  <TableCell>{formatDateForInput(u.DATE_DEMANDE)}</TableCell>
                  <TableCell>{u.UTILISATEUR}</TableCell>
                  <TableCell>{u.CLIENT}</TableCell>
                  <TableCell>{u.DES_ART}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(u)} disabled={user.LOGIN !== u.UTILISATEUR}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteUser(u.ID)} disabled={user.LOGIN !== u.UTILISATEUR}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Modifier la demande' : 'Ajouter une nouvelle demande'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Client"
            value={currentUser.CLIENT}
            onChange={(e) => setCurrentUser({ ...currentUser, CLIENT: e.target.value })}
            fullWidth
          />
          <TextField
            label="Des Article"
            value={currentUser.DES_ART}
            onChange={(e) => setCurrentUser({ ...currentUser, DES_ART: e.target.value })}
            fullWidth
          />
          <TextField
            label="Date Demande"
            type="datetime-local"
            value={formatDateForInput(currentUser.DATE_DEMANDE)}
            onChange={(e) => setCurrentUser({ ...currentUser, DATE_DEMANDE: parseDateFromInput(e.target.value) })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">{editing ? 'Sauvegarder' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default DemAchat;
