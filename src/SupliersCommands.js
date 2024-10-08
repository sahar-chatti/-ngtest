import React, { useEffect, useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    useTheme,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import { getArticleById } from "./Api";
import { styled } from '@mui/material/styles';
import BASE_URL from './constantes';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

const CommandesList = ({ type, searchTerm }) => {
    const [commandes, setCommandes] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [page, setPage] = useState(0);
    const theme = useTheme();
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isArticleDialogOpened, setArticleDialogOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(21);
    const [total, setTotal] = useState(0);
    const [articles, setArticles] = useState([]);
    const [text, setText] = useState('');

    const handleChangeText = (event) => {
        setText(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleCloseArticleDialog = () => {
        setArticleDialogOpened(false);
    };

    const GlowingBox = styled('div')(({ backgroundColor }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
        transition: 'box-shadow 0.3s ease-in-out',
        padding: '10px',
        backgroundColor: backgroundColor,
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
            const url = `${BASE_URL}/api/cmdFournisseurStore`;
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

    const handleCardClick = async (command) => {
        setExpanded(prev => (prev === command.NUM_CDE_F ? null : command.NUM_CDE_F));
        console.log("commandId", command.NUM_CDE_F);

        try {
            const result = await axios.get(`${BASE_URL}/api/commandesFournisseurInfo`, {
                params: {
                    param: command.NUM_CDE_F,
                }
            });
            console.log("resultcmd22", result)
            setArticles(result.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '-';
    };

    const getDeliveryStatus = (dateString) => {
        if (!dateString) return { status: "En cours", color: "#7695FF" };
        const deliveryDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deliveryDate.toDateString() === today.toDateString()) {
            return { status: "Réception aujourd'hui", color: "red" };
        } else if (deliveryDate < today) {
            return { status: "Reçue", color: "green" };
        } else {
            return { status: "En cours", color: "#7695FF" };
        }
    };

    const openArticleDialog = (articleId) => {
        if (articleId) {
            getArticleById(articleId, 'cspd').then((article) => {
                setSelectedArticle(article);
                setArticleDialogOpened(true);
                setNewEmplacement(article.EMPLACEMENT_ART || '');
                setNewRayon(article.RAYON_ARTICLE || '');
            });
        } else {
            console.error("Mismatch between CCL_ARTICLE and CODE_ARTICLE, or article is undefined");
        }
    };

    const [newEmplacement, setNewEmplacement] = useState('');
    const [newRayon, setNewRayon] = useState('');

    const handleChangeEmplacement = (event) => {
        setNewEmplacement(event.target.value);
    };

    const handleChangeRayon = (event) => {
        setNewRayon(event.target.value);
    };

    const handleUpdateArticle = async () => {
        try {
            const articleId = selectedArticle.CODE_ARTICLE;
            const data = {
                EMPLACEMENT_ART: newEmplacement,
                RAYON_ARTICLE: newRayon
            };

            await axios.post(`${BASE_URL}/api/updateEmplacementMagasin/${articleId}`, data);

            setSelectedArticle({
                ...selectedArticle,
                EMPLACEMENT_ART: newEmplacement,
                RAYON_ARTICLE: newRayon
            });

            setArticleDialogOpened(false);
            alert('Article mis à jour avec succès');

            fetchCommandes();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            alert('Échec de la mise à jour de l\'article');
        }
    };

    return (
        <Grid container spacing={2}>
            {commandes
                .filter(command => command.DATE_LIV_CF_P)
                .map((command) => {
                    const { status, color } = getDeliveryStatus(command.DATE_LIV_CF_P);
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
                                        marginBottom: "20px",
                                    }}
                                >
                                    <GlowingBox backgroundColor={color} style={{ borderRadius: '10px' }}>
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
                                            {command.ADR_C_F_1}  <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>({status})</span>
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
                                        Date de réception : {formatDate(command.DATE_LIV_CF_P)}
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
                                        Traité par : <span style={{ color: 'red' }}>
                                            {command.CF_UTILIS.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())}
                                        </span>
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleCardClick(command)}
                                        aria-expanded={expanded === command.NUM_CDE_F}
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                    >
                                        <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>
                                            Articles commandés
                                        </Typography>
                                    </IconButton>
                                </CardContent>
                                <Collapse in={expanded === command.NUM_CDE_F} timeout="auto" unmountOnExit>
                                    <Box sx={{ p: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Article</TableCell>
                                                    <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Description</TableCell>
                                                    <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Quantité</TableCell>
                                                    <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {articles.length > 0 && articles.map((cardItem) => {
                                                    return (
                                                        <TableRow key={cardItem.CFL_ARTICLE}>
                                                            <TableCell>{cardItem.CFL_ARTICLE}</TableCell>
                                                            <TableCell>{cardItem.CFL_DES_ARTICLE}</TableCell>
                                                            <TableCell>{cardItem.CFL_QTE_C}</TableCell>
                                                            <TableCell>
                                                                <Button onClick={() => openArticleDialog(cardItem.CFL_ARTICLE)}>
                                                                    <AddCircleIcon />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </Collapse>
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
                    padding: '2px 5px',
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
            {loading ? (
                <Typography>Chargement des données...</Typography>
            ) : selectedArticle ? (
                <Dialog
                    open={isArticleDialogOpened}
                    onClose={handleCloseArticleDialog}
                    PaperProps={{
                        style: {
                            backgroundColor: 'white',
                            boxShadow: 'none',
                            borderRadius: '10px',
                        },
                    }}
                >
                    <DialogTitle style={{ backgroundColor: '#7695FF' }} id="alert-dialog-title">
                        <Typography style={{ color: 'white', fontWeight: 'bold' }}>
                            {selectedArticle.CODE_ARTICLE} : {selectedArticle.INTIT_ARTICLE}
                        </Typography>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            <div>
                                <TextField
                                    style={{ marginTop: 20 }}
                                    label="Rayon"
                                    value={newRayon}
                                    onChange={handleChangeRayon}
                                    variant="outlined"
                                    fullWidth
                                />
                                <p>Rayon actuel : {selectedArticle.RAYON_ARTICLE || "Pas d'information sur le rayon."}</p>

                                <TextField
                                    style={{ marginTop: 20 }}
                                    label="Emplacement"
                                    value={newEmplacement}
                                    onChange={handleChangeEmplacement}
                                    variant="outlined"
                                    fullWidth
                                />
                                <p>Emplacement actuel : {selectedArticle.EMPLACEMENT_ART || "Pas d'information sur l'emplacement."}</p>

                                <Typography style={{ color: 'black', fontSize: '1.2em', fontWeight: '20px' }}>
                                    <span style={{ color: 'black', fontWeight: 'bold', color: '#4379F2', marginBottom: '0.5em' }}>Stock actuel:</span> {selectedArticle.STOCK_PHYSIQUE}
                                </Typography>
                            </div>
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseArticleDialog}>Fermer</Button>
                        <Button onClick={handleUpdateArticle} color="primary">Modifier</Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <></>
            )}
        </Grid>
    );
}

export default CommandesList;
