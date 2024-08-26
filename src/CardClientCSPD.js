import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import emailb from './icons/emailb.png'
import { styled, ThemeProvider, createTheme } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import HistoryIcon from '@mui/icons-material/History';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import BASE_URL from './constantes';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import personIcon from './icons/person.png'
import addressIcon from './icons/address.png'
import callIcon from './icons/call.png'
import dateIcon from './icons/NAISS.png'
import {TablePagination} from '@mui/material';
import {Checkbox,FormControlLabel,Collapse,IconButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import payIcon from './icons/pay.png'
import calendarIcon from './icons/calendar.png'
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import represIcon from './icons/repres.png'
const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: 'calc(33.00% - 16px)',
  margin: theme.spacing(1),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'auto',
}));
const CustomCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  alignItems: 'center',
}); 

const CustomButton = styled(Button)({
  fontSize: '0.6rem',
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '1px',
});
const GlowingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // backgroundColor: '#fff', // Default background color
  borderRadius: 20,
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  padding: '10px',
  '&:hover': {
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
  },
}));

  // const handleCheckboxChange = (event) => {
  //   const { name } = event.target;
  //   setSelectedClientType(name);
  // };
//api historique



function CustomCard({ client,selectedClientType,user }) {
  const [params,setParams]=useState([])
  const [raisonList, setRaisonList] = useState([]);
  const [Sahar, setSahar] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoriqueDialog, setOpenHistoriqueDialog] = useState(false);
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [details, setDetails] = useState('');
  const [communicationType, setCommunicationType] = useState('Prespection'); // Added communicationType state
  const [qualificationType, setqualificationType] = useState(''); // Added communicationType state
  const [commandes, setCommandes] = useState([]);
  const [expanded, setExpanded] = useState(null); 
  const [articles, setArticles] = useState({});
 
  const [qualificationList, setQualificationList] = useState([]);
  const [selectedQualification,setSelectedQualification]=useState("")
  const [tarifs,setTarifs]=useState([])
  const[openTarifDialog,setOpenTarifDialog]=useState(false)

  const handleTarifDialogOpen=async()=>{
    try {
      console.log("client",client.CODE_CLIENT)
      const result = await axios.get(`${BASE_URL}/api/tarifsClient`,{ params: {
        code:client.CODE_CLIENT
      }
      });
      console.log("result",result.data)
      setTarifs(result.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
    setOpenTarifDialog(true)
  }
  //pour remplir raison d'appel
  useEffect(() => {
    axios.get(`${BASE_URL}/api/RaisonsList`)
      .then(response => setRaisonList(response.data))
      .catch(error => console.error('Error fetching data:', error));

   
  }, []);


  const [selectedRaison, setSelectedRaison] = useState('');

  const handleInputChange = (event) => {
    setSelectedRaison(event.target.value);
  };

useEffect(() => {
  if (selectedRaison) {
    const qualificationIds = params
      .filter(param => param.ID_RAISON === selectedRaison.ID_RAISON)
      .map(param => param.ID_QUALIFICATION);

   
  } 

 
}, [selectedRaison, params, qualificationList]);



  useEffect(()=> {
      
    axios.get(`${BASE_URL}/api/raisonQualifications`)
    .then(response => {
      setRaisonList(response.data);
    })
    .catch(error => {
      console.error('Error fetching raison qualifications:', error);
    });
    axios.get(`${BASE_URL}/api/QualificationAppels`)
      .then(response => setQualificationList(response.data))
      .catch(error => console.error('Error fetching data:', error));
    axios.get(`${BASE_URL}/api/raisonQualifications`)
      axios.get(`${BASE_URL}/api/RaisonsList`)
      .then(response => {setRaisonList(response.data)
        console.log ("sahar",response.data)
      }

      
    )

      .catch(error => console.error('Error fetching data:', error));
  },[])

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleHistoriqueDialogOpen = async() => {
    try {
      console.log("client",client.CODE_CLIENT)
      const result = await axios.get(`${BASE_URL}/api/cmdClients`,{ params: {
        base:selectedClientType==="clientsFdm"?"fdm":"cspd",code:client.CODE_CLIENT
      }
      });
      console.log("result",result.data)
      setCommandes(result.data);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
    setOpenHistoriqueDialog(true);
  };
  const handleCardClick = async (command) => {
    setExpanded(prev => (prev === command.NUM_BLC ? null : command.NUM_BLC));
    console.log("commandId", command.NUM_BLC);
  
    try {
      const result = await axios.get(`${BASE_URL}/api/articlescmd`, {
        params: {
          reference: command.NUM_BLC,
           base:selectedClientType==="clientsFdm"?"fdm":"cspd"
        }
      });
      console.log("result",result)
      setArticles(result.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };
  
  const handleHistoriqueDialogClose = () => {
    setOpenHistoriqueDialog(false);
  };

  const handleSaveCommunication = () => {
    console.log('Date and Time:', dateTime);
    console.log('Details:', details);
    console.log('Communication Type:', communicationType);
    console.log('Qualification:', qualificationType);

    setOpenDialog(false);
  };

  const sendEmail = () => {
    window.location.href = `mailto:${client.EMAIL_CLIENT}`;
  };

  const makeCall = () => {
    window.location.href = `tel:${client.TEL_CLIENT_L}`;
  };

  const sendSMS = () => {
    window.location.href = `sms:${client.TEL_CLIENT_L}`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //Mailing 
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loginmail, setLoginmail] = useState('');
  const [username, setUsername] = useState('');
  
  const [messages, setMessages] = useState('');
  const [codeSent, setCodeSent] = useState();
  
  const handleSendCode = async(e) => {
    
    let loginmail = (client.TEL_CLIENT_F)
  
    let code = (client.CHAMP_2_CLIENT)
  
    let username = (client.NOM_PRENOM)
    
      
         
  // alert(JSON.stringify(client))
  
  
      return await axios.post('http://192.168.1.170:3200/signin', { email:client.EMAIL,loginmail, username,code }, {
              headers: {
                  "Content-Type": "application/json",
                  'Authorization': ''
              }
          })
          .then(res => {
              alert(res.data)
              setMessages(res.data);
              setCodeSent(true);
          })
          .catch(error => {
              alert(error)
              setMessages('Error sending verification code');
             
  
          });
          
  
  }
  
  
  const handleVerifyCode = async(e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://http://192.168.1.170:3200/verify', { email,username, loginmail,code });
          setMessages('Verification successful! Token: ' + response.data.token);
      } catch (error) {
          setMessages('Error verifying code');
      }
  };

  return (
    
    <CustomCardWrapper style={{ textAlign: 'center' }}>
      <CustomCardContent>
      <GlowingBox  style={{ backgroundColor:client.BLOQUER_CLIENT?"red":"green"}}>
      <Typography
  variant="h6"
  component="div"
  align="center"
  style={{
    color: "white",
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '1.2rem',
  }}
>
  {client.INTITULE_CLIENT} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({client.INTITULE_GR})</span>
</Typography>
          {/* Example icon */}
          {!client.BLOQUER_CLIENT &&(
          <CheckCircleOutlineIcon style={{ marginLeft: '8px', fontSize: '1.5rem',color:"white" }} />
        )}
          {client.BLOQUER_CLIENT &&(
          <BlockIcon style={{ marginLeft: '8px', fontSize: '1.5rem' ,color:"white"}} />
        )}
        </GlowingBox>
       
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10,marginTop:"10px" }}>
          <img src={callIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
          <Button onClick={makeCall} variant="text" color="primary">
            {client.TEL_CLIENT_F}
          </Button>
        </Typography>
        
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={addressIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
          {client.ADR_C_FACT_1}
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={represIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
          {client.INTITULE_REPRES}
        </Typography>
        <Typography id="x" variant="body2" color="text.secondary"  style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
        <img src={emailb} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
          {client.EMAIL} 
          <Button   onClick = {handleSendCode } size="small" style={{ color: '#FF8C00', fontSize: '0.55rem' }}>
           Mot de passe oublié
          </Button>
        </Typography>
        <>
          {client.NUM_DER_BON ? (
            <Typography variant="body2" color="text.secondary">
              <Grid container style={{ marginTop: '10px', color: "black", alignItems: 'flex-start', fontFamily: 'sans-serif', display: 'inline-flex', fontWeight: 'bold' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead style={{ fontSize: '10px' }}>
                      <TableRow>
                        <TableCell style={{ fontSize: '12px' }}>
                          <img src={dateIcon} alt="person icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />N°
                        </TableCell>
                        <TableCell style={{ fontSize: '12px' }}>Date</TableCell>
                        <TableCell style={{ fontSize: '12px' }}>Prix</TableCell>
                        <TableCell style={{ fontSize: '12px' }}>nb jours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={client.ID_CLIENT} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell style={{ fontWeight: 'bold', color: '#387ADF', borderRadius: '12px' }}>{client.NUM_DER_BON}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'black', borderRadius: '12px' }}>{new Date(client.DATE_DER_BON).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'green', borderRadius: '12px' }}>{client.TOT_TTC_BLC}</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: 'red', borderRadius: '12px' }}>{client.NBR_JOURS}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Typography>
          ) : (
            <Typography color="text.secondary" gutterBottom>
              <Grid container style={{ marginTop: '10px', color: "black", alignItems: 'flex-start', fontFamily: 'sans-serif', display: 'inline-flex', fontWeight: 'bold' }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead style={{ fontSize: '10px' }}>
                      <TableRow>
                        <TableCell style={{ width: '600px ', fontSize: '12px', textAlign: 'center' }}>
                          <img src={dateIcon} alt="person icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
                          Info commande
                        </TableCell>
                      </TableRow>
                    </TableHead> 
                    <TableBody>
                      <TableRow key={client.ID_CLIENT} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell style={{ fontWeight: 'bold', color: '#5E6073', borderRadius: '12px', textAlign: 'center' }}> <ProductionQuantityLimitsIcon style={{ color: "#5E6073" }} /> Aucune commande! </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Typography>
          )}
        </>
        <Typography variant="body2" color="text.secondary" style={{display:"flex",alignItems:"center",fontWeight:"bold"}}>
          <img src={payIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
       Mode de réglement: {client.LIBEL_REGL_C}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{display:"flex",alignItems:"center",fontWeight:"bold"}}>
          <img src={calendarIcon} alt="person icon" style={{ marginRight: 8, width: "25px", height: "25px" }} />
       Nbr jr echéance : {client.ECHEANCE_REG_C}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{display:"flex",alignItems:"center",fontWeight:"bold",marginTop:"10px",color:"red"}}>
         
        Bloquer le client si facture non réglé depuis plus de : {client.CL_FACT_NR}
        </Typography>
      </CustomCardContent>

      <CustomCardActions style={{ width: "max-content", textAlign: 'center', display: 'flex' }}>
        <CustomButton style={{ color: "green" }} startIcon={<PhoneForwardedIcon />} size="medium" onClick={handleDialogOpen}> Sortant </CustomButton>
        <CustomButton style={{ color: "green" }} startIcon={<PhoneCallbackIcon />} size="medium" onClick={handleDialogOpen}> Entrant </CustomButton>

        <CustomButton style={{ color: "#EF9C66" }} startIcon={<EmailIcon />} /*onClick={handleEmailDialogOpen}*/ size="medium">Email</CustomButton>
        <CustomButton startIcon={<SmsIcon />} size="medium" onClick={sendSMS}>SMS</CustomButton>
        <CustomButton style={{ color: "#478CCF" }} startIcon={<HistoryIcon />} onClick={()=>handleHistoriqueDialogOpen()} size="medium">Historique</CustomButton>
        {selectedClientType==="clientsCspd" && (
        <CustomButton style={{ color: "#478CCF",marginLeft:"8px" }} startIcon={<PriceChangeIcon />} onClick={()=>handleTarifDialogOpen()} size="medium">Tarifs</CustomButton>
      )}
      </CustomCardActions>

      <Dialog open={openDialog} onClose={handleDialogClose}
        maxWidth="md"
        fullWidth>

        <DialogTitle>
          Détails de la Communication
          <Button onClick={handleDialogClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="datetime"
            type="datetime-local"
            fullWidth
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        <InputLabel id="select-label-1">Raison d'appel</InputLabel>
     
<Select
  labelId="select-label-1"
  id="select-1"
  value={raisonList}
  onChange={(e) => raisonList(e.target.value)}
  fullWidth
>
{raisonList.map((raison) => (
              <MenuItem key={raison.ID_RAISON} value={raison}>{raison.LIBELLE}</MenuItem>
            ))}
</Select>
          <TextField
            margin="dense"
            id="details"
            label="Détails Communication"
            multiline
            rows={4}
            fullWidth
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <InputLabel id="select-label-1">Qualification d'appel</InputLabel>
          <Select
            labelId="select-label-1"
            id="select-1"
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            fullWidth
          >
          
          </Select>
        </DialogContent>
        <DialogActions>
        <Button
                    variant="contained"
                    size="small"
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      transition: "background-color 0.3s",
                      width: "150px",
                      height: "40px",
                      marginTop: "10px",
                      marginLeft: "650px",
                    }}
                    startIcon={<SaveOutlinedIcon />}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#C4D6E8";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                    onClick={()=>handleSaveCommunication(client)}
                    >
          Enregistrer</Button>
        </DialogActions>
        <DialogContent>
        <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2, width: '100%' }}>
          <Typography variant="h6" align="center" gutterBottom>
            Historique communication
          </Typography>
          <TableContainer >
          <Table>
            <TableHead>
              <TableRow> 
                <TableCell  sx={{
                                            backgroundColor: '#387ADF',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Date communication</TableCell>
                <TableCell  sx={{
                                            backgroundColor:'#387ADF',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                    
                                        }}>Détails communication</TableCell>
                <TableCell  sx={{
                                            backgroundColor:'#387ADF',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Raison d'appel</TableCell>
                <TableCell  sx={{
                                            backgroundColor: '#387ADF',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Qualification d'appel</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow >
                  <TableCell style={{backgroundColor:'#F5F4F4'}}> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell style={{backgroundColor:'#F5F4F4'}}> </TableCell>
                  <TableCell> </TableCell>
               
               
                </TableRow>
               
            </TableBody>
          </Table>
        </TableContainer>
            </Box>
            </DialogContent>
      </Dialog>

      <Dialog open={openHistoriqueDialog} onClose={handleHistoriqueDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Historique des commandes client
        </DialogTitle>
        <DialogContent>
       
      {commandes.map((command) => {
    
  
        return (
          
            <Card sx={{ height: '100%',marginBottom:"20px" }}>
              <CardContent sx={{ cursor: 'pointer', position: 'relative', height: '200px', marginBottom: "20px" }}>
              
                <Typography
              variant="h6"
              sx={{
                color: '#2196F3',
                textShadow: '0 0 8px rgba(33, 150, 243, 0.7)', 
                fontWeight: 'bold', 
                border: '1px solid #2196F3', 
                padding: '8px', 
                borderRadius: '4px', 
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              }}
            >
              Bon de livraison: {command.NUM_BLC}           {command.DATE_BLC}
            </Typography>
                <Typography>Code Client: {command.CLIENT_BLC}</Typography>
              
           
                <Typography>Client: {command.ADR_BLC_1}</Typography>
                <Typography>Adresses Client: {command.ADR_BLC_2}, {command.ADR_BLC_3}</Typography>
                <Typography>Total: {command.BLC_TOTAL}</Typography>
       
                <IconButton
                  onClick={() => handleCardClick(command)}
                  aria-expanded={expanded === command.NUM_BLC}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardContent>
              <Collapse in={expanded === command.NUM_BLC} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Article</TableCell>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Description</TableCell>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Pu TTC</TableCell>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Quantité</TableCell>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Montant TTC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {articles.length>0 && articles.map((article) => (
                        <TableRow key={article.BLCL_ARTICLE}>
                          <TableCell>{article.BLCL_ARTICLE}</TableCell>
                          <TableCell>{article.BLC_DES_ART}</TableCell>
                          <TableCell>{article.BLCL_PXU_TTC}</TableCell>
                          <TableCell>{article.BLCLQTE_L}</TableCell>
                           
                          <TableCell>{article.BLCL_MONTANT_TTC}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            
              </Card>
    
      );
    })}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoriqueDialogClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTarifDialog} onClose={()=>setOpenTarifDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Tarifs par famille 
        </DialogTitle>
        <DialogContent>
       
   
    
  
        <TableContainer style={{  maxHeight: '80%', overflowY: 'auto', border: '1px solid black' }}>

                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Famille</TableCell>
                      <TableCell style={{ backgroundColor: '#0B4C69', color: 'white' }}>Remise</TableCell>
                    
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tarifs.length>0 && tarifs.map((t) => (
                        <TableRow >
                          <TableCell>{t.INTITULE_FAM}</TableCell>
                          <TableCell>{t.REMISE_TF}</TableCell>
                    
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
             
           
             
     


        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenTarifDialog(false)} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </CustomCardWrapper>
  );
}


const CardContainer = ({ searchTerm,selectedClientType,selectedTri }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [raisonList, setRaisonList] = useState([]);
  const user = useSelector((state) => state.user);


  const [total, setTotal] = useState(0);

  const fetchPart = async () => {
    const URL = `${BASE_URL}/api/${selectedClientType}`;

    setLoading(true);
    try {
      const params = {
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
        selectedTri:selectedTri
      };

      if (user.ROLE === "collaborateur" && selectedClientType==="clientsCspd") {
        params.repres = user.COMMERCIAL_OK;
      }

      const response = await axios.get(URL, { params });
      setClients(response.data.clients);
      setTotal(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('There was an error fetching the clients!');
      setLoading(false);
    }

  
  };

  useEffect(() => {
    fetchPart();
  }, [page, pageSize, searchTerm, selectedClientType,selectedTri]);

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
  <div style={{ overflowY: 'auto', maxHeight: 'auto' }}>
    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
      <FormControlLabel
        control={
          <Checkbox
            name="clientsFdm"
            checked={selectedClientType === 'clientsFdm'}
            onChange={handleCheckboxChange}
          />
        }
        label="Clients FDM"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="clientsCspd"
            checked={selectedClientType === 'clientsCspd'}
            onChange={handleCheckboxChange}
          />
        }
        label="Clients CSPD"
      />
    </Box> */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {clients.map(client => (
        <CustomCard key={client.ID_CLIENT} client={client} selectedClientType={selectedClientType} user={user} />
      ))}
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
  </div>
);
};
export default CardContainer;

