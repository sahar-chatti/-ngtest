import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import { styled } from '@mui/material/styles';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import TablePagination from '@mui/material/TablePagination';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditNoteIcon from '@mui/icons-material/EditNote';

import {
  Grid
  
} from '@mui/material';


import {

  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
 
  Tooltip,
  useTheme,
  useMediaQuery,
 
} from '@mui/material';

import BASE_URL from './constantes';
import RenderStockGros from './renderStock';


import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import InventoryIcon from '@mui/icons-material/Inventory';
import SpeedIcon from '@mui/icons-material/Speed';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import SalesHistogram from './components/salesHistogram';
const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(2),
  border: '1px solid #e0e0e0',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(2),
  backgroundColor: 'white',
  justifyContent: 'space-between',
}));

const PromoText = styled(Typography)(({ theme }) => ({
  color: '#ff4081',
  fontWeight: 'bold',
  animation: 'glow 1s infinite alternate',
  '@keyframes glow': {
    from: { textShadow: '0 0 5px rgba(255, 64, 129, 0.5)' },
    to: { textShadow: '0 0 20px rgba(255, 64, 129, 1)' },
  },
}));

const ArticleImage = styled(Box)(({ theme }) => ({
  height: 200,
  width: '100%',
  objectFit: 'cover',
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

const ArticleInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const PriceText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& span': {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(0.5),
  },
}));

const ProchainementDispo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
}));

