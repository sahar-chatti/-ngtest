import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/FileOpen';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
import { Select, MenuItem, InputLabel } from '@mui/material'; 
import { useSelector } from 'react-redux';
import personIcon from './icons/person.png'
import statusIcon from './icons/status.png'
import addressIcon from './icons/address.png'
import mailIcon from './icons/mail.png'
import naisIcon from './icons/dateanniv.png'
import callIcon from './icons/call.png'
import userIcon from './icons/user.png'
import dateIcon from './icons/NAISS.png'
import {
  Grid
  
} from '@mui/material';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import socketIOClient from 'socket.io-client';
import Paper from '@mui/material';
import { Password } from '@mui/icons-material';
const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: '100%', // Full width for responsiveness
  margin: theme.spacing(1),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  height: '350px', // Set a fixed height for the card
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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

const CustomCardActions = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
  height: '50px', // Set a fixed height for the actions section
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: '0.75rem',
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
}));

const GreenButton = styled(CustomButton)(({ theme }) => ({
  color: theme.palette.success.main,
  '& .MuiButton-startIcon': {
    color: theme.palette.success.main,
  },
}));


function CustomCard({ client }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [details, setDetails] = useState('');
  const [selectValue1, setSelectValue1] = useState('');
  const [selectValue2, setSelectValue2] = useState('');
  const [selectValue3, setSelectValue3] = useState('');
  const [detailsCommunication, setDetailsCommunication] = useState('');
  const user = useSelector((state) => state.user);
  const [raisonList, setRaisonList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);
  const [selectedPartenaire, setSelectedPartenaire] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
const [selectedQualification,setSelectedQualification]=useState("")
const [selectedRaison,setSelectedRaison]=useState("")
  useEffect(() => {
    axios.get(`http://41.226.2.230:3200/api/RaisonsList`)
      .then(response => setRaisonList(response.data))
      .catch(error => console.error('Error fetching data:', error));

    axios.get(`http://41.226.2.230:3200/api/QualificationAppels`)
      .then(response => setQualificationList(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [openPartSuccess, setOpenPartSuccess] = useState(false);
const [openCommSuccess, setOpenCommSuccess] = useState(false);
  
  const handleOpenDialog = async (client) => {
   

    setSelectedPartenaire(client);
    setDateTime(new Date().toISOString().slice(0, 16));
    setOpenDialog(true);
    if (!client.USER_IN_CHARGE) {
      try {
        console.log("start")
        await axios.put(
          `http://41.226.2.230:3200/api/updatePartUser`,
          {id:client.ID_PARTENAIRE, USER_IN_CHARGE: user.LOGIN }
        );
        console.log("end")

      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
  };
  const handleSavePart = async (client, setOpenPartSuccess) => {
    if (client) {
      try {
        console.log("start saving");
        await axios.post(
          `http://41.226.2.230:3200/api/savePartenaire`,
          { user: user.LOGIN, name: client.NOM_PRENOM, tel: client.NUMERO_TELEPHONE, adresse: client.ADRESSE, password: client.MOT_DE_PASSE }
        );
        console.log("end");
        setOpenPartSuccess(true);
      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
  };
  
  const handleCloseDialog = () => setOpenDialog(false);
  
  const handleSaveCommunication = async (client, setOpenCommSuccess) => {
    if (client && selectedQualification && selectedRaison && detailsCommunication) {
      try {
        console.log("start create");
        await axios.post(
          `http://41.226.2.230:3200/api/CreateCommunication`,
          {
            ID_PARTENAIRE: client.ID_PARTENAIRE,
            ID_STATUT: selectedQualification.UPDATE_STATUS,
            ID_RAISON: selectedRaison.ID_RAISON,
            ID_QUALIFICATION: selectedQualification.ID_QUALIFICATION,
            DATE_COMMUNICATION: dateTime,
            DETAILS_COMMUNICATION: detailsCommunication
          }
        );
        console.log("end");
        await axios.put(
          `http://41.226.2.230:3200/api/updatePartStatus`,
          { id: client.ID_PARTENAIRE, id_statut: selectedQualification.UPDATE_STATUS }
        );
        setOpenCommSuccess(true);
      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
  
    setOpenDialog(false);
    setDateTime('');
    setDetailsCommunication('');
    setDetails('');
    setSelectValue1('');
    setSelectValue2('');
    setSelectValue3('');
    setSelectedPartenaire("");
    setSelectedQualification("");
    setSelectedRaison("");
  };
  
  const [contrat, setContrat] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
const [openInfoDialogue,setOpenInfoDialogue]=useState(false)
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFile(file);
    setContrat(file.name);
  }
};
const onClose =()=>{
  setOpenInfoDialogue(false)
}
  return (
    <CustomCardWrapper>
 <CustomCardContent>
 <Typography variant="h6" component="div" gutterBottom align="center" 
          style={{
            color: client.STATUS === "Pas encore traité" ? 'red' : 'green',
            fontWeight: "bold",
            textAlign:"center"
          }}>
          {client.STATUS}
        </Typography>
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={personIcon} alt="person icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.NOM_PRENOM}
        </Typography> 
        <Typography color="text.secondary" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={callIcon} alt="call icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.NUMERO_TELEPHONE}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={naisIcon} alt="birth icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {formatDate(client.DATE_NAISSANCE)}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={addressIcon} alt="address icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.ADRESSE}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={mailIcon} alt="email icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.EMAIL}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={dateIcon} alt="email icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
        {client.DATE_COMMUNICATION}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={userIcon} alt="user icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          <span style={{fontWeight:"bold"}}> {client.USER_IN_CHARGE} </span>
        </Typography>
      </CustomCardContent>  
          <CustomCardActions>
        <CustomButton startIcon={<SaveIcon />} size="small" onClick={() => handleSavePart(client)} >Enregistrer</CustomButton>
        <GreenButton
          startIcon={<PhoneIcon />}
          size="small"
          disabled={client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN}
          style={{
            backgroundColor: client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN ? 'grey' : 'white',
            color: client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN ? 'grey' : 'green',
          }}
          onClick={() => handleOpenDialog(client)}
        >
          Appeler
        </GreenButton>
        <Typography variant="body2" color="text.secondary" onClick={() => setOpenInfoDialogue(true)} >
          <Button startIcon={<EmailIcon />} size="small" style={{ color: '#FF8C00', fontSize: '0.55rem' }}>
            Document
          </Button>
        </Typography>
      </CustomCardActions>
      <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="md" 
  fullWidth
>

        <DialogTitle>
          Communication de {client.NOM_PRENOM}
          <Button onClick={handleCloseDialog} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Saisissez les détails de la communication.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="datetime"
            label="Date/Heure"
            type="datetime-local"
            fullWidth
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
          <InputLabel id="select-label-1">Raison d'appel</InputLabel>
          <Select
            labelId="select-label-1"
            id="select-1"
            value={selectedRaison}
            onChange={(e) => setSelectedRaison(e.target.value)}
            fullWidth
          >
            {raisonList.map((raison) => (
              <MenuItem key={raison.ID_RAISON} value={raison}>{raison.LIBELLE}</MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="details-communication"
            label="Détails Communication"
            multiline
            rows={4}
            fullWidth
            value={detailsCommunication}
            onChange={(e) => setDetailsCommunication(e.target.value)}
          />
          <InputLabel id="select-label-1">Qualification d'appel</InputLabel>
          <Select
            labelId="select-label-1"
            id="select-1"
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            fullWidth
          >
            {qualificationList.map((raison) => (
              <MenuItem key={raison.ID_QUALIFICATION} value={raison}>{raison.LIBELLE}</MenuItem>
            ))}
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
      </Dialog>
      <Dialog open={openInfoDialogue} onClose={onClose} >
      <DialogTitle>
        Plus d'informations
        <Button onClick={onClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{display:"flex",flexDirection:"column"}}>
          <Grid item xs={12} md={12}>
            <DialogContentText>CV</DialogContentText>
            <TextField
              margin="dense"
              id="niveau-scolaire"
              label="Niveau Scolaire"
              type="text"
              fullWidth
              value={client.NIVEAU_SCOLAIRE}
              
            />
            <TextField
              margin="dense"
              id="formations"
              label="Formations"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={client.FORMATIONS}
              
            />
          </Grid>
          <Grid item xs={12} md={12} >
            <DialogContentText>Contrat</DialogContentText>
            <Grid item xs={12} md={12} style={{display:"flex",alignItems:"center"}}>

            <TextField
              margin="dense"
              id="contrat"
              label="Contrat"
              type="text"
              fullWidth
              value={contrat}
             // onChange={(e) => setContrat(e.target.value)}
             style={{ marginRight: '16px' }}
            />
            <Button
              variant="contained"
              component="label"
              //style={{ marginTop: '16px' }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            {/* {selectedFile && <p>{selectedFile.name}</p>} */}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
    <Dialog 
  open={openPartSuccess} 
  onClose={() => setOpenPartSuccess(false)}
  PaperProps={{
    style: { borderRadius: 15, padding: '20px' }
  }}
>
  <DialogTitle style={{ color: '#4CAF50', textAlign: 'center', fontWeight: 'bold' }}>
    Succès
  </DialogTitle>
  <DialogContent>
    <DialogContentText style={{ textAlign: 'center', fontSize: '16px' }}>
      Partenaire enregistré avec succès.
    </DialogContentText>
  </DialogContent>
  <DialogActions style={{ justifyContent: 'center' }}>
    <Button 
      onClick={() => setOpenPartSuccess(false)} 
      variant="contained" 
      style={{ backgroundColor: '#4CAF50', color: 'white' }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

<Dialog 
  open={openCommSuccess} 
  onClose={() => setOpenCommSuccess(false)}
  PaperProps={{
    style: { borderRadius: 15, padding: '20px' }
  }}
>
  <DialogTitle style={{ color: '#4CAF50', textAlign: 'center', fontWeight: 'bold' }}>
    Succès
  </DialogTitle>
  <DialogContent>
    <DialogContentText style={{ textAlign: 'center', fontSize: '16px' }}>
      Communication enregistrée avec succès.
    </DialogContentText>
  </DialogContent>
  <DialogActions style={{ justifyContent: 'center' }}>
    <Button 
      onClick={() => setOpenCommSuccess(false)} 
      variant="contained" 
      style={{ backgroundColor: '#4CAF50', color: 'white' }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>
    </CustomCardWrapper>
  );
}

function CardContainer() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
const [userAffected,setUserAffected]=useState(false)
  useEffect(() => {
    setLoading(true);
    axios.get(`http://41.226.2.230:3200/api/partenaires?page=${page + 1}&pageSize=${pageSize}`)
      .then(response => {
        const clientsWithRating = response.data.map(client => ({
          ...client,
          rating: Math.floor(Math.random() * 5) + 1,
        }));
        setClients(clientsWithRating);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('There was an error fetching the clients!');
        setLoading(false);
      });
      const socket = socketIOClient('http://192.168.1.187:3002');
console.log("socket")
    
    socket.on('userInChargeUpdated', ({ id, USER_IN_CHARGE }) => {

      setClients(prevClients => {
        return prevClients.map(client =>
          client.ID_PARTENAIRE === id ? { ...client, USER_IN_CHARGE } : client
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [page, pageSize]);

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
    <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 64px)', padding: '16px' }}>
      <Grid container spacing={2}>
        {clients.map(client => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={client.ID_PARTENAIRE}>
            <CustomCard client={client} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 150, 200]}
          component="div"
          count={clients.length}
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