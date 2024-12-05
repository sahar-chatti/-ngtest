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
    Box,
    TableContainer,
    Tooltip,
    TextField
} from '@mui/material';
import axios from 'axios';
import BASE_URL from './constantes';
import SavingsIcon from '@mui/icons-material/Savings';

const evaluationCriteria = [
    { id: 'punctuality', label: 'Ponctualité et Présence', description: 'Respect des horaires et délais' },
    { id: 'creativity', label: 'Créativité', description: 'Capacité d\'innovation' },
    { id: 'behavior', label: 'Comportement', description: 'Attitude professionnelle' },
    { id: 'elegance', label: 'Élégance', description: 'Présentation et tenue professionnelle' },
    { id: 'discipline', label: 'Discipline', description: 'Respect des règles et procédures' },
    { id: 'productivity', label: 'Productivité', description: 'Efficacité et rendement' }
];

const calculateMoney = (rating, criteriaId) => {
    if (criteriaId === 'punctuality' || criteriaId === 'presence') {
        return rating * 0.6; // 3 DT per star for punctuality and presence
    }
    return rating * 1.5; // 1.5 DT per star for other criteria
};

const UserEvaluation = () => {
    const [users, setUsers] = useState([]);
    const [evaluations, setEvaluations] = useState({});
    const [containerCount, setContainerCount] = useState({});
    const [orders, setOrders] = useState([]);
    const [supplierOrders, setSupplierOrders] = useState([]);
    const BASE = 'CSPD24';
    const [voyageCount, setVoyageCount] = useState({});
    const [savedEvaluations, setSavedEvaluations] = useState({});

    // Function to map the first letter to a numeric value (A=1, B=2, ..., Z=26)
    const letterToNumber = (letter) => {
        if (!letter) return 0;
        const charCode = letter.toUpperCase().charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            return charCode - 64; // A=1, B=2, ..., Z=26
        }
        return 0;
    };

    const fetchSupplierOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/cmdFournisseurCurrentMonth`);
            const orders = response.data.commandes || [];

            const totalContainers = orders.reduce((total, order) => {
                const firstNumber = parseInt(order.CF_CHAMP_3.split('X')[0]);
                return total + (isNaN(firstNumber) ? 0 : firstNumber);
            }, 0);

            // Store as a number, not an object
            setContainerCount(totalContainers);
        } catch (error) {
            console.log('Error fetching supplier orders:', error);
            setContainerCount(0); // Set to 0 if there's an error
        }
    };

    const fetchOrders = async (base) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/currentMonthCommands/${base}`);
            setOrders(response.data.commandes || []);
        } catch (error) {
            console.log('Error fetching orders:', error);
            setOrders([]);
        }
    };

    const getOrderCount = (userLogin) => {
        return orders.filter(order =>
            order.ETAT_CDE_C === "LT" &&
            order.CC_CHAMP_7 === userLogin
        ).length;
    };
    // Add this to your existing state declarations
    const [evaluationHistory, setEvaluationHistory] = useState({});

    // Add this function to fetch saved evaluations
    const fetchSavedEvaluations = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/evaluations`);
            const evaluationsMap = {};
            response.data.data.forEach(evaluation => {
                evaluationsMap[evaluation.user_id] = {
                    ratings: evaluation.ratings || {},  // Handle undefined ratings
                    averageRating: evaluation.average_rating || 0,
                    containerCount: evaluation.container_count || 0,
                    voyageCount: evaluation.voyage_count || 0
                };
            });
            setSavedEvaluations(evaluationsMap);
            setEvaluations(prev => ({
                ...prev,
                ...evaluationsMap
            }));
        } catch (error) {
            console.log('Error fetching saved evaluations:', error);
        }
    };

    // Add this to your useEffect
    useEffect(() => {
        fetchUsers();
        fetchSupplierOrders();
        fetchOrders(BASE);
        fetchSavedEvaluations(); // Add this line
    }, []);

    const calculateOrderBonus = (userLogin) => {
        return orders.filter(order =>
            order.ETAT_CDE_C === "LT" &&
            order.CC_CHAMP_7 === userLogin
        ).length * 0.5;
    };



    useEffect(() => {
        const defaultEvals = {};
        users.forEach(user => {
            defaultEvals[user.ID_UTILISATEUR] = {
                ...defaultEvals[user.ID_UTILISATEUR],
                punctuality: 5
            };
        });
        setEvaluations(prev => ({ ...prev, ...defaultEvals }));
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRatingChange = (userId, criterion, value) => {
        setEvaluations(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [criterion]: value
            }
        }));
    };

    const calculateAverageRating = (userId) => {
        const userRatings = evaluations[userId];
        if (!userRatings) return 0;

        const sum = evaluationCriteria.reduce((acc, { id }) => acc + (userRatings[id] || 0), 0);
        return sum / evaluationCriteria.length;
    };

    const calculateContainerBonus = (userId, department) => {
        if (department !== 'Magasin') return 0;
        return (containerCount || 0) * 10; // 10 DT per container
    };

    // Update the calculateTotalSavings function to include the container bonus
    const calculateTotalSavings = (userId, userLogin, department) => {
        const userRatings = evaluations[userId];
        if (!userRatings) return 0;

        const ratingsTotal = Object.entries(userRatings).reduce((total, [criteriaId, rating]) => {
            return total + calculateMoney(rating, criteriaId);
        }, 0);

        const containerBonus = calculateContainerBonus(userId, department);
        const orderBonus = calculateOrderBonus(userLogin);
        const voyageBonus = (voyageCount[userId] || 0) * 10; // 10 DT per voyage

        return ratingsTotal + containerBonus + orderBonus + voyageBonus;
    };

    const handleSubmitEvaluation = async (userId, userLogin, department) => {
        try {
          const userRatings = evaluations[userId] || {};
          const totalReward = calculateTotalSavings(userId, userLogin, department);
          
          // Log the values to verify they're being captured
          console.log('User Ratings:', userRatings);
          
          const payload = {
            userId: Number(userId),
            punctuality: Number(userRatings.punctuality || 0),
            creativity: Number(userRatings.creativity || 0),
            behavior: Number(userRatings.behavior || 0),
            elegance: Number(userRatings.elegance || 0),
            discipline: Number(userRatings.discipline || 0),
            productivity: Number(userRatings.productivity || 0),
            containerCount: Number(department === 'Magasin' ? containerCount : 0),
            voyageCount: Number(voyageCount[userId] || 0),
            averageRating: Number(calculateAverageRating(userId)),
            totalReward: Number(totalReward)
          };
      
          console.log('Sending payload:', payload);
      
          const response = await axios.post(`${BASE_URL}/api/evaluations`, payload);
      
          if (response.data.success) {
            setSavedEvaluations(prev => ({
              ...prev,
              [userId]: payload
            }));
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
                        {evaluationCriteria.map(({ label }) => (
                            <TableCell key={label} align="center">{label}</TableCell>
                        ))}
                        <TableCell align="center">Nombre de Contenaires / Déplacements</TableCell>
                        <TableCell align="center">Moyenne</TableCell>
                        <TableCell align="center">ordres</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.ID_UTILISATEUR}>
                            <TableCell>
                                <Box>
                                    <Typography variant="subtitle1">{user.UTILISATEUR}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {user.DEPARTEMENT}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <SavingsIcon color="primary" />
                                    <Typography variant="h6" color="primary">
                                        {calculateTotalSavings(user.ID_UTILISATEUR, user.LOGIN, user.DEPARTEMENT).toFixed(2)} DT
                                    </Typography>
                                </Box>
                            </TableCell>
                            {evaluationCriteria.map(({ id, description }) => (
                                <TableCell key={id} align="center">
                                    <Tooltip title={description}>
                                        <Rating
                                            value={evaluations[user.ID_UTILISATEUR]?.[id] || 0}
                                            onChange={(_, value) => handleRatingChange(user.ID_UTILISATEUR, id, value)}
                                            precision={0.5}
                                            disabled={id === 'productivity' && user.DEPARTEMENT === 'Commercial'}
                                        />
                                    </Tooltip>
                                </TableCell>
                            ))}
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: user.DEPARTEMENT === 'Magasin' ? 'inherit' : 'gray',
                                            opacity: user.DEPARTEMENT === 'Magasin' ? 1 : 0.5
                                        }}
                                    >
                                        {user.DEPARTEMENT === 'Magasin' ? Number(containerCount || 0) : 0}
                                    </Typography>

                                    <TextField
                                        type="number"
                                        size="small"
                                        label="Déplacements"
                                        value={voyageCount[user.ID_UTILISATEUR] || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setVoyageCount(prev => ({
                                                ...prev,
                                                [user.ID_UTILISATEUR]: value
                                            }));
                                        }}
                                        inputProps={{ min: 0 }}
                                        sx={{ width: '100px' }}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="h6">
                                    {calculateAverageRating(user.ID_UTILISATEUR).toFixed(1)}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="h6">
                                    {getOrderCount(user.LOGIN)}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSubmitEvaluation(user.ID_UTILISATEUR, user.LOGIN, user.DEPARTEMENT)}
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
