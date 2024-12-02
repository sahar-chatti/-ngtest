import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import BASE_URL from './constantes';
import SavImportExport from './SavImportExport';
import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const AddButton = styled.button`
  background: #4299e1;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  margin-bottom: 20px;
  cursor: pointer;

  &:hover {
    background: #3182ce;
  }
`;

const NoClaimsMessage = styled.div`
  text-align: center;
  margin: 20px;
  color: #666;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const TableHeader = styled.div`
  display: flex;
  background: #9dbdff;
  padding: 10px;
  font-weight: bold;
`;

const TableRow = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background: #f0f0f0;
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 8px;
  text-align: left;
  min-width: 70px;

  &:last-child {
    display: flex;
    justify-content: flex-end;
  }
`;

const SavManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/getSavMagasin`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setClaims(data);
            }
        } catch (error) {
            console.error('Error fetching claims:', error);
        }
    };

    const handleViewDetails = (claim) => {
        setSelectedClaim(claim);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedClaim(null);
    };
    const handleFileDownload = async (fileName) => {
        try {
            const response = await fetch(`${BASE_URL}/api/download/${fileName}`, {
                credentials: 'include'
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };
    const handleFileDisplay = (filesData) => {
        try {
            if (!filesData) return [];

            if (typeof filesData === 'string') {
                const parsed = JSON.parse(filesData);
                return Array.isArray(parsed) ? parsed : [parsed];
            }

            if (Array.isArray(filesData)) {
                return filesData;
            }

            return [];
        } catch (error) {
            console.error('Error parsing files data:', error);
            return [];
        }
    };


    const handlePrint = () => {
        if (!selectedClaim) return;

        console.log("selectedClaim.FILES:", selectedClaim.FILES);

        let files;

        if (Array.isArray(selectedClaim.FILES)) {
            // If FILES is an array, join its elements into a string
            files = selectedClaim.FILES.join(', ');
        } else if (typeof selectedClaim.FILES === 'string') {
            // If FILES is a string, use it directly
            files = selectedClaim.FILES;
        } else {
            // If FILES is neither, set a default message
            files = 'No files available';
        }

        const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4299e1;">Détails de la Réclamation</h2>
        <p><strong>ID:</strong> ${selectedClaim.ID}</p>
        <p><strong>Utilisateur:</strong> ${selectedClaim.USER_NAME}</p>
        <p><strong>Date:</strong> ${new Date(selectedClaim.DEMAND_DATE).toLocaleDateString()}</p>
        <p><strong>Pneu:</strong> ${selectedClaim.PNEU}</p>
        <p><strong>Description:</strong> ${selectedClaim.DESCRIPTION}</p>
        <p><strong>Grossiste:</strong> ${selectedClaim.GROSSISTE}</p>
        <p><strong>Vendeur:</strong> ${selectedClaim.VENDEUR}</p>
        <p><strong>Utilisateur Final:</strong> ${selectedClaim.UTILISATEUR}</p>
        <p><strong>Adresse:</strong> ${selectedClaim.ADRESSE}</p>
        <p><strong>Véhicule:</strong> ${selectedClaim.VEHICULE}</p>
        <p><strong>Marque:</strong> ${selectedClaim.MARQUE}</p>
        <p><strong>Matricule:</strong> ${selectedClaim.MATRICULE}</p>
        <p><strong>Parcours:</strong> ${selectedClaim.PARCOURS}</p>
        <p><strong>Charge:</strong> ${selectedClaim.CHARGE}</p>
        <p><strong>Kilométrage:</strong> ${selectedClaim.KM}</p>
        <p><strong>Type Utilisation:</strong> ${selectedClaim.TYPE_UTILISATION}</p>
        <p><strong>Décision:</strong> ${selectedClaim.DECISION}</p>
        <p><strong>Gamme:</strong> ${selectedClaim.GAMME}</p>
        <p><strong>Raison:</strong> ${selectedClaim.RAISON}</p>
        <p><strong>Magasinier:</strong> ${selectedClaim.MAGASINIER}</p>
        <p><strong>État Réception:</strong> ${selectedClaim.RECEPTION}</p>
        <p><strong>Fichiers:</strong> ${files}</p>
      </div>
    `;

        const newWindow = window.open('', '', 'width=800,height=600');
        newWindow.document.write(`
      <html>
        <head>
          <title>Impression Réclamation</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { color: #4299e1; }
            p { font-size: 14px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Gestion des Réclamations
            </Typography>

            <AddButton onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Fermer le formulaire' : <><AddIcon /> Nouvelle réclamation</>}
            </AddButton>

            {showForm && <SavImportExport onSubmitSuccess={() => {
                setShowForm(false);
                fetchClaims();
            }} />}

            <TableContainer>
                <TableHeader>
                    {['Utilisateur', 'Date', 'Client', 'Pneu', 'Description', 'Réception', 'Magasinier', 'files', 'Actions'].map(header => (
                        <TableCell key={header}>{header}</TableCell>
                    ))}
                </TableHeader>
                {claims.length === 0 ? (
                    <NoClaimsMessage>Aucune réclamation</NoClaimsMessage>
                ) : (
                    claims.map((claim) => (
                        <TableRow key={claim.ID}>
                            <TableCell>{claim.USER_NAME}</TableCell>
                            <TableCell>{new Date(claim.DEMAND_DATE).toLocaleDateString()}</TableCell>
                            <TableCell>{claim.UTILISATEUR}</TableCell>
                            <TableCell>{claim.PNEU}</TableCell>
                            <TableCell>{claim.DESCRIPTION}</TableCell>
                            <TableCell>{claim.RECEPTION}</TableCell>
                            <TableCell>{claim.MAGASINIER}</TableCell>
                            <TableCell>
                                {claim.FILES && (
                                    <div>
                                        {handleFileDisplay(claim.FILES).map((file, index) => (
                                            <Button
                                                key={index}
                                                size="small"
                                                startIcon={<CloudDownloadIcon />}
                                                onClick={() => handleFileDownload(file)}
                                            >
                                                {typeof file === 'string' ? file : file.name}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <Tooltip title="Voir détails">
                                    <IconButton onClick={() => handleViewDetails(claim)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableContainer>

            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
                <DialogTitle>Détails de la Réclamation</DialogTitle>
                <DialogContent>
                    {selectedClaim && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>ID:</strong> {selectedClaim.ID}</Typography>
                                <Typography><strong>Utilisateur:</strong> {selectedClaim.USER_NAME}</Typography>
                                <Typography><strong>Date:</strong> {new Date(selectedClaim.DEMAND_DATE).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Pneu:</strong> {selectedClaim.PNEU}</Typography>
                                <Typography><strong>Description:</strong> {selectedClaim.DESCRIPTION}</Typography>
                                <Typography><strong>Grossiste:</strong> {selectedClaim.GROSSISTE}</Typography>
                                <Typography><strong>Vendeur:</strong> {selectedClaim.VENDEUR}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Adresse:</strong> {selectedClaim.ADRESSE}</Typography>
                                <Typography><strong>Véhicule:</strong> {selectedClaim.VEHICULE}</Typography>
                                <Typography><strong>Marque:</strong> {selectedClaim.MARQUE}</Typography>
                                <Typography><strong>Matricule:</strong> {selectedClaim.MATRICULE}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Type Utilisation:</strong> {selectedClaim.TYPE_UTILISATION}</Typography>
                                <Typography><strong>Décision:</strong> {selectedClaim.DECISION}</Typography>
                                <Typography><strong>Gamme:</strong> {selectedClaim.GAMME}</Typography>
                                <Typography><strong>Raison:</strong> {selectedClaim.RAISON}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Fichiers:</Typography>
                                {selectedClaim?.FILES && (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {handleFileDisplay(selectedClaim.FILES).map((file, index) => (
                                            <li key={index} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<CloudDownloadIcon />}
                                                    onClick={() => handleFileDownload(file)}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    {file.replace(/["[\]]/g, '')}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Charge:</strong> {selectedClaim.CHARGE}</Typography>
                                <Typography><strong>Kilométrage:</strong> {selectedClaim.KM}</Typography>
                                <Typography><strong>Parcours:</strong> {selectedClaim.PARCOURS}</Typography>
                                <Typography><strong>État Réception:</strong> {selectedClaim.RECEPTION}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Fermer</Button>
                    <Button onClick={handlePrint}>Imprimer</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default SavManagement;
