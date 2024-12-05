// VisitorsManagement.js (Frontend React Component)

import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Typography, Checkbox, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from './constantes';

const VisitorsManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [open, setOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    departement: '',
    date_entre: '',
    date_sortie: '',
    phone: '' // Added phone field
  });

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/visitors`);
      setVisitors(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des visiteurs');
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditingVisitor(null);
    setFormData({
      nom: '',
      prenom: '',
      departement: '',
      date_entre: new Date().toISOString().slice(0, 16),
      date_sortie: '',
      phone: ''
    });
  };

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      nom: visitor.NOM,
      prenom: visitor.PRENOM,
      departement: visitor.DEPARTEMENT,
      date_entre: new Date(visitor.DATE_ENTRE).toISOString().slice(0, 16),
      date_sortie: visitor.DATE_SORTIE ? new Date(visitor.DATE_SORTIE).toISOString().slice(0, 16) : '',
      phone: visitor.PHONE || '' // Set phone field
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formatDateForOracle = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()} ${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${ampm}`;
      };

      let currentFormData = { ...formData };
      if (!editingVisitor) {
        currentFormData.date_entre = new Date().toISOString();
      }

      if (isExiting) {
        currentFormData.date_sortie = new Date().toISOString();
      }

      const formattedData = {
        ...currentFormData,
        date_entre: formatDateForOracle(currentFormData.date_entre),
        date_sortie: isExiting ? formatDateForOracle(currentFormData.date_sortie) : null
      };

      if (editingVisitor) {
        await axios.put(`${BASE_URL}/api/visitors/${editingVisitor.ID}`, formattedData);
        toast.success('Visiteur modifié avec succès');
      } else {
        await axios.post(`${BASE_URL}/api/visitors`, formattedData);
        toast.success('Visiteur ajouté avec succès');
      }
      handleClose();
      fetchVisitors();
    } catch (error) {
      console.log('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'opération');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVisitor(null);
    setIsExiting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce visiteur ?')) {
      try {
        await axios.delete(`${BASE_URL}/api/visitors/${id}`);
        toast.success('Visiteur supprimé avec succès');
        fetchVisitors();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestion des Visiteurs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Nouveau Visiteur
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Date Entrée</TableCell>
              <TableCell>Date Sortie</TableCell>
              <TableCell>Téléphone</TableCell> {/* Add phone column */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor.ID}>
                <TableCell>{visitor.NOM}</TableCell>
                <TableCell>{visitor.PRENOM}</TableCell>
                <TableCell>{visitor.DEPARTEMENT}</TableCell>
                <TableCell>{new Date(visitor.DATE_ENTRE).toLocaleString()}</TableCell>
                <TableCell>{visitor.DATE_SORTIE ? new Date(visitor.DATE_SORTIE).toLocaleString() : '-'}</TableCell>
                <TableCell>{visitor.PHONE || '-'}</TableCell> {/* Display phone number */}
                <TableCell>
                  <IconButton onClick={() => handleEdit(visitor)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(visitor.ID)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog for adding/editing visitors */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingVisitor ? 'Modifier Visiteur' : 'Ajouter Visiteur'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Département"
              name="departement"
              value={formData.departement}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Numéro de Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Date d'entrée"
              name="date_entre"
              value={formData.date_entre}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControlLabel
              control={<Checkbox checked={isExiting} onChange={() => setIsExiting(!isExiting)} />}
              label="Visiteur est en sortie"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 2 }}>Annuler</Button>
              <Button type="submit" variant="contained">
                {editingVisitor ? 'Modifier' : 'Ajouter'}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VisitorsManagement;
