import React, { useEffect, useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import {
    Box,
    Card,
    CardContent,
    Grid,
    TablePagination,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import BASE_URL from './constantes';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

const CommandesList = ({ type, searchTerm }) => {
    const [commandes, setCommandes] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const handleChangePage = (newPage) => setPage(newPage);

    const GlowingBox = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
        transition: 'box-shadow 0.3s ease-in-out',
        padding: '10px',
        '&:hover': {
            boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
        },
    }));

    const getGridSizes = (command) => {
        if (expanded === command.NUM_CDE_C) {
            return { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 };
        } else {
            return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
        }
    };

    const fetchCommandes = async () => {
        try {
            const url =
                `${BASE_URL}/api/cmdFournisseurStore`;

            const params = {
                page: page,
                pageSize: pageSize,
                searchTerm: searchTerm,
            };

            const result = await axios.get(url, { params });
            setCommandes(result.data.commandes);
            setTotal(result.data.total);
        } catch (error) {
            console.error('Error fetching commands:', error);
        }
    };
    
    useEffect(() => {
        fetchCommandes();
    }, [page, pageSize, searchTerm]);

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '-';
    };

    return (
        <Grid container spacing={2}>
            {commandes
                .filter(command => command.DATE_LIV_CF_P) 
                .map((command) => {
                    return (
                        <Grid
                            item
                            xs={getGridSizes(command).xs}
                            sm={getGridSizes(command).sm}
                            md={getGridSizes(command).md}
                            lg={getGridSizes(command).lg}
                            xl={getGridSizes(command).xl}
                            key={command.NUM_CDE_F}
                        >
                            <Card style={{ backgroundColor: 'white', borderRadius: '15px', border: 'transparent' }}>
                                <CardContent
                                    sx={{
                                        cursor: 'pointer',
                                        position: 'relative',
                                        height: type === "partenaire" ? '200px' : '220px',
                                        marginBottom: "20px",
                                    }}
                                >
                                    <GlowingBox style={{ backgroundColor: "#7695FF", borderRadius: '11px' }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            align="center"
                                            style={{
                                                color: "white",
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            {command.ADR_C_F_1}
                                        </Typography>
                                    </GlowingBox>

                                    <Typography
                                        variant="h6"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            marginTop: "10px",
                                            color: '#545454',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <LocalMallIcon style={{ marginRight: '0.3em' }} />
                                        Commande: {command.NUM_CDE_F}
                                    </Typography>
                                    <Typography
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            marginTop: "10px",
                                            color: '#545454',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <LocalShippingIcon style={{ marginRight: '0.3em' }} />
                                        Date de réception prévue : {formatDate(command.DATE_LIV_CF_P)}
                                    </Typography>
                                    <Typography
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            marginTop: "10px",
                                            color: '#545454',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <PublicIcon style={{ marginRight: '0.3em' }} />
                                        Adresse commande: {command.ADR_C_F_2}
                                    </Typography>
                                    <Typography
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 10,
                                            marginTop: "10px",
                                            color: '#545454',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <PersonIcon style={{ marginRight: '0.3em' }} />
                                        Traité par : <span style={{ color: 'red' }}>{command.CF_UTILIS.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())}</span>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                    padding: '8px 16px',
                    zIndex: 1000,
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100, 150, 200]}
                    component="div"
                    count={total}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Grid>
    );
};

export default CommandesList;
