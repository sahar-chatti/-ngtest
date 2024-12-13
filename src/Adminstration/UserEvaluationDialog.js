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
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const evaluationCriteria = [
    {
        id: 'punctuality',
        label: 'Ponctualité',
        description: 'Évaluation de la ponctualité au travail'
    },
    {
        id: 'creativity',
        label: 'Créativité',
        description: 'Capacité à proposer des solutions innovantes'
    },
    {
        id: 'behavior',
        label: 'Comportement',
        description: 'Attitude générale et relations professionnelles'
    },
    {
        id: 'elegance',
        label: 'Élégance',
        description: 'Présentation et professionnalisme'
    },
    {
        id: 'discipline',
        label: 'Discipline',
        description: 'Respect des règles et procédures'
    },
    {
        id: 'productivity',
        label: 'Productivité',
        description: 'Efficacité et qualité du travail'
    }
];

const EmployeeEvaluationDialog = ({ open, onClose }) => {
    const user = useSelector((state) => state.user);
    console.log('Redux User State:', user);
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchEvaluation = async () => {
            if (!user?.LOGIN) {
                console.log('No user login found');
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching evaluations for user:', user.LOGIN);

                const response = await axios.get(`http://192.168.1.170:3300/api/evaluations`, {
                    params: {
                        userLogin: user.LOGIN,
                        userId: user.ID_UTILISATEUR
                    }
                });

                console.log('All evaluations for user:', response.data);
                const userEvaluations = response.data
                    .filter(evaluation => evaluation.USER_ID === user.ID_UTILISATEUR)

                    .sort((a, b) => {
                        const dateA = new Date(a.EVALUATION_DATE);
                        const dateB = new Date(b.EVALUATION_DATE);
                        return dateB - dateA;
                    });

                console.log('Filtered user evaluations:', userEvaluations);
                const latestEvaluation = userEvaluations[0];
                console.log('Latest user evaluation:', latestEvaluation);
                setEvaluation(latestEvaluation);

            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch evaluation data');
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Évaluation de {user?.UTILISATEUR}
                {evaluation?.EVALUATION_DATE && (
                    <Typography variant="caption" display="block" color="textSecondary">
                        Date: {new Date(evaluation.EVALUATION_DATE).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {evaluationCriteria.map(({ id, label, description }) => (
                            <Grid item xs={12} sm={6} key={id}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {label}
                                    </Typography>
                                    <Rating
                                        value={id === 'punctuality' ? 5 : Number(evaluation?.[id.toUpperCase()]) || 0}
                                        readOnly
                                        precision={0.5}
                                        max={5}
                                    />
                                    <Typography variant="body2" color="textSecondary">
                                        {description}
                                    </Typography>

                                </Paper>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Récompense Totale: {evaluation.TOTAL_SAVINGS} DT
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeEvaluationDialog;
