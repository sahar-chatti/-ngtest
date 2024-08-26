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
import { Select, MenuItem, InputLabel,FormControl } from '@mui/material'; 
import BASE_URL from './constantes';
const ClientList = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md')); // Vérifier la taille de l'écran moyen
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false); // État pour gérer l'ouverture du popup d'ajout
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // État pour gérer l'ouverture du popup de suppression
    const [selectedPartner, setSelectedPartner] = useState(null); // État pour stocker les détails du partenaire sélectionné
    const [libelle, setLibelle] = useState(''); // État pour stocker le libellé du partenaire sélectionné dans le popup
    const [avancement, setAvancement] = useState('');
    const [update_statut, setStatut] = useState('');
    const [selectValue1, setSelectValue1] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [statuts,setStatus]=useState([])
    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };
    const handleCloseSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };
    useEffect(() => {
       // setLoading(true);
        axios.get(`${BASE_URL}/api/QualificationAppels?page=${page + 1}&pageSize=${pageSize}`)
            .then(response => {
                console.log('Data from API:', response.data);
                setClients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('There was an error fetching the qualifications!');
                setLoading(false);
            });
            axios.get(`${BASE_URL}/api/StatutPartenaires`)
            .then(response => {
                console.log('Data from API:', response.data);
                setStatus(response.data);
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('There was an error fetching the statuts!');
               
            });
    }, [page, pageSize]);
    const columns = [
        { id: 'LIBELLE', label: 'LIBELLE', minWidth: 100 },
        { id: 'AVANCEMENT', label: 'AVANCEMENT', minWidth: 100 },
        { id: 'UPDATE_STATUS', label: 'UPDATE_STATUS', minWidth: 100 },
        { id: 'actions', label: 'ACTIONS', minWidth: 100 }, // Ajout de la colonne actions
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
    useEffect(()=>{
console.log("update_statut",update_statut)
    },[update_statut])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    };

    const handleOpen = (partner) => {
        setSelectedPartner(partner);
        setLibelle(partner?.LIBELLE || ''); // Initialiser le libellé avec la valeur actuelle
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPartner(null);
        setLibelle(''); // Réinitialiser le libellé après la fermeture du popup
    };

    const handleSaveCommunication = () => {
        const existingpartner = clients.find(partner => partner.LIBELLE === libelle);

    if (existingpartner) {
        // Afficher une Snackbar pour informer que la raison existe déjà
        setErrorMessage("Cette Qualification d'appel existe déjà.");
        setOpenErrorSnackbar(true);
        handleClose();
        return; // Sortir de la fonction sans exécuter la requête
    }
        if (!selectedPartner || !selectedPartner.ID_QUALIFICATION) {
            // Création d'une nouvelle raison
            axios.post(`${BASE_URL}/api/CreateQualificationAppels`, { LIBELLE: libelle ,AVANCEMENT:avancement,UPDATE_STATUS: update_statut})
                .then(response => {
                    console.log('Qualification appel créé avec succès:', response.data);
                    setClients(prevClients => [...prevClients, response.data.result]);
                    setSuccessMessage('Qualification appel créé avec succès');
                    setOpenSuccessSnackbar(true); // Afficher la Snackbar après la création réussie
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la création du appel:', error);
                    setError('There was an error creating the appel!');
                });
        } else {
            // Mise à jour d'une raison existante
            axios.put(`${BASE_URL}/api/UpdateQualificationAppel`, {
                ID_STATUT: selectedPartner.ID_QUALIFICATION,
                LIBELLE: libelle,
                AVANCEMENT: avancement,UPDATE_STATUS: update_statut
            })
                .then(response => {
                    console.log('Qualification_appel mise à jour avec succès:', response.data);
                    setClients(prevClients =>
                        prevClients.map(partner =>
                            partner.ID_QUALIFICATION === selectedPartner.ID_QUALIFICATION ? response.data.result : partner
                        )
                    );
                    setSuccessMessage('Qualification Appel mise à jour avec succès');
                    setOpenSuccessSnackbar(true); // Afficher la Snackbar après la mise à jour réussie
                    handleClose();
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du Qualification:', error);
                    setError('There was an error updating the Qualification!');
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
        axios.delete(`${BASE_URL}/api/DeleteQualificationAppel/${selectedPartner.ID_QUALIFICATION}`)
        .then(response => {
            console.log('Qualification appel supprimé avec succès:', response.data);
            // Mettre à jour l'état des clients après suppression
            setClients(clients.filter(partner => partner.ID_QUALIFICATION !== selectedPartner.ID_QUALIFICATION));
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du qualifiaction:', error);
            setError('Failed to delete qualification');
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
    const handleAvancementChange = (event) => {
        const selectedAvancement = event.target.value;
        setAvancement(selectedAvancement);

        const matchingStatut = statuts.find(statut => statut.AVANCEMENT === selectedAvancement);

        if (matchingStatut) {
            setStatut(matchingStatut.ID_STATUT);
        } else {
            setStatut('');
        }
    };

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
                                            <TableCell key={column.id} align="left">
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
                    Détails de la Qualification d'appel
                    <IconButton onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remplissez les détails de la Qualification d'appel.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="details"
                        label="Libellé"
                        fullWidth
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Avancement</InputLabel>
                        <Select
                            value={avancement}
                            onChange={handleAvancementChange}
                            label="Statut"
                        >
                            {avancementOptions.map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Statut modifiée</InputLabel>
                        <Select
                            value={avancement}
                            onChange={(e) => setAvancement(e.target.value)}
                            label="Statut"
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
                    <Button onClick={handleSaveCommunication} color="primary">
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
                <DialogTitle>Confirmation de suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer ce partenaire ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDeletePartner} color="primary">
                        Confirmer
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
        </Container>
    );
};

export default ClientList;
