import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Alert,
    Box,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    DialogContentText,
    Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import BASE_URL from '../Utilis/constantes';
const ClientList = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [libelle, setLibelle] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };
    const handleCloseSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };

    useEffect(() => {
        // setLoading(true);
        axios.get(`${BASE_URL}/api/RaisonsList`)
            .then(response => {
                console.log('Data from API:', response.data);
                setClients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('There was an error fetching the raisons!');
                setLoading(false);
            });
    }, [page, pageSize]);

    const columns = [
        { id: 'LIBELLE', label: 'LIBELLE', minWidth: 100 },
        { id: 'actions', label: 'ACTIONS', minWidth: 100 },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    };

    const handleOpen = (partner) => {
        setSelectedPartner(partner);
        setLibelle(partner?.LIBELLE || '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPartner(null);
        setLibelle('');
    };

    const handleSaveCommunication = () => {
        const existingClient = clients.find(client => client.LIBELLE === libelle);

        if (existingClient) {
            // Afficher une Snackbar pour informer que la raison existe déjà
            setErrorMessage('Cette raison existe déjà.');
            setOpenErrorSnackbar(true);
            handleClose();
            return; // Sortir de la fonction sans exécuter la requête
        }
        if (!selectedPartner || !selectedPartner.ID_RAISON) {
            // Création d'une nouvelle raison
            axios.post(`${BASE_URL}/api/CreateRaisons`, { LIBELLE: libelle })
                .then(response => {
                    console.log('Raison créée avec succès:', response.data.result);
                    setClients(response.data.result);

                    setSuccessMessage('Raison créée avec succès');
                    setOpenSuccessSnackbar(true); // Afficher la Snackbar après la création réussie
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la création de la raison:', error);
                    setError('There was an error creating the raison!');
                });
        } else {
            // Mise à jour d'une raison existante
            axios.put(`${BASE_URL}/api/UpdateRaison`, {
                ID_RAISON: selectedPartner.ID_RAISON,
                LIBELLE: libelle
            })
                .then(response => {
                    console.log('Raison mise à jour avec succès:', response.data);
                    setClients(prevClients =>
                        prevClients.map(client =>
                            client.ID_RAISON === selectedPartner.ID_RAISON ? response.data.result : client
                        )
                    );
                    setSuccessMessage('Raison mise à jour avec succès');
                    setOpenSuccessSnackbar(true); // Afficher la Snackbar après la mise à jour réussie
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour de la raison:', error);
                    setError('There was an error updating the raison!');
                });
        }
    };


    const handleOpenDeleteDialog = (partner) => {
        setSelectedPartner(partner);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedPartner(null);
    };

    const handleDeletePartner = () => {
        axios.delete(`${BASE_URL}/api/DeleteRaison/${selectedPartner.ID_RAISON}`)
            .then(response => {
                console.log('Raison supprimée avec succès:', response.data);
                // Mettre à jour l'état des clients après suppression
                setClients(clients.filter(client => client.ID_RAISON !== selectedPartner.ID_RAISON));
                setSuccessMessage('Raison supprimée avec succès');
                setOpenSuccessSnackbar(true); // Afficher la Snackbar après la mise à jour réussie
                handleClose();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la raison:', error);
                setError('Failed to delete raison');
            });

        setOpenDeleteDialog(false);
        setSelectedPartner(null);
    };

    if (loading) {
        return (
            <Container sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, height: '77vh', width: '1000vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Ajouter
                </Button>
            </Box>
            <Paper elevation={3} sx={{ flex: '1', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table" >
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',

                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client, index) => (
                                <TableRow key={index} hover>
                                    {columns.map((column) => {
                                        const value = client[column.id];
                                        if (column.id === 'actions') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Box display="flex" justifyContent="center" alignItems="center">
                                                        <Tooltip title="Modifier">
                                                            <IconButton
                                                                style={{ color: 'green' }} // Change color to green for edit button
                                                                onClick={() => handleOpen(client)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer">
                                                            <IconButton
                                                                style={{ color: 'red' }} // Change color to red for delete button
                                                                onClick={() => handleOpenDeleteDialog(client)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>

                                            );
                                        }
                                        return (
                                            <TableCell key={column.id} align='left'>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Détails du raison d'appel
                    <IconButton onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remplissez les détails de la raison.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="details"
                        required
                        label="Libellé"
                        fullWidth
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSaveCommunication} color="primary" variant="contained" startIcon={<SaveIcon />}>
                        Enregistrer
                    </Button>
                    <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="success">
                            {successMessage}
                        </Alert>
                    </Snackbar>
                    <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                        <Alert onClose={handleCloseErrorSnackbar} severity="error">
                            {errorMessage}
                        </Alert>
                    </Snackbar>


                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>
                    Confirmation de suppression
                    <IconButton onClick={handleCloseDeleteDialog} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer cette raison ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDeletePartner} color="primary" variant="contained" startIcon={<DeleteIcon />}>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100, 150, 200]}
                    component="div"
                    count={clients.length}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ClientList;
