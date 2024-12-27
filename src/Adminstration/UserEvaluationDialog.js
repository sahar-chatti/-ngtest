import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Rating,
    Typography,
    Grid,
    Paper,
    Box,
    CircularProgress,
    Fade,
    styled,
    useTheme
} from '@mui/material';
import Talent from '../images/TalentBH.png'
import axios from 'axios';
import { useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconFilled': {
        color: theme.palette.primary.main
    }
}));

const evaluationCriteria = [
    {
        id: 'punctuality',
        label: 'Ponctualité',
        description: 'Évaluation de la ponctualité au travail',
        icon: '⏰',
        value: '0.5 DT / étoile'
    },
    {
        id: 'creativity',
        label: 'Créativité',
        description: 'Capacité à proposer des solutions innovantes',
        icon: '💡',
        value: '1.5 DT / étoile'
    },
    {
        id: 'behavior',
        label: 'Comportement',
        description: 'Attitude générale et relations professionnelles',
        icon: '🤝',
        value: '1.5 DT / étoile'
    },
    {
        id: 'elegance',
        label: 'Élégance',
        description: 'Présentation et professionnalisme',
        icon: '✨',
        value: '1.5 DT / étoile'
    },
    {
        id: 'discipline',
        label: 'Discipline',
        description: 'Respect des règles et procédures',
        icon: '📋',
        value: '1.5 DT / étoile'
    },
    {
        id: 'productivity',
        label: 'Productivité',
        description: 'Efficacité et qualité du travail',
        icon: '📈',
        value: '1.5 DT / étoile'
    },
    {
        id: 'objectif',
        label: 'Objectif',
        description: 'Objectifs et réalisation',
        icon: '🎯',
        value: '100 DT / étoile'
    }
];


const EmployeeEvaluationDialog = ({ open, onClose }) => {
    const theme = useTheme();
    const user = useSelector((state) => state.user);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


// Add console logs to debug the API response
useEffect(() => {
    const fetchEvaluation = async () => {
        if (!user?.LOGIN) return;

        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.1.170:3300/api/evaluations`, {
                params: {
                    userLogin: user.LOGIN,
                    userId: user.ID_UTILISATEUR
                }
            });

            console.log('API Response:', response.data); // Add this log

            const userEvaluations = response.data
    .filter(evaluation => 
        evaluation.USER_ID === user.ID_UTILISATEUR && 
        evaluation.STATE === 'VALIDATED' // Check if it's 'VALIDATED' instead of 'validated'
    )
    .sort((a, b) => new Date(b.EVALUATION_DATE) - new Date(a.EVALUATION_DATE));

            setEvaluation(userEvaluations[0]);
        } catch (err) {
            console.error('API Error:', err); // Add this log
            setError('Impossible de récupérer les données d\'évaluation');
        } finally {
            setLoading(false);
        }
    };

    if (open && user?.LOGIN) {
        fetchEvaluation();
    }
}, [open, user]);

    if (!open) return null;
    const isPrintable = () => {
        const today = new Date();
        return today.getDate() >= 1;
    };
    const handlePrint = (evaluation) => {
        const imageUrl = Talent;

        const printContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="text-align: center;">Évaluation de l'Employé</h2>
            <hr/>
            <div style="margin: 20px 0;">
                <p><strong>Employé:</strong> ${user?.UTILISATEUR}</p>
                <p><strong>Date d'évaluation:</strong> ${new Date(evaluation?.EVALUATION_DATE).toLocaleString()}</p>
                
                <div style="margin: 20px 0;">
                    ${evaluationCriteria.map(({ id, label, icon }) => `
                        <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
                            <p><strong>${icon} ${label}:</strong> ${id === 'punctuality' ? 5 : Number(evaluation?.[id.toUpperCase()]) || 0} étoiles</p>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
                    <p style="text-align: center; font-size: 18px;">
                        <strong>Récompense Totale:</strong> ${evaluation?.TOTAL_SAVINGS} DT
                    </p>
                </div>
            </div>

            <h3 style="text-align: center;">Ordre de Virement</h3>
            <img src="${imageUrl}" alt="Ordre de Virement" style="width: 100%; height: auto; margin-top: 20px;"/>

            <div style="margin-top: 20px; display: flex; justify-content: space-between; width: 100%;">
                <div style="text-align: center;">
                    <p>Signature financier: _________________</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div style="text-align: center;">
                    <p>Signature direction: _________________</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div style="text-align: center;">
                    <p>Signature employé: _________________</p>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
};
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{ 
                background: theme.palette.primary.main,
                color: 'white',
                pb: 1
            }}><Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => handlePrint(evaluation)}
            disabled={!isPrintable()}
            sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                borderRadius: '8px',
                padding: '8px 16px',
                position:'end',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                '&.Mui-disabled': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    color: 'rgba(0,0,0,0.26)',
                },
                transition: 'all 0.2s ease-in-out'
            }}
        >
        </Button>
        
        
                <Typography variant="h5" fontWeight="bold">
                    Évaluation de {user?.UTILISATEUR}
                </Typography>
                {evaluation?.EVALUATION_DATE && (
                    <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                        {new Date(evaluation.EVALUATION_DATE).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <Typography color="error" variant="h6">
                            {error}
                        </Typography>
                    </Box>
                ) : (
                    <Fade in={!loading}>
                        <Grid container spacing={3}>
                            {evaluationCriteria.map(({ id, label, description, icon,value }) => (
                                <Grid item xs={12} sm={6} key={id}>
                                    <StyledPaper>
                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h6" component="span">
                                                {icon}
                                            </Typography>
                                            <Typography variant="h6">
                                                {label}
                                            </Typography>
                                            <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >                    {value}
                </Typography>
                                        </Box>
                                        <StyledRating
                                            value={id === 'punctuality' ? 5 : Number(evaluation?.[id.toUpperCase()]) || 0}
                                            readOnly
                                            precision={0.5}
                                            icon={<StarIcon fontSize="inherit" />}
                                        />
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {description}
                                        </Typography>
                                    </StyledPaper>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <StyledPaper sx={{ 
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText
                                }}>
                                   <Typography variant="h5" align="center">
    Récompense Totale: {evaluation && evaluation.TOTAL_SAVINGS ? evaluation.TOTAL_SAVINGS : 'Non disponible'} DT
</Typography>

                                </StyledPaper>
                            </Grid>
                        </Grid>
                    </Fade>
                )}
            </DialogContent>
        </Dialog>
    );
}; 

export default EmployeeEvaluationDialog;
