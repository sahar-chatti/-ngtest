import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Snackbar,
    TablePagination,
    Box,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, useMediaQuery } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../Utilis/constantes';
const ClientList = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md')); // 
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false); // State to manage the add/edit dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to manage the delete confirmation dialog
    const [selectedPartner, setSelectedPartner] = useState(null); // State to store details of the selected partner
    const [libelle, setLibelle] = useState(''); // State to store the libelle of the selected partner in the dialog
    const [couleur, setCouleur] = useState(''); // State to store the couleur of the selected partner in the dialog
    const [avancement, setAvancement] = useState('En cours'); // State to store the avancement of the selected partner in the dialog
    const [nUMorder, setOrder] = useState(''); // State to store the num order of the selected partner in the dialog
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // setLoading(true);
        axios.get(`${BASE_URL}/api/StatutPartenaires`)
            .then(response => {
                console.log('Data from API:', response.data);
                setClients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('There was an error fetching the statuts!');
                setLoading(false);
            });
    }, [page, pageSize]);

    const columns = [
        { id: 'NUM_ORDER', label: 'Numéro Ordre', minWidth: 100 },
        { id: 'COULEUR', label: 'COULEUR', minWidth: 100 },
        { id: 'LIBELLE', label: 'LIBELLE', minWidth: 100 },
        { id: 'AVANCEMENT', label: 'AVANCEMENT', minWidth: 100 },
        { id: 'actions', label: 'ACTIONS', minWidth: 100 }, // Added actions column
    ];

    const avancementOptions = [
        'En cours',
        'Accepter par collaborateur',
        'Refuser',
        'Injoignable',
        'Contrat signé',
        "En cours de signature",
        'Injoignable pour signature',
        'A rappeler'
    ];

    const handleOpen = (partner) => {
        setSelectedPartner(partner);
        setLibelle(partner?.LIBELLE || '');
        setCouleur(partner?.COULEUR || '');
        setAvancement(partner?.AVANCEMENT);
        setOrder(partner?.NUM_ORDER || '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPartner(null);
        setLibelle('');
        setCouleur('');
    };

    const handleSavePartner = () => {
        const existingPartner = clients.find(partner => partner.LIBELLE === libelle);

        if (existingPartner && !selectedPartner) {
            setErrorMessage('Ce statut existe déjà.');
            setOpenErrorSnackbar(true);
            handleClose();
            return;
        }

        const data = {
            NUM_ORDER: nUMorder,
            COULEUR: couleur,
            LIBELLE: libelle,
            AVANCEMENT: avancement,
        };

        if (!selectedPartner || !selectedPartner.ID_STATUT) {
            // Create a new partner
            axios.post(`${BASE_URL}/api/CreateStatutPartenaires`, data)
                .then(response => {
                    console.log('Statut partenaire créé avec succès:', response.data.result);
                    setClients([...clients, response.data.result]);
                    setSuccessMessage('Statut partenaire créé avec succès');
                    setOpenSuccessSnackbar(true);
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la création du Statut:', error);
                    setErrorMessage('Erreur lors de la création du Statut');
                    setOpenErrorSnackbar(true);
                });
        } else {
            // Update an existing partner
            axios.put(`${BASE_URL}/api/UpdateStatutPartenaires/${selectedPartner.ID_STATUT}`, { data })
                .then(response => {
                    console.log('Statut partenaire mis à jour avec succès:', response.data.result);
                    setClients(clients.map(partner =>
                        partner.ID_STATUT === selectedPartner.ID_STATUT ? response.data.result : partner
                    ));
                    setSuccessMessage('Statut partenaire mis à jour avec succès');
                    setOpenSuccessSnackbar(true);
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du Statut:', error);
                    setErrorMessage('Erreur lors de la mise à jour du Statut');
                    setOpenErrorSnackbar(true);
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
        axios.delete(`${BASE_URL}/api/DeleteStatutPartenaire/${selectedPartner.ID_STATUT}`)
            .then(response => {
                console.log('Statut partenaire supprimé avec succès:', response.data);
                setClients(clients.filter(partner => partner.ID_STATUT !== selectedPartner.ID_STATUT));
                setSuccessMessage('Statut partenaire supprimé avec succès');
                setOpenSuccessSnackbar(true);
                handleCloseDeleteDialog();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du Statut:', error);
                setErrorMessage('Erreur lors de la suppression du Statut');
                setOpenErrorSnackbar(true);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
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
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Ajouter
                </Button>
            </Box>
            <Paper elevation={3} sx={{ overflow: 'auto' }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table" >
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
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
                                                <TableCell key={column.id} align="left">
                                                    <Box display="flex" justifyContent="center" alignItems="center">
                                                        <Tooltip title="Modifier">
                                                            <IconButton style={{ color: 'green' }} onClick={() => handleOpen(client)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer">
                                                            <IconButton style={{ color: 'red' }} onClick={() => handleOpenDeleteDialog(client)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            );
                                        } else {
                                            return (
                                                <TableCell key={column.id} align="left">
                                                    {value}
                                                </TableCell>
                                            );
                                        }
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog for adding/editing partner */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {selectedPartner ? 'Modifier' : 'Ajouter'} Statut Partenaire
                    <IconButton onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remplissez les informations du statut partenaire.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="libelle"
                        label="Libellé"
                        required
                        fullWidth
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="couleur"
                        label="Couleur"
                        required
                        fullWidth
                        value={couleur}
                        onChange={(e) => setCouleur(e.target.value)}
                        select
                    >
                        {["orange", "red", "blue", "green", "black", "white", "pink", "purple"].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        id="nUMorder"
                        label="Numéro ordre"
                        required
                        type="number"
                        fullWidth
                        value={nUMorder}
                        onChange={(e) => setOrder(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Avancement</InputLabel>
                        <Select
                            value={avancement}
                            onChange={(e) => setAvancement(e.target.value)}
                            label="Avancement"
                        >
                            {avancementOptions.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSavePartner} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for delete confirmation */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>
                    Confirmation de suppression
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer ce statut de Partenaire ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDeletePartner} color="primary" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for success message */}
            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Snackbar for error message */}
            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>

            {/* Pagination for table */}
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
        </Container>
    );
};

export default ClientList;
