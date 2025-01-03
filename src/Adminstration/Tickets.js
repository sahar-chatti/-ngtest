import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Rating,
    Button,
    Typography,
    TableContainer,
    TextField,
    Box
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../Utilis/constantes';


const evaluationCriteria = [
    { id: 'punctuality', label: 'Ponctualité et Présence', value: '0,500 dt / étoile', description: 'Respect des horaires et délais' },
    { id: 'creativity', label: 'Créativité et exposé', value: '5dt / étoile', description: 'Capacité d\'innovation' },
    { id: 'behavior', label: 'Comportement et Discipline', value: '5 dt / étoile', description: 'Attitude professionnelle' },
    { id: 'elegance', label: 'Élégance', value: '5 dt / étoile', description: 'Présentation et tenue professionnelle' },
    { id: 'productivity', label: 'Productivité', value: '5 dt / étoile', description: 'Efficacité et rendement' },

    { id: 'discipline', label: 'Objectifs ', value: '25 dt / étoile', description: 'Respect des règles et procédures' },
    { id: 'new_discipline', label: 'Défis', value: '100 dt / étoile', description: 'Défis' },

];

const calculateMoney = (rating, criteriaId) => {
    const starValues = {
        punctuality: 0.5,
        creativity: 5,
        behavior: 5,
        elegance: 5,
        discipline: 25,
        productivity: 5,
        new_discipline: 100,

    };
    return rating * (starValues[criteriaId] || 0);
};