function CustomCard({ article,tarifs,type,base }) {
  const[promotions,setPromotions]=useState([])
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
    reserver,
    qteres,
    file,
    vitesse,
    charge,
    ROTATION,
    QTE_CMD,
    QTE_RSV,
    FAMILLE,
    INTIT_ART_1
  } = article;
  const prix = Number(TARIF_1 * (1 + TX_TVA_ART / 100)).toFixed(3);
  const qte = STOCK_PHYSIQUE + STOCK_AUT_DEPOT;
  const imageURL = `https://api.click.com.tn/imgmobile/${file}`;
  const fetchPromotions = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/api/promoByArticle`, {
        params: { famille: FAMILLE } 
      
      });
      console.log( 'pp', setPromotions)
      setPromotions(result.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
 
    fetchPromotions();
  }, []);
  const getTarifRows = () => {
    const rows = [];
    if(type==='client' && base==="cspd"){
    if(tarifs.length>0){
      //console.log("code",tarifs)
    tarifs.forEach(tarif => {
      // console.log("code INTI",tarif.INTITULE_FAM)
      //console.log("code FAM",FAMILLE)
      if (tarif.INTITULE_FAM.startsWith(FAMILLE)) {
      
        const row = {
          type: '',
          prixInitial: Number(prix),
          remise: Number(tarif.REMISE_TF),
          prixFinal : (Number(prix) * (1 - Number(tarif.REMISE_TF) / 100)).toFixed(3)

        };
        if (tarif.INTITULE_FAM === FAMILLE) {
          row.type = 'Comptant';
        } else if (tarif.INTITULE_FAM === `${FAMILLE}-A`) {
          row.type = 'A termes';
        }
       // console.log("code",row)
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
if(type==='client' && base==="fdm"){
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
if(type==='partenaire' ){
  const rowC = {
    type: 'Détail',
    
    prixAchat:  (Number(prix) * (1 - Number(article.R) / 100)).toFixed(3),
    prixVente: (Number(prix) * (1 - Number(article.R1) / 100)).toFixed(3)
  };
  rows.push(rowC);
  const rowT = {
    type: 'Gros',
    prixAchat:  (Number(prix) * (1 - Number(article.R2) / 100)).toFixed(3),
    prixVente: (Number(prix) * (1 - Number(article.R3) / 100)).toFixed(3)
  };
  rows.push(rowT);
}
    return rows;
  };

  const tarifRows = getTarifRows();

  return (
    <CustomCardWrapper style={{backgroundColor:'white', borderRadius:'15px' ,border:'transparent' }} >
      <CustomCardContent>
        <Box>
          {onPromo === 1 && <PromoText variant="subtitle1">{promo}</PromoText>}
          <ArticleInfo>
            <LocalOfferIcon style={{color:'#7695FF'}} />
            <Typography variant="h6" style={{ display: "flex", alignItems: "center", color: '#7695FF',fontWeight: 'bold' , fontSize:'18px', marginLeft: theme.spacing(1) }}>{CODE_ARTICLE}</Typography>
          </ArticleInfo>
          <ArticleInfo>
            <InventoryIcon style={{color:'#7695FF'}} />
            <Typography variant="subtitle1" style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>{INTIT_ARTICLE}</Typography>
          </ArticleInfo>
          <ArticleInfo>
          <MonetizationOnIcon style={{color:'#7695FF'}} />
      {tarifRows.length > 0 ? (
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell>Type</TableCell>
                {type!=="partenaire" && (
                  <>
                <TableCell>Prix Initial</TableCell>
                <TableCell>Remise</TableCell>
                <TableCell>Prix Final</TableCell>
                </>
              )}
                {type==="partenaire" && (
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
                  {type!=="partenaire" && (
                  <>
                  <TableCell>{row.prixInitial} TND</TableCell>
                  <TableCell>{row.remise}%</TableCell>
                  <TableCell>{row.prixFinal} TND</TableCell>
                  </>
                  )}
                   {type==="partenaire" && (
                  <>
                  <TableCell>{row.prixAchat} TND</TableCell>
                 
                  <TableCell>{row.prixVente} TND</TableCell>
                  </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>
          Prix: {prix} <span>TND</span>
        </Typography>
      )}
          </ArticleInfo>
          <ArticleInfo>
            <SpeedIcon style={{color:'#7695FF'}}  />
            <Typography variant="body2" style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>Vitesse: {vitesse}</Typography>
          </ArticleInfo>
          <ArticleInfo>
            <BatteryChargingFullIcon style={{color:'#7695FF'}}  />
            <Typography variant="body2" style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>Charge: {charge}</Typography>
          </ArticleInfo>
          {/* <ArticleInfo>
            <WifiProtectedSetupIcon color="primary" />
            <Typography variant="body2" style={{ marginLeft: theme.spacing(1) }}>Taux rotation: {ROTATION}  </Typography>
          </ArticleInfo> */}
          <ArticleInfo>
            <LocalShippingIcon style={{color:'#7695FF'}}  />
            <Typography variant="body2"style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>Quantité commandée: {QTE_CMD > 0 ? QTE_CMD : 0}  </Typography>
          </ArticleInfo>
          <ArticleInfo>
            <BookmarkAddedIcon style={{color:'#7695FF'}}  />
            <Typography variant="body2"style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>Quantité réservée: {QTE_RSV > 0 ? QTE_RSV : 0} </Typography>
          </ArticleInfo>
          <ArticleInfo>
            <EditNoteIcon style={{color:'#7695FF'}}  />
            <Typography variant="body2"style={{ display: "flex", alignItems: "center",marginLeft: theme.spacing(1),color: '#545454',fontWeight: 'bold' , fontSize:'16px' }}>remarque: {INTIT_ART_1} </Typography>
          </ArticleInfo>
         
          {/* <ArticleInfo>
            <LocalShippingIcon color="primary" />
            <Typography variant="body2" style={{ marginLeft: theme.spacing(1) }}> </Typography>
          </ArticleInfo> */}
          <RenderStockGros article={article} />
          {reserver === 1 && (
            <ProchainementDispo variant="body2">
              Prochainement disponible: {qteres}
            </ProchainementDispo>
          )}
       <ArticleInfo>
  
  <SalesHistogram reference={CODE_ARTICLE} base={base} />
</ArticleInfo>
        </Box>
        <ArticleImage component="img" alt={INTIT_ARTICLE} src={imageURL} />
      </CustomCardContent>
    </CustomCardWrapper>
  );
}

  function CardContainer({ searchTerm,codeCli,base,type}) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [tarifs,setTarifs]=useState([])
    const[openTarifDialog,setOpenTarifDialog]=useState(false)
  //console.log(codeCli)
    const fetchTarifs=async()=>{
      try {
        
        const result = await axios.get(`${BASE_URL}/api/tarifsClient`,{ params: {
          code:codeCli
        }
        });
       
        console.log("result",result.data)
        setTarifs(result.data);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    
    }
    useEffect(()=>{
      console.log("code client",codeCli)
fetchTarifs()
    },[codeCli])
    
    const fetchArticles = async () => {
      const URL = `${BASE_URL}/api/articles`;
      setLoading(true);
      try {
        const params = {
          page,
          pageSize,
          searchTerm,
          base:base,
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
    }, [page, pageSize, searchTerm,codeCli]);
  
    const handleChangePage = (event, newPage) => setPage(newPage);
  
    const handleChangeRowsPerPage = (event) => {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
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
  