import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  Skeleton,
  Paper,
} from '@mui/material';
import {
  MonetizationOn,
  LocalOffer,
  Inventory,
  Speed,
  BatteryChargingFull,
  BookmarkAdded,
  LocalShipping,
  EditNote,
  DirectionsBoat,
  CalendarMonth,
  BatteryFull,
  BatteryAlert,
  Battery60,
} from '@mui/icons-material';
import BASE_URL from '../Utilis/constantes';
import RenderStockGros from './renderStock';
import SalesHistogram from '../components/salesHistogram';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxHeight: '1350px',

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

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '12px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

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

const StyledTable = styled(TableContainer)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  marginTop: theme.spacing(2),
  '& .MuiTableHead-root': {
    backgroundColor: '#7695FF',
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(118, 149, 255, 0.05)',
  },
}));

const PromoTag = styled(Typography)(({ theme }) => ({
  color: '#ff4081',
  fontWeight: 'bold',
  padding: theme.spacing(1),
  borderRadius: '8px',
  background: 'rgba(255, 64, 129, 0.1)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.7 },
    '100%': { opacity: 1 },
  },
}));

const LoadingSkeleton = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  animation: 'loading 1.5s infinite',
  borderRadius: '16px',
  '@keyframes loading': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
}));

function CustomCard({ article, tarifs, type, base }) {
  const [promotions, setPromotions] = useState([]);
  const theme = useTheme();
  const {
    CODE_ARTICLE,
    INTIT_ARTICLE,
    promo,
    onPromo,
    TARIF_1,
    TX_TVA_ART,
    STOCK_PHYSIQUE,
    STOCK_AUT_DEPOT,
    file,
    vitesse,
    charge,
    QTE_CMD,
    QTE_RSV,
    FAMILLE,
    INTIT_ART_1,
    LATEST_DATE_LIV_CF_P,
    CDES_FOURNIS,
    MAX_DATE_LIV_CF_P,
    REMISE_FAM
  } = article;

  const prix = Number(TARIF_1 * (1 + TX_TVA_ART / 100)).toFixed(3);
  const imageURL = `https://api.pneu-mafamech.cspddammak.com/imgmobile/${file}`;

  const fetchPromotions = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/promoByArticle`, {
        params: { famille: FAMILLE }
      });
      setPromotions(result.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [FAMILLE]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const getTarifRows = () => {
    const rows = [];
    const prixPropose = Number(prix) * (1 - Number(REMISE_FAM || 0) / 100);


    if (type === 'client' && base === "cspd") {
      rows.push({
        type: 'Prix Proposé',
        prixInitial: Number(prix),
        remise: Number(REMISE_FAM || 0),
        prixFinal: prixPropose.toFixed(3)
      });
  
      if (tarifs.length > 0) {
        tarifs.forEach(tarif => {
          if (tarif.INTITULE_FAM.startsWith(FAMILLE)) {
            const row = {
              type: '',
              prixInitial: Number(prix),
              remise: Number(tarif.REMISE_TF),
              prixFinal: (Number(prix) * (1 - Number(tarif.REMISE_TF) / 100)).toFixed(3)
            };
            if (tarif.INTITULE_FAM === FAMILLE) {
              row.type = 'Comptant';
            } else if (tarif.INTITULE_FAM === `${FAMILLE}-A`) {
              row.type = 'A termes';
            }
            rows.push(row);
          }
        });
      }

      if (promotions.length > 0) {
        promotions.forEach(promo => {
          if (promo.INTITULE_FAM.startsWith(FAMILLE)) {
            const row = {
              type: 'Promotion',
              prixInitial: Number(prix),
              remise: Number(promo.PROMO),
              prixFinal: (Number(prix) * (1 - Number(promo.PROMO) / 100)).toFixed(3)
            };
            rows.push(row);
          }
        });
      }
    }

    if (type === 'client' && base === "fdm") {
      const rowC = {
        type: 'Comptant',
        prixInitial: Number(prix),
        remise: Number(article.REM_MAX),
        prixFinal: (Number(prix) * (1 - Number(article.REM_MAX) / 100)).toFixed(3)
      };
      rows.push(rowC);

      const rowT = {
        type: 'A termes',
        prixInitial: Number(prix),
        remise: Number(article.REM),
        prixFinal: (Number(prix) * (1 - Number(article.REM) / 100)).toFixed(3)
      };
      rows.push(rowT);
    }

    if (type === 'partenaire') {
      const rowC = {
        type: 'Détail',
        prixAchat: (Number(prix) * (1 - Number(article.R) / 100)).toFixed(3),
        prixVente: (Number(prix) * (1 - Number(article.R1) / 100)).toFixed(3)
      };
      rows.push(rowC);

      const rowT = {
        type: 'Gros',
        prixAchat: (Number(prix) * (1 - Number(article.R2) / 100)).toFixed(3),
        prixVente: (Number(prix) * (1 - Number(article.R3) / 100)).toFixed(3)
      };
      rows.push(rowT);
    }

    return rows;
  };

  const tarifRows = getTarifRows();

  return (
    <StyledCard>
      <StyledCardContent>
        {onPromo === 1 && <PromoTag>{promo}</PromoTag>}
        
        <InfoItem>
          <LocalOffer sx={{ color: '#7695FF', mr: 2 }} />
          <Typography variant="h6" sx={{ color: '#7695FF', fontWeight: 'bold' }}>
            {CODE_ARTICLE}
          </Typography>
        </InfoItem>

        <InfoItem>
          <Inventory sx={{ color: '#7695FF', mr: 2 }} />
          <Typography variant="subtitle1">
            {INTIT_ARTICLE}
          </Typography>
        </InfoItem>

        <StyledTable component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                {type !== "partenaire" ? (
                  <>
                    <TableCell>Prix Initial</TableCell>
                    <TableCell>Remise</TableCell>
                    <TableCell>Prix Final</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Prix d'achat</TableCell>
                    <TableCell>Prix de vente</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tarifRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.type}</TableCell>
                  {type !== "partenaire" ? (
                    <>
                      <TableCell>{row.prixInitial} TND</TableCell>
                      <TableCell>{row.remise}%</TableCell>
                      <TableCell>{row.prixFinal} TND</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.prixAchat} TND</TableCell>
                      <TableCell>{row.prixVente} TND</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTable>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <InfoItem>
              <Speed sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>Vitesse: {vitesse}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem>
              <BatteryChargingFull sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>Charge: {charge}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem>
              <LocalShipping sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>Quantité commandée: {QTE_CMD > 0 ? QTE_CMD : 0}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem>
              <BookmarkAdded sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>Quantité réservée: {QTE_RSV > 0 ? QTE_RSV : 0}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12}>
            <InfoItem>
              <EditNote sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>Remarque: {INTIT_ART_1}</Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12}>
            <InfoItem>
              <DirectionsBoat sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>
                Quantité Prochainement Disponible: Pas d'information
              </Typography>
            </InfoItem>
          </Grid>
          <Grid item xs={12}>
            <InfoItem>
              <CalendarMonth sx={{ color: '#7695FF', mr: 2 }} />
              <Typography>
                Date de réception prévue: {formatDate(LATEST_DATE_LIV_CF_P)} - {formatDate(MAX_DATE_LIV_CF_P)}
              </Typography>
            </InfoItem>
          </Grid>
        </Grid>

        
        <RenderStockGros article={article} />
        <ProductImage src={imageURL} alt={INTIT_ARTICLE} />

        {/*<SalesHistogram reference={CODE_ARTICLE} base={base} />*/}
      </StyledCardContent>
    </StyledCard>
  );
}
function CardContainer({ searchTerm, codeCli, base, type }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tarifs, setTarifs] = useState([])
  const fetchTarifs = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/tarifsClient`, {
        params: {
          code: codeCli
        }
      });
      console.log("result", result.data)
      setTarifs(result.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  }
  useEffect(() => {
    console.log("code client", codeCli)
    fetchTarifs()
  }, [codeCli])
  const fetchArticles = async () => {
    const URL = `${BASE_URL}/api/articles`;
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        searchTerm,
        base: base,
        codeCli
      };

      const response = await axios.get(URL, { params });
      setArticles(response.data.articles);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching the clients!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, pageSize, searchTerm, codeCli]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
            <LoadingSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }
  
  // Update the error state UI
  if (error) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          padding: 4,
          color: 'error.main',
          background: 'rgba(255,0,0,0.05)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box sx={{ flex: '1 1 auto', maxHeight: '100vh', overflowY: 'auto', padding: '16px' }}>
        <Grid container spacing={2}>
          {articles.map(article => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={article.CODE_ARTICLE}>
              <CustomCard article={article} tarifs={tarifs} base={base} type={type} />
            </Grid>
          ))}
        </Grid>
      </Box>
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
    </Box>
  );
}

export default CardContainer;
