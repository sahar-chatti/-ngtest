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
import axios from 'axios';
import { useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/Star';

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
        icon: '⏰'
    },
    {
        id: 'creativity',
        label: 'Créativité',
        description: 'Capacité à proposer des solutions innovantes',
        icon: '💡'
    },
    {
        id: 'behavior',
        label: 'Comportement',
        description: 'Attitude générale et relations professionnelles',
        icon: '🤝'
    },
    {
        id: 'elegance',
        label: 'Élégance',
        description: 'Présentation et professionnalisme',
        icon: '✨'
    },
    {
        id: 'discipline',
        label: 'Discipline',
        description: 'Respect des règles et procédures',
        icon: '📋'
    },
    {
        id: 'productivity',
        label: 'Productivité',
        description: 'Efficacité et qualité du travail',
        icon: '📈'
    },
    {
        id: 'objectif',
        label: 'Objectif',
        description: 'Objectifs et réalisation',
        icon: '🎯'
    }
];

const EmployeeEvaluationDialog = ({ open, onClose }) => {
    const theme = useTheme();
    const user = useSelector((state) => state.user);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                const userEvaluations = response.data
                    .filter(evaluation => evaluation.USER_ID === user.ID_UTILISATEUR)
                    .sort((a, b) => new Date(b.EVALUATION_DATE) - new Date(a.EVALUATION_DATE));

                setEvaluation(userEvaluations[0]);
            } catch (err) {
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
            }}>
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
                            {evaluationCriteria.map(({ id, label, description, icon }) => (
                                <Grid item xs={12} sm={6} key={id}>
                                    <StyledPaper>
                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h6" component="span">
                                                {icon}
                                            </Typography>
                                            <Typography variant="h6">
                                                {label}
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
                                        Récompense Totale: {evaluation.TOTAL_SAVINGS} DT
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