const UserEvaluation = () => {
    const [users, setUsers] = useState([]);
    const [evaluations, setEvaluations] = useState({});
    const [containerCount, setContainerCount] = useState(0);
    const [savedEvaluations, setSavedEvaluations] = useState({});
    const [orders, setOrders] = useState([]);
    const BASE = 'CSPD24';
    const [validatedEvaluations, setValidatedEvaluations] = useState({});


    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users`);
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const fetchSupplierOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/cmdFournisseurCurrentMonth`);
            const orders = response.data.commandes || [];
            const totalContainers = orders.reduce((total, order) => {
                const firstNumber = parseInt(order.CF_CHAMP_3.split('X')[0]);
                return total + (isNaN(firstNumber) ? 0 : firstNumber);
            }, 0);
            setContainerCount(totalContainers);
        } catch (error) {
            console.error('Error fetching supplier orders:', error);
            setContainerCount(0);
        }
    };

    const fetchOrders = async (base) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/currentMonthCommands/${base}`);
            setOrders(response.data.commandes || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };
    const fetchOrdersFdm = async (base) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/currentMonthCommandsFdm`);
            setOrders(response.data.commandes || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };
    const getOrderCount = (userLogin) => {
        return orders.filter(order =>
            order.ETAT_CDE_C === "LT" &&
            order.CC_CHAMP_7 === userLogin
        ).length;
    };

    const fetchSavedEvaluations = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/evaluations`);

            const evaluationsMap = response.data.reduce((acc, evalData) => {
                const userId = evalData.USER_ID;
                if (!acc[userId]) {
                    acc[userId] = [];
                }
                acc[userId].push({
                    punctuality: evalData.PUNCTUALITY || 5,
                    creativity: evalData.CREATIVITY,
                    behavior: evalData.BEHAVIOR,
                    elegance: evalData.ELEGANCE,
                    discipline: evalData.DISCIPLINE,
                    new_discipline: evalData.NEW_DISCIPLINE,
                    state: evalData.STATE, // Add this line

                    productivity: evalData.PRODUCTIVITY,
                    containerCount: evalData.CONTAINER_COUNT || 0,
                    voyageCount: evalData.VOYAGE_COUNT || 0,
                    totalReward: evalData.TOTAL_REWARD || 0,
                    evaluationDate: new Date(evalData.EVALUATION_DATE),
                });
                acc[userId].sort((a, b) => b.evaluationDate - a.evaluationDate);
                return acc;
            }, {});

            const latestEvaluations = Object.keys(evaluationsMap).reduce((acc, userId) => {
                acc[userId] = evaluationsMap[userId][0];
                return acc;
            }, {});
            setSavedEvaluations(evaluationsMap);
            setEvaluations(latestEvaluations);
        } catch (error) {
            console.error('Error fetching saved evaluations:', error);
        }
    };
    const calculateAverageRating = (userId) => {
        const ratings = Object.values(evaluations[userId] || {}).filter(value => typeof value === 'number');
        if (ratings.length === 0) return 0;
        return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    };
    useEffect(() => {
        fetchUsers();
        fetchSavedEvaluations();
        fetchSupplierOrders();
        fetchOrders(BASE);
    }, []);

    const calculateTotalReward = (userId, userLogin, department) => {
        const userEvaluations = evaluations[userId] || {};
        let totalReward = 0;

        for (const [key, rating] of Object.entries(userEvaluations)) {
            if (evaluationCriteria.some(criteria => criteria.id === key)) {
                totalReward += calculateMoney(rating, key);
            }
        }

        if (department === 'Magasin') {
            totalReward += (containerCount || 0) * 10;
        }
        const orderCount = getOrderCount(userLogin);
        totalReward += orderCount * 0.5;

        totalReward += (userEvaluations.voyageCount || 0) * 10;

        return totalReward;
    };
    const handleInputChange = (userId, field, value) => {
        console.log(`User: ${userId}, Field: ${field}, Value: ${value}`); // Add this line for debugging
        setEvaluations(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value,
            },
        }));
    };
    const handleSubmitEvaluation = async (userId, action) => {
        try {
            const user = users.find(u => u.ID_UTILISATEUR === userId);
            const evaluationData = evaluations[userId] || {};
            const totalSavings = calculateTotalReward(userId, user.LOGIN, user.DEPARTEMENT);

            // Get existing evaluations for this user
            const existingEvaluations = await axios.get(`${BASE_URL}/api/evaluations`, {
                params: {
                    userId,
                    userLogin: user.LOGIN
                }
            });

            const payload = {
                userId,
                averageRating: calculateAverageRating(userId),
                containerCount: user.DEPARTEMENT === 'Magasin' ? containerCount : 0,
                voyageCount: evaluationData.voyageCount || 0,
                totalSavings,
                creativity: evaluationData.creativity || 0,
                new_discipline: evaluationData.new_discipline || 0,
                behavior: evaluationData.behavior || 0,
                elegance: evaluationData.elegance || 0,
                discipline: evaluationData.discipline || 0,
                productivity: evaluationData.productivity || 0,
                punctuality: evaluationData.punctuality || 5,
                state: action === 'validate' ? 'VALIDATED' : 'SAVED'

            };

            // Find the most recent evaluation for this user
            const userEvaluations = existingEvaluations.data
                .filter(evaluation => evaluation.USER_ID === userId)
                .sort((a, b) => new Date(b.EVALUATION_DATE) - new Date(a.EVALUATION_DATE));


            const response = userEvaluations.length > 0
                ? await axios.put(`${BASE_URL}/api/evaluations/${userEvaluations[0].ID}`, payload)
                : await axios.post(`${BASE_URL}/api/evaluations`, payload);

            if (response.data.success) {
                console.log('Evaluation saved successfully:', response.data);
                fetchSavedEvaluations();
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };


    useEffect(() => {
        const initializeValidatedStates = () => {
            const validatedStates = {};
            users.forEach(user => {
                const userEval = savedEvaluations[user.ID_UTILISATEUR]?.[0];
                if (userEval?.state === 'VALIDATED') {
                    validatedStates[user.ID_UTILISATEUR] = true;
                }
            });
            setValidatedEvaluations(validatedStates);
        };

        if (savedEvaluations && users.length) {
            initializeValidatedStates();
        }
    }, [savedEvaluations, users]);

    return (
        <TableContainer component={Paper} sx={{ margin: 2 }}>
            <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
                Évaluation des Employés
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Employé</TableCell>
                        <TableCell align="center">Récompense</TableCell>
                        <TableCell align="center">Commandes</TableCell>
                        <TableCell align="center">Contenaires</TableCell>

                        {evaluationCriteria.map(({ label, id }) => (
                            <TableCell key={id} align="center">
                                <Typography variant="body1">{label}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                                    {evaluationCriteria.find(criteria => criteria.id === id).value}
                                </Typography>
                            </TableCell>
                        ))}
                        <TableCell align="center">Déplacement</TableCell>
                        <TableCell align="center">Moyenne</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.ID_UTILISATEUR}>
                            <TableCell>{user.UTILISATEUR}</TableCell>
                            <TableCell align="center">
                                {calculateTotalReward(
                                    user.ID_UTILISATEUR,
                                    user.LOGIN,
                                    user.DEPARTEMENT
                                ).toFixed(2)} DT
                            </TableCell>
                            < TableCell align="center">
                                {getOrderCount(user.LOGIN)}
                            </TableCell>
                            <TableCell align="center">
                                {user.DEPARTEMENT === 'Magasin' ?
                                    (containerCount || 0) :
                                    'N/A'
                                }
                            </TableCell>
                            {evaluationCriteria.map(({ id, label }) => (
                                <TableCell key={id} align="center">
                                    {id === 'productivity' ? (
                                        user.DEPARTEMENT !== 'Commercial' ? (
                                            <Rating
                                            value={(evaluations[user.ID_UTILISATEUR]?.[id] || 0).toFixed(1)} // For debugging
                                            onChange={(e, value) => handleInputChange(user.ID_UTILISATEUR, id, value)}
                                            precision={0.5}
                                        />
                                        ) : (
                                            <Rating
                                                value={0}
                                                readOnly
                                                disabled
                                            />
                                        )
                                    ) : (
                                        <Rating
                                            value={evaluations[user.ID_UTILISATEUR]?.[id] || 0}
                                            onChange={(e, value) => handleInputChange(user.ID_UTILISATEUR, id, value)}
                                            precision={0.5}
                                        />
                                    )}
                                </TableCell>
                            ))}
                            <TableCell align="center">
                                <TextField
                                    type="number"
                                    value={evaluations[user.ID_UTILISATEUR]?.voyageCount || 0}
                                    onChange={e => handleInputChange(user.ID_UTILISATEUR, 'voyageCount', Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell align="center">{calculateAverageRating(user.ID_UTILISATEUR).toFixed(1)}</TableCell>
                            <TableCell align="center">
                                <Box display="flex" justifyContent="center" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleSubmitEvaluation(user.ID_UTILISATEUR, 'save')}
                                    >
                                        Enregistrer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleSubmitEvaluation(user.ID_UTILISATEUR, 'validate')}
                                    >
                                        Valider
                                    </Button>
                                </Box>
                            </TableCell>



                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserEvaluation;
