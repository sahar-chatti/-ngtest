import React, { useState, useEffect } from 'react';
import {
    Box, Button, IconButton, Tooltip, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid, Typography,
    Paper, MenuItem
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import BASE_URL from '../Utilis/constantes';
import RenseignementClient from './RenseignementClient';

const StatusChip = styled(Paper)`
    padding: 8px 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    &.En_cours { background-color: #fff3cd; color: #856404; }
    &.Accepté { background-color: #d4edda; color: #155724; }
    &.Rejeté { background-color: #f8d7da; color: #721c24; }
    &.Annulé { background-color: #f8d7da; color: #721c24; }
`;

const AddButton = styled(Button)`
    background: #4299e1;
    color: white;
    padding: 10px 20px;
    margin-bottom: 20px;
    &:hover { background: #3182ce; }
`;

const TableContainer = styled.div`
    margin-top: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow-x: auto;
    background: white;
`;

const TableHeader = styled.div`
    display: flex;
    background: #9dbdff;
    padding: 10px;
    font-weight: bold;
    position: sticky;
    top: 0;
`;

const TableCell = styled.div`
    flex: 1;
    min-width: 150px;
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TableRow = styled.div`
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const RenseignementManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [renseignements, setRenseignements] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState({
        AVIS_FINANCIER: '',
        REMARQUE: '',
        ENCOURS_FIANANCIER: '',
        ID_DEMANDE: null
    });

    const [user, setUser] = useState(null);

    const tableHeaders = [
        'Date Création', 'Client', 'Commercial', 'Date Décision',
        'Statut', 'Avis Financier', 'Avis Commercial',
        'Avis Direction', 'Mode Règlement', 'Encours Final', 'Actions'
    ];

    useEffect(() => {
        fetchRenseignements();
    }, []);

    const fetchRenseignements = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/getProspection`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setRenseignements(data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/users`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const canAccessFinance = () => {
        return user && user.ACCESS_FINANCE === 1;
    };

    const canAccessAdmin = () => {
        return user && user.ACCESS_ADMINISTRATION === 1;
    };

    const isCommercial = () => {
        return user && user.COMMERCIAL_OK === "2";
    };

    const handleEdit = (item) => {
        setEditingItem({
            ...item,
            AVIS_FINANCIER: item.AVIS_FINANCIER || '',
            REMARQUE: item.REMARQUE || '',
            ENCOURS_FIANANCIER: item.ENCOURS_FIANANCIER || ''
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/prospection/${editingItem.ID_DEMANDE}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    AVIS_FINANCIER: editingItem.AVIS_FINANCIER,
                    REMARQUE: editingItem.REMARQUE,
                    ENCOURS_FIANANCIER: editingItem.ENCOURS_FIANANCIER
                })
            });

            if (response.ok) {
                fetchRenseignements();
                handleCloseEdit();
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleCloseEdit = () => {
        setEditingItem({
            AVIS_FINANCIER: '',
            REMARQUE: '',
            ENCOURS_FIANANCIER: '',
            ID_DEMANDE: null
        });
    };

    const renderActions = (item) => (
        <TableCell>
            <Tooltip title="Voir détails">
                <IconButton onClick={() => setSelectedItem(item)}><VisibilityIcon /></IconButton>
            </Tooltip>
            {(canAccessFinance() || canAccessAdmin() || isCommercial()) && (
                <Tooltip title="Modifier">
                    <IconButton onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                </Tooltip>
            )}
        </TableCell>
    );

    const renderTableRow = (item) => (
        <TableRow key={item.ID_DEMANDE}>
            <TableCell>{new Date(item.DATE_CREATION).toLocaleDateString()}</TableCell>
            <TableCell>{item.CLIENT}</TableCell>
            <TableCell>{item.COMMERCIAL}</TableCell>
            <TableCell>{item.DATE_DECISION && new Date(item.DATE_DECISION).toLocaleDateString()}</TableCell>
            <TableCell><StatusChip className={item.STATUT}>{item.STATUT}</StatusChip></TableCell>
            <TableCell>{item.AVIS_FINANCIER}</TableCell>
            <TableCell>{item.AVIS_COMERCIAL}</TableCell>
            <TableCell>{item.AVIS_DIRECTION}</TableCell>
            <TableCell>{item.MODE_REGLEMENT}</TableCell>
            <TableCell>{item.ENCOURS_FINAL}</TableCell>
            {renderActions(item)} {/* Add the actions column */}
        </TableRow>
    );

    const renderEditDialog = () => {
        if (!user) return null;

        return (
            <Dialog open={Boolean(editingItem.ID_DEMANDE)} onClose={handleCloseEdit} fullWidth maxWidth="md">
                <DialogTitle>Modifier le Renseignement</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {canAccessFinance() && (
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Avis Financier"
                                    value={editingItem.AVIS_FINANCIER}
                                    onChange={(e) => setEditingItem({ ...editingItem, AVIS_FINANCIER: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="En cours">En cours</MenuItem>
                                    <MenuItem value="Accepté">Accepté</MenuItem>
                                    <MenuItem value="Rejeté">Rejeté</MenuItem>
                                    <MenuItem value="Annulé">Annulé</MenuItem>
                                </TextField>
                                <TextField
                                    label="Encours Financier"
                                    value={editingItem.ENCOURS_FIANANCIER}
                                    onChange={(e) => setEditingItem({ ...editingItem, ENCOURS_FIANANCIER: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                />
                            </Grid>
                        )}

                        {isCommercial() && (
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Avis Commercial"
                                    value={editingItem.AVIS_COMERCIAL}
                                    onChange={(e) => setEditingItem({ ...editingItem, AVIS_COMERCIAL: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="En cours">En cours</MenuItem>
                                    <MenuItem value="Accepté">Accepté</MenuItem>
                                    <MenuItem value="Rejeté">Rejeté</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} startIcon={<CancelIcon />}>Annuler</Button>
                    <Button onClick={handleSave} startIcon={<AddIcon />}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Box>
            <AddButton onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
                Ajouter un renseignement
            </AddButton>

            <TableContainer>
                <TableHeader>
                    {tableHeaders.map((header, idx) => (
                        <TableCell key={idx}>{header}</TableCell>
                    ))}
                </TableHeader>

                {renseignements.length > 0 && (
                    <>
                        {renseignements.map(renderTableRow)}
                    </>
                )}
            </TableContainer>

            {renderEditDialog()}
        </Box>
    );
};

export default RenseignementManagement;
