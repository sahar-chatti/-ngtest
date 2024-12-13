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
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '../Utilis/constantes';

const evaluationCriteria = [
    { id: 'punctuality', label: 'Ponctualité et Présence', description: 'Respect des horaires et délais' },
    { id: 'creativity', label: 'Créativité', description: 'Capacité d\'innovation' },
    { id: 'behavior', label: 'Comportement', description: 'Attitude professionnelle' },
    { id: 'elegance', label: 'Élégance', description: 'Présentation et tenue professionnelle' },
    { id: 'discipline', label: 'Discipline', description: 'Respect des règles et procédures' },
    { id: 'productivity', label: 'Productivité', description: 'Efficacité et rendement' },
];

const calculateMoney = (rating, criteriaId) => {
    const starValues = {
        punctuality: 0.5,
        creativity: 1.5,
        behavior: 1.5,
        elegance: 1.5,
        discipline: 1.5,
        productivity: 1.5,
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
        setEvaluations(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value,
            },
        }));
    };
    const handleSubmitEvaluation = async (userId) => {
        try {

            const user = users.find(u => u.ID_UTILISATEUR === userId);
            const evaluationData = evaluations[userId] || {};
            const totalSavings = calculateTotalReward(userId, user.LOGIN, user.DEPARTEMENT);
            const payload = {
                userId,
                averageRating: calculateAverageRating(userId),
                containerCount: user.DEPARTEMENT === 'Magasin' ? containerCount : 0,
                voyageCount: evaluationData.voyageCount || 0,
                totalSavings, 
                creativity: evaluationData.creativity || 0,
                behavior: evaluationData.behavior || 0,
                elegance: evaluationData.elegance || 0,
                discipline: evaluationData.discipline || 0,
                productivity: evaluationData.productivity || 0,
                punctuality: evaluationData.punctuality || 5
            };

            console.log('PUT payload:', payload);
            const response = await axios.post(`${BASE_URL}/api/evaluations`, payload);

            if (response.data.success) {
                console.log('Evaluation saved successfully:', response.data);
                fetchSavedEvaluations();
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

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

                        {evaluationCriteria.map(({ label }) => (
                            <TableCell key={label} align="center">{label}</TableCell>
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
                                                value={evaluations[user.ID_UTILISATEUR]?.[id] || 0}
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSubmitEvaluation(user.ID_UTILISATEUR)}
                                >
                                    Valider
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserEvaluation;
