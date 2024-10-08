import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Grid, Checkbox, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BASE_URL from './constantes';
import { useTheme } from '@mui/material';
const CrudComponent = ({ baseUrl, label }) => {
    const theme = useTheme();
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({ ID: '', LIBELLE: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${baseUrl}`);
      setItems(response.data);
    } catch (error) {
      console.error(`Error fetching ${label}:`, error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/delete${baseUrl}/${id}`);
      fetchItems();
    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
    }
  };

  const handleOpenDialog = (item) => {
    if (item) {
      setEditing(true);
      setCurrentItem(item);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem({ ID: '', LIBELLE: '' });
    setEditing(false);
  };

  const handleSaveItem = async () => {
    try {
      if (editing) {
        //alert(currentItem.ID)
        await axios.put(`${BASE_URL}/api/update${baseUrl}/${currentItem.ID}`, { LIBELLE: currentItem.LIBELLE });
      } else {
        await axios.post(`${BASE_URL}/api/create${baseUrl}`, { LIBELLE: currentItem.LIBELLE });
      }
      fetchItems();
      handleCloseDialog();
    } catch (error) {
      console.error(`Error saving ${label}:`, error);
    }
  };

  return (
    <Grid item xs={8}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Ajouter {label}
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>ID</TableCell>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Libellé</TableCell>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.ID}>
                <TableCell>{item.ID}</TableCell>
                <TableCell>{item.LIBELLE}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteItem(item.ID)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? `Modifier ${label}` : `Ajouter ${label}`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Libellé"
            type="text"
            fullWidth
            value={currentItem?.LIBELLE}
            onChange={(e) => setCurrentItem({ ...currentItem, LIBELLE: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
          <Button onClick={handleSaveItem} color="primary">{editing ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const ManagementComponent = () => {
    const [selectedTables, setSelectedTables] = useState([]);
  
    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      setSelectedTables(checked ? [name] : []);
    };
  
    const tables = [
      { name: 'Mode de livraison', baseUrl: 'modeLivraison', label: 'Mode de livraison' },
      { name: 'Mode de paiement', baseUrl: 'modePaiement', label: 'Mode de paiement' },
      { name: 'Transporteur', baseUrl: 'transporteur', label: 'Transporteur' },
      { name: 'Chauffeurs', baseUrl: 'Chauffeurs', label: 'Chauffeurs' },

    ];
  
    return (
      <Grid container spacing={2} style={{ justifyContent: "center" }}>
        <Grid item xs={12}>
          {tables.map((table) => (
            <FormControlLabel
              key={table.name}
              control={
                <Checkbox
                  name={table.name}
                  checked={selectedTables.includes(table.name)}
                  onChange={handleCheckboxChange}
                />
              }
              label={table.name}
            />
          ))}
        </Grid>
        {selectedTables.map((tableName) => {
          const table = tables.find((table) => table.name === tableName);
          return <CrudComponent key={table.name} baseUrl={table.baseUrl} label={table.label} />;
        })}
      </Grid>
    );
  };
  
  export default ManagementComponent;
  
