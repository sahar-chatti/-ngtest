import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import { TextField, Button, FormControl, Select, MenuItem } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  Grid,
  Typography,
  Dialog,
  Chip,
  TablePagination
} from '@mui/material';
import {
  Person,
  Phone,
  DirectionsCar,
  CalendarToday,
  Description,
  AspectRatio,
  BrandingWatermark
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const ImageContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  padding: '16px',
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  background: 'rgba(118, 149, 255, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(118, 149, 255, 0.1)',
    transform: 'translateX(5px)',
  },
}));

const ReclamationsList = () => {
  const [reclamations, setReclamations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(0);
  const [decisionDescriptions, setDecisionDescriptions] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [decisions, setDecisions] = useState({});
  const connectedUser = useSelector((state) => state.user);
  const isAdmin = connectedUser?.ROLE === 'administrateur';

  const fetchReclamations = async () => {
    const response = await axios.get('http://192.168.1.170:3300/api/reclamations');
    const formattedData = response.data.data.map(reclamation => ({
      ...reclamation,
      images: reclamation.images.map(img =>
        `https://api.pneu-mafamech.cspddammak.com/api/Requests/reclamation_images/${img.split('/').pop()}`
      )
    }));
    setReclamations(formattedData);
  };

  useEffect(() => {
    fetchReclamations();
  }, []);
  const handlePrint = (reclamation) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Réclamation #${reclamation.id}</title>
        <style>
          body {
            font-family: 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #1a237e;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 10px;
          }
          .title {
            color: #1a237e;
            font-size: 24px;
            font-weight: bold;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .info-item {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .label {
            font-weight: bold;
            color: #1a237e;
          }
          .images-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          .image {
            width: 100%;
            border-radius: 8px;
            border: 1px solid #ddd;
          }
          .decision-section {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Fiche de Réclamation #${reclamation.id}</div>
        </div>
  
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Client:</span> ${reclamation.name}
          </div>
          <div class="info-item">
            <span class="label">Téléphone:</span> ${reclamation.phone_number}
          </div>
          <div class="info-item">
            <span class="label">Véhicule:</span> ${reclamation.vehicule}
          </div>
          <div class="info-item">
            <span class="label">Dimension:</span> ${reclamation.dimension}
          </div>
          <div class="info-item">
            <span class="label">Marque:</span> ${reclamation.marque}
          </div>
          <div class="info-item">
            <span class="label">DOT:</span> ${moment(reclamation.date_fabrication).format('DD/MM/YYYY')}
          </div>
        </div>
  
        <div class="info-item">
          <span class="label">Description:</span>
          <p>${reclamation.description}</p>
        </div>
  
        <div class="decision-section">
          <span class="label">Décision:</span> ${reclamation.decision || 'En attente'}
          <p><span class="label">Avis:</span> ${reclamation.decision_description || ''}</p>
        </div>
  
        <div class="images-container">
          ${reclamation.images?.map(img => `
            <img src="${img}" class="image" alt="Photo réclamation"/>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  const handleDecisionChange = async (id, decision, description) => {
    try {
      const response = await axios.put(`http://192.168.1.170:3300/reclamations/${id}`, {
        decision: decision,
        decision_description: description
      });

      if (response.data.success) {
        setDecisions((prevDecisions) => ({
          ...prevDecisions,
          [id]: decision,
        }));
        setDecisionDescriptions((prevDescriptions) => ({
          ...prevDescriptions,
          [id]: description,
        }));
        fetchReclamations();
      }
    } catch (error) {
      console.error('Error updating decision:', error);
    }
  };



  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1a237e' }}>
        Réclamations Dashboard
      </Typography>

      <Grid container spacing={3}>
        {reclamations
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((reclamation) => (
            <Grid item xs={12} md={6} lg={4} key={reclamation.id}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                      {reclamation.name}
                    </Typography>
                    <Chip label={`ID: ${reclamation.id}`} color="primary" /> <Button
      variant="contained"
      color="primary"
      size="small"
      startIcon={<PrintIcon />}
      onClick={() => handlePrint(reclamation)}
    >
      
    </Button>
                  </Box>
                  
                  <ImageContainer>
                    {reclamation.images?.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        alt={`Image ${index + 1}`}
                        sx={{
                          width: 150,
                          height: 150,
                          borderRadius: 2,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </ImageContainer>


                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <InfoItem>
                        <Person sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}> Utilisateur : </Typography>

                        <Typography>{reclamation.name}</Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <Phone sx={{ color: '#3572EF', mr: 2 }} /> 
                        <Typography sx={{ fontWeight: 'bold' }}>Numéro téléphone :</Typography>

                        <Typography>{reclamation.phone_number}</Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <DirectionsCar sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}> Véhicule : </Typography>

                        <Typography>{reclamation.vehicule}</Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <AspectRatio sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}> Dimension : </Typography>

                        <Typography>{reclamation.dimension}</Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoItem>
                        <BrandingWatermark sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}> Marque : </Typography>

                        <Typography>{reclamation.marque}</Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <InfoItem>
                        <CalendarToday sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}>DOT : </Typography>

                        <Typography>
                          {moment(reclamation.date_fabrication).format('DD/MM/YYYY')}
                        </Typography>
                      </InfoItem>
                    </Grid>
                    <Grid item xs={12}>
                      <InfoItem>
                        <Description sx={{ color: '#3572EF', mr: 2 }} />
                        <Typography sx={{ fontWeight: 'bold' }}>Description : </Typography>
                        <Typography>{reclamation.description}</Typography>
                      </InfoItem>
                    </Grid>
 
                  </Grid>
                </Box>
                
                <Grid item xs={12}>
                  <InfoItem sx={{ display: 'flex', gap: 1 }}>
                    <FormControl fullWidth>
                      <Select
                        value={decisions[reclamation.id] || reclamation.decision || ''}
                        disabled={!isAdmin}
                        onChange={(e) => setDecisions({
                          ...decisions,
                          [reclamation.id]: e.target.value
                        })}
                        sx={{
                          backgroundColor:
                            decisions[reclamation.id] === 'Bonifié' ? '#e8f5e9' :
                              decisions[reclamation.id] === 'Non Bonifié' ? '#ffebee' :
                                'white'
                        }}
                      >
                        <MenuItem value="">Select Decision</MenuItem>
                        <MenuItem value="Bonifié">Bonifié</MenuItem>
                        <MenuItem value="Non Bonifié">Non Bonifié</MenuItem>
                        <MenuItem value="Geste Commercial">Geste Commercial</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Avis"
                      multiline
                      disabled={!isAdmin}
                      value={decisionDescriptions[reclamation.id] || reclamation.decision_description || ''}
                      onChange={(e) => setDecisionDescriptions({
                        ...decisionDescriptions,
                        [reclamation.id]: e.target.value
                      })}
                    />


                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isAdmin}
                      onClick={() => handleDecisionChange(reclamation.id, decisions[reclamation.id], decisionDescriptions[reclamation.id])}
                    >
                      valider    </Button>
                  </InfoItem>
                </Grid>
              </StyledCard>
            </Grid>
          ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination
          component="div"
          count={reclamations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[6, 12, 24]}
        />
      </Box>

      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="xl"
      >
        <img
          src={selectedImage}
          alt="Enlarged view"
          style={{
            maxWidth: '100vw',
            maxHeight: '90vh',
            objectFit: 'contain'
          }}
        />
      </Dialog>
    </Box>
  );
};

export default ReclamationsList;
