import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import {Checkbox,Collapse,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';




import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
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
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

import {
  Grid
  
} from '@mui/material';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import socketIOClient from 'socket.io-client';
import Paper from '@mui/material';
import { Password, TroubleshootOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { InfoOutlined } from '@mui/icons-material'; 
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import BASE_URL from './constantes';
import { Await } from 'react-router-dom';
import io from 'socket.io-client';
  


const GlowingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: '#fff', // Default background color
  borderRadius: 20,
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  padding: '10px',
  '&:hover': {
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
  },
}));

const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1),
  border: '1px solid #ccc',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  height: '380px',
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

//debut function customcard
function CustomCard({ client,setClients,user ,fetchPart,setCollab}) {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [details, setDetails] = useState('');
  const [selectValue1, setSelectValue1] = useState('');
  const [selectValue2, setSelectValue2] = useState('');
  const [selectValue3, setSelectValue3] = useState('');
  const [detailsCommunication, setDetailsCommunication] = useState('');
  const [raisonList, setRaisonList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);
  const [selectedPartenaire, setSelectedPartenaire] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedQualification,setSelectedQualification]=useState("")
  const [selectedRaison,setSelectedRaison]=useState("")
  const [statuts,setStatus]=useState([])
  const [params,setParams]=useState([])
  const [filteredQualificationList, setFilteredQualificationList] = useState([]);
  const [contrat, setContrat] = useState(client.CONTRAT);
  const[selectedFile,setSelectedFile]=useState(null)
  const contratUrl = client.CONTRAT ? `http://192.168.1.195/api/Requests/contrat_partenaires/${client.CONTRAT}` : null;
  const [filteredRaisons,setFilteredRaisons]=useState([])
  const [list,setList]=useState([])
  const [savePart,setSavePart]=useState(false)
  const [cv,setCv] = useState(client.CV);
  const[selectedCv,setSelectedCv]=useState(null)

  // const handleCheckboxChange = (e) => {
  //   const isChecked = e.target.checked;

  //   // Mettre à jour l'état des clients
  //   setClients(prevClients => 
  //     prevClients.map(item =>
  //       item.id === client.id ? { ...item, collab: isChecked } : item
  //     )
  //   );
  // };

  // pour recupere les paretnaires selectionner pour l'affecter a un collaborateur


const [selectedClientIds, setSelectedClientIds] = useState([]);

const handleCheckboxChange = (clientId, isSelected) => {
  setSelectedClientIds(prevSelected => {
    const updatedSelection = isSelected
    ? [...prevSelected, clientId] // Ajoute l'ID à la liste
    : prevSelected.filter(id => id !== clientId); 


  // Affiche les IDs sélectionnés dans la console immédiatement après la mise à jour
  console.log('Selected Client IDs (immediate):', updatedSelection);

  return updatedSelection;
});
};


useEffect(() => {
  console.log('Selected Client IDs(useEffect):', selectedClientIds);
}, [selectedClientIds]); 


  /// fin 


  const handleCollabChange = (index, isChecked) => {
    setClients(prevClients => {
      const updatedClients = [...prevClients];
      updatedClients[index] = { ...updatedClients[index], collab: isChecked };
      return updatedClients;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("file",file.name)
      setContrat(file.name);
    }
    
  };
  
  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedCv(file);
      console.log("file",file.name)
      setCv(file.name);
    }
  };const handleSaveContrat = async () => {
    if (!selectedFile && !selectedCv) {
      alert('Veuillez télécharger un contrat ou bien cv');
      return;
    }
  
    try {
   
      const uploadFile = async (url, formData) => {
        const response = await axios.post(url, formData);
        console.log("response",response)
        if (response.status === 200) {
          return true;
        } else {
          console.error('Erreur lors de l\'envoi du fichier :', response.data.message);
          alert(`Échec de l'enregistrement : ${response.data.message}`);
          return false;
        }
      };
  
    
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        
        await axios.put(`${BASE_URL}/api/updatePartContrat`, {
          id: client.ID_PARTENAIRE,
          contrat: selectedFile.name,
        });
  
       
        const id = statuts.find((s) => s.AVANCEMENT === 'Contrat signé');
        await axios.put(
          `${BASE_URL}/api/updatePartStatus`,
          { id: client.ID_PARTENAIRE, id_statut: id?.ID_STATUT }
        );
  
      
        const contractUploadSuccess = await uploadFile('http://192.168.1.195/api/Requests/upload_contrat.php', formData);
        if (contractUploadSuccess) {
          alert('Contrat enregistré avec succès !');
          fetchPart();
        }
      }
  
     
      if (selectedCv) {
        const formDataCv = new FormData();
        formDataCv.append('file', selectedCv);
  
       
        await axios.put(`${BASE_URL}/api/updatePartCv`, {
          id: client.ID_PARTENAIRE,
          cv: selectedCv.name
        });
  
       
        const cvUploadSuccess = await uploadFile('http://192.168.1.195/api/Requests/upload_cv.php', formDataCv);
        if (cvUploadSuccess) {
          alert('Cv enregistré avec succès !');
          fetchPart();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier :', error);
      alert('Échec de l\'enregistrement du fichier.');
    }
  };
  
  
  const handleAcceptPart =async()=>{ 
    const id=statuts.filter((s)=>s.AVANCEMENT==='En cours de signature')
    console.log(id)
    await axios.put(
      `${BASE_URL}/api/updatePartStatus`,
      { id: client.ID_PARTENAIRE, id_statut: id[0]?.ID_STATUT }
    );
    await fetchPart()
    setOpenInfoDialogue(false)
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/api/RaisonsList`)
      .then(response => setRaisonList(response.data))
      .catch(error => console.error('Error fetching data:', error));

    axios.get(`${BASE_URL}/api/QualificationAppels`)
      .then(response => setQualificationList(response.data))
      .catch(error => console.error('Error fetching data:', error));
      axios.get(`${BASE_URL}/api/raisonQualifications`)
      .then(response => setParams(response.data))
      .catch(error => console.error('Error fetching data:', error));
      axios.get(`${BASE_URL}/api/raisonStatuts`)
      .then(response => setList(response.data))
      .catch(error => console.error('Error fetching data:', error));
      axios.get(`${BASE_URL}/api/StatutPartenaires`)
      .then(response => setStatus(response.data))
      .catch(error => console.error('Error fetching data:', error));
      
      // axios.get(`${BASE_URL}/api/StatutPartenaires`)
      // .then(response => {
      //     console.log('Data from API:', response.data);
      //     setStatus(response.data); 
          
      // })
      // .catch(error => { 
      //     console.error('Error fetching data:', error);
      //    //setError('There was an error fetching the statuts!');
         
      // });
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
  const [communications,setCommunications]=useState([])
  const[typeAppel,setTypeAppel]=useState("")
   const handleOpenDialog = async (client,type) => {
  setTypeAppel(type)

    setSelectedPartenaire(client);
    setDateTime(new Date().toISOString().slice(0, 16));
    setOpenDialog(true);
    if (!client.USER_IN_CHARGE) {
      try {
        console.log("start")
      
        await axios.put(
          `${BASE_URL}/api/updatePartUser`,
          {id:client.ID_PARTENAIRE, USER_IN_CHARGE: user.LOGIN }
        );
        console.log("end")
  
      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    } 
    const coms=await axios.get(
      `${BASE_URL}/api/getComPart`,{
        params: {
          id: client.ID_PARTENAIRE
        }
      }
    );
    console.log("coms",coms.data)
    setCommunications(coms.data)
  }; 
  const handleSavePart = async (client) => {
    if (client) {
      try {
        console.log("start saving");
        await axios.post(
          `${BASE_URL}/api/savePartenaire`,
          {id:client.ID_PARTENAIRE, user: user.LOGIN, name: client.NOM_PRENOM, tel: client.NUMERO_TELEPHONE, adresse: client.ADRESSE, password: client.MOT_DE_PASSE }
        );
        console.log("end");
        setOpenPartSuccess(true);
        setClients(prevClients => prevClients.filter(c => c.ID_PARTENAIRE !== client.ID_PARTENAIRE));
      } catch (error) {
        console.error('Error updating partenaire:', error);
      }
    }
  };
  
  const handleCloseDialog = () => setOpenDialog(false);
  
  const handleSaveCommunication = async (client) => {
    if (client && selectedQualification && selectedRaison ) {
      try {
        console.log("start create");
        await axios.post(
          `${BASE_URL}/api/CreateCommunication`,
          {
            ID_PARTENAIRE: client.ID_PARTENAIRE,
            ID_STATUT: selectedQualification.UPDATE_STATUS,
            ID_RAISON: selectedRaison.ID_RAISON,
            ID_QUALIFICATION: selectedQualification.ID_QUALIFICATION,
            DATE_COMMUNICATION: dateTime,
            DETAILS_COMMUNICATION: detailsCommunication,
            TYPE_APPEL:typeAppel,
            UTILISATEUR:user.LOGIN
          }
        );
        console.log("end");
        await axios.put(
          `${BASE_URL}/api/updatePartStatus`,
          { id: client.ID_PARTENAIRE, id_statut: selectedQualification.UPDATE_STATUS }
        );
await fetchPart()
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
  

const [openInfoDialogue,setOpenInfoDialogue]=useState(false)

useEffect(() => {
  if (selectedRaison) {
    const qualificationIds = params
      .filter(param => param.ID_RAISON === selectedRaison.ID_RAISON)
      .map(param => param.ID_QUALIFICATION);

    setFilteredQualificationList(
      qualificationList.filter(q => qualificationIds.includes(q.ID_QUALIFICATION))
    );
  } else {
    setFilteredQualificationList([]);
  }

 
}, [selectedRaison, params, qualificationList]);
useEffect(()=>{
  if(client.STATUS){
  const raisonsIds = list
  .filter(param => param.ID_STATUT === client.STATUS)
  .map(param => param.ID_RAISON);

setFilteredRaisons(
  raisonList.filter(q => raisonsIds.includes(q.ID_RAISON))
);
  }
  else{
    setFilteredRaisons(raisonList)
  }
},[client,list,raisonList])
const onClose =()=>{
  setOpenInfoDialogue(false)
} 
// const matchingStatut = statuts.find(row => row.LIBELLE === client.STATUS);
// console.log("matchingStatut",matchingStatut)
// const backgroundColor = matchingStatut ? matchingStatut.COULEUR : 'white';

const cvUrl = client.CV ? `http://192.168.1.195/api/Requests/cv_partenaires/${client.CV}` : null;

 {/* const [isSelected, setIsSelected] = useState(false);
const [selectedEmails, setSelectedEmails] = useState([]);

const handleCheckboxChange = (event) => {
  const isChecked = event.target.checked;
  setIsSelected(isChecked);

  if (isChecked) {
    // Add the email to the selected emails list
    setSelectedEmails((prevEmails) => {
      const updatedEmails = [...prevEmails, client.EMAIL];
      console.log('Selected emails after adding:', updatedEmails); // Display the updated selected emails
      return updatedEmails;
    });
  } else {
    // Remove the email from the selected emails list
    setSelectedEmails((prevEmails) => {
      const updatedEmails = prevEmails.filter((item) => item !== client.EMAIL);
      console.log('Selected emails after removing:', updatedEmails); // Display the updated selected emails
      return updatedEmails;
    });
  }

    console.log('Checkbox is checked:', isChecked); // Display if the checkbox is checked or not
    console.log('Selected emails:', selectedEmails); // Display the selected emails
  };
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };*/}

//email 
const [email, setEmail] = useState('');
const [code, setCode] = useState('');
const [loginmail, setLoginmail] = useState('');
const [username, setUsername] = useState('');

const [messages, setMessages] = useState('');
const [codeSent, setCodeSent] = useState();

const handleSendCode = async(e) => {
  
  let loginmail = (client.NUMERO_TELEPHONE)

  let code = (client.MOT_DE_PASSE)

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
const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [clientToDelete, setClientToDelete] = useState(null);

const handleOpenDeleteDialog = (client) => {
  setClientToDelete(client);
  setOpenDeleteDialog(true);
};

const handleCloseDeleteDialog = () => {
  setOpenDeleteDialog(false);
  setClientToDelete(null);
};

const handleConfirmDelete = async () => {
  try {
    await axios.post('http://192.168.1.195/api/Requests/jeux.php?action=delete-profil-part', {
      id: clientToDelete.ID_PARTENAIRE
    });

    await axios.delete(`${BASE_URL}/api/deletePart/${clientToDelete.ID_PARTENAIRE}`);

    fetchPart(); 
    handleCloseDeleteDialog(); 
  } catch (error) {
    console.error('Failed to delete partner:', error);
  }
};
return (
  <CustomCardWrapper>
    <CustomCardContent>
    <GlowingBox  style={{ backgroundColor:client.COULEUR?client.COULEUR:"white"}}>
          <Typography
            variant="h6"
            component="div"
            align="center"
            style={{
              color:client.COULEUR?"white":'black',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '1.2rem',
             
            }}
          >
            {client.AVANCEMENT ? client.LIBELLE : client.STATUS?client.STATUS:"Non encore traité"}
          </Typography>
          {/* Example icon */}
          <InfoOutlined style={{ marginLeft: '8px', fontSize: '1.5rem' }} />
        </GlowingBox>
        <Grid container style={{ display: 'flex', alignItems: 'center' }} > 
        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={personIcon} alt="person icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.NOM_PRENOM}
        </Typography>
       
        </Grid> 
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
        <Typography id="x" variant="body2" color="text.secondary"  style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={mailIcon} alt="email icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          {client.EMAIL} 
          <Button   onClick = {handleSendCode } size="small" style={{ color: '#FF8C00', fontSize: '0.55rem' }}>
           Mot de passe oublié
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={dateIcon} alt="email icon" style={{ marginRight: 8, width: "20px" ,height: "20px" }} />
        {formatDate(client.DATE_COMMUNICATION)}
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10}}>
          <img src={userIcon} alt="user icon" style={{ marginRight: 8, width: "20px", height: "20px" }} />
          <span style={{fontWeight:"bold"}}> {client.USER_IN_CHARGE}  </span>
          <input  type="checkbox"  
            checked={client.setCollab} onChange={(e)=>setCollab(e.target.checked)}
              
                        style={{ marginRight: 8 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img src={dateIcon} alt="email icon" style={{ marginRight: 8, width: "20px" ,height: "20px" }} />
        {formatDate(client.DATE_DEMANDE)}
        </Typography>

      </CustomCardContent>  
          <CustomCardActions>
          {client.AVANCEMENT === "Contrat signé" && (
    <CustomButton startIcon={<SaveIcon />} size="small" onClick={() => handleSavePart(client)}>
        Enregistrer
    </CustomButton>
)}

        <GreenButton
          startIcon={<PhoneForwardedIcon />}
          size="small"
          disabled={user.ROLE==="collaborateur"?client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN:false}
          style={{
            backgroundColor:  'white',
            color: client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN ? 'grey' : 'green',
          }}
          onClick={() => handleOpenDialog(client,'appel sortant')}
        >
          Appel sortant
        </GreenButton>
        <GreenButton
          startIcon={<PhoneCallbackIcon />}
          size="small"
          disabled={user.ROLE==="collaborateur"?client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN:false}
          style={{
            backgroundColor:  'white',
            color: client.USER_IN_CHARGE !== null && client.USER_IN_CHARGE !== user.LOGIN ? 'grey' : 'green',
          }}
          onClick={() => handleOpenDialog(client,'appel entrant')}
        >
          Appel entrant
        </GreenButton>
        <Typography variant="body2" color="text.secondary" onClick={() => setOpenInfoDialogue(true)} >
          <Button startIcon={<EmailIcon />} size="small" style={{ color: '#FF8C00', fontSize: '0.75rem' }}>
            Document
          </Button>
        </Typography>
        <Typography variant="body2" color="text.secondary"  onClick={() => handleOpenDeleteDialog(client)} >
          <Button startIcon={<DeleteIcon />} size="small" style={{ color: 'red', fontSize: '0.75rem' }}>
            Supprimer
          </Button>
        </Typography>
     
        {/* <Typography size="medium"  style={{ color: "#478CCF", fontSize:'12px',marginLeft:'-5px' }}>
     <Checkbox {...label}  checked={isSelected} // Contrôle si la case est cochée
              onChange={handleCheckboxChange} /> Sélectionner
        </Typography>*/}
      </CustomCardActions> 
      <Dialog
  open={openDeleteDialog}
  onClose={handleCloseDeleteDialog}
>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    <Typography>Êtes-vous sûr de vouloir supprimer ce partenaire?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDeleteDialog} color="primary">
      Non
    </Button>
    <Button onClick={handleConfirmDelete} color="error">
      Oui
    </Button>
  </DialogActions>
</Dialog>
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
            {filteredRaisons.map((raison) => (
              <MenuItem key={raison.ID_RAISON} value={raison}>{raison.LIBELLE}</MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="details-communication"
            label="Détails Communication"
            multiline
            rows={2}
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
            {filteredQualificationList.map((raison) => (
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
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Date communication</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                    
                                        }}>Détails communication</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Raison d'appel</TableCell>
                <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Qualification d'appel</TableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {communications.map((c) => (
                <TableRow key={c.ID_COMMUNICATION}>
                  <TableCell>{formatDate(c.DATE_COMMUNICATION)}</TableCell>
                  <TableCell>{c.DETAILS_COMMUNICATION}</TableCell>
                  <TableCell>{c?.RAISON}</TableCell>
                  <TableCell>{c?.QUALIFICATION}</TableCell>
               
               
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            </Box>
            </DialogContent>
      </Dialog>
      <Dialog open={openInfoDialogue} onClose={onClose}  maxWidth="md" 
  fullWidth >
      <DialogTitle>
        Plus d'informations
        <Button onClick={onClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{display:"flex",flexDirection:"column"}}>
          <Grid item xs={12} md={12}>
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
          <Typography variant="h6">CV</Typography>
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
              value={client.FORMATION}
              
            />
         <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          {contratUrl ? (
            <a href={contratUrl} target="_blank" rel="noopener noreferrer">
              <TextField
                margin="dense"
                id="cv"
                label="CV"
                type="text"
                fullWidth
                value={cv || "cv non disponible"}
                style={{ cursor: 'pointer', color: 'blue' }}
                disabled={!client.CV}
              />
            </a>
          ) : (
            <TextField
              margin="dense"
              id="cv"
              label="CV"
              type="text"
              fullWidth
              value={cv || "cv non disponible"}
              disabled
            />
          )}
        </Grid>
       
         <Grid item xs={12} md={4}>
         <IconButton
           style={{ color: 'blue', width: '100%', height: '100%' }}
           onClick={() => document.getElementById('cv-input').click()}
         >
           <CloudUploadIcon />
         </IconButton>
         <input 
           type="file"
           id="cv-input"
           style={{ display: 'none' }}
           onChange={handleCvUpload}
         />
       </Grid>
        
      
  
  
       </Grid>
            </Box>
          </Grid>
           <Grid item xs={12} md={12} >
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'grey.400', p: 2, mt: 2 }}>
          <Typography variant="h6">Contrat</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          {contratUrl ? (
            <a href={contratUrl} target="_blank" rel="noopener noreferrer">
              <TextField
                margin="dense"
                id="contrat"
                label="Contrat"
                type="text"
                fullWidth
                value={contrat || "Contrat non disponible"}
                style={{ cursor: 'pointer', color: 'blue' }}
                disabled={!client.CONTRAT}
              />
            </a>
          ) : (
            <TextField
              margin="dense"
              id="contrat"
              label="Contrat"
              type="text"
              fullWidth
              value={contrat || "Contrat non disponible"}
              disabled
            />
          )}
        </Grid>
       
         <Grid item xs={12} md={4}>
         <IconButton
           style={{ color: 'blue', width: '100%', height: '100%' }}
           onClick={() => document.getElementById('file-input').click()}
         >
           <CloudUploadIcon />
         </IconButton>
         <input 
           type="file"
           id="file-input"
           style={{ display: 'none' }}
           onChange={handleFileUpload}
         />
       </Grid>
        
       {(user.ROLE === "administrateur" && client.CONTRAT==='')&& (
  <Grid item xs={12} md={5}>
    <Button
      variant="contained"
      color="success" // You can change this to any color you prefer
      startIcon={<CheckCircleIcon />} // Adds the icon to the start of the button
      style={{ width: '100%', height: '100%', fontSize: '16px' }}
      onClick={handleAcceptPart}
    >
      Accepter comme partenaire
    </Button>
  </Grid>
)}
  
      </Grid>
            </Box>
          </Grid>
          <DialogActions>
          {(savePart || client.CONTRAT!=='') && (
          <Button
                    variant="contained"
                    size="small"
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      transition: "background-color 0.3s",
                      width: "250px",
                      height: "40px",
                      marginTop: "10px",
                    
                    }}
                    startIcon={<SaveOutlinedIcon />}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#C4D6E8";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                    onClick={()=>handleSavePart(client)}
                    >
          Enregistrer comme partenaire</Button> 
          )}
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
                      
                    }}
                    startIcon={<SaveOutlinedIcon />}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#C4D6E8";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                    onClick={()=>handleSaveContrat(client)}
                    >
          Enregistrer</Button> 
       
        </DialogActions> 
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

function CardContainer({searchTerm,selectedAvancement,setTotalObj}) {
  const [listclient, setListclient]=useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
const [userAffected,setUserAffected]=useState(false)
const [total, setTotal] = useState(0);
const user = useSelector((state) => state.user);
// const [searchTerm, setSearchTerm] = useState('');

const fetchPart=async()=>{
  const URL=user.ROLE==="collaborateur"?`${BASE_URL}/api/partenairesCollaborateur`:`${BASE_URL}/api/partenaires`
  setLoading(true);
  console.log('clientttt:',URL)
  try {
    const params = {
      page: page,
      pageSize: pageSize,
      searchTerm:searchTerm,
      avancement:selectedAvancement
    };
    
    if (user.ROLE === "collaborateur") {
      params.user = user.LOGIN;
    }
  
    const response = await axios.get(URL ,{ params });
    console.log(response.data)
//copy array
    let listClient=[...response.data.clients]
    let listFinale=[]

    console.log("listClient")

    listClient.map((row)=>{
      listFinale.push({...row,selectedCli:false,collab:false,})
     
    })
console.log("listclient",listFinale)



    setClients(listFinale);
    setTotal(response.data.total);
    setTotalObj("par",response.data.total);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('There was an error fetching the clients!');
    setLoading(false);
  }
      
}

const handleCollabChange = (index, isChecked) => {
  setClients(prevClients => {
    const updatedClients = [...prevClients];
    updatedClients[index] = { ...updatedClients[index], collab: isChecked };
    return updatedClients;
  });
};

    const updateClient = (id, USER_IN_CHARGE) => {
      setClients(prevClients =>
        prevClients.map(client =>
          client.ID_PARTENAIRE === id
            ? { ...client, USER_IN_CHARGE }
            : client
        )
      );
    };
    
    useEffect(() => {
      fetchPart();
    }, [page, pageSize, searchTerm,selectedAvancement]);
    
    useEffect(() => {
      const socket = new WebSocket('ws://localhost:8000');
    
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'update_partenaire') {
          updateClient(data.id, data.USER_IN_CHARGE);
        }
      };
    
      return () => {
        socket.close();
      };
    }, []); 
 
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

 

  const filteredClients =clients


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return(
  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

  <Box sx={{ flex: '1 1 auto', 
        maxHeight: `100vh`, 
        overflowY: 'auto',
      padding: '16px' }}> 
         {/* <Autocomplete
          options={avancementOptions}
          value={selectedAvancement}
          onChange={handleAvancementChange}
          renderInput={(params) => <TextField {...params} label="Filtrer par statut" variant="outlined" />}
          sx={{ marginBottom: '16px',width:"250px",marginLeft:"1%" }}
        /> */}
    <Grid container spacing={2}>
      {filteredClients.map((client,i) => (
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={client.ID_PARTENAIRE}>
       
          <CustomCard client={client} setClients={setClients} user={user} fetchPart={fetchPart} setCollab={(setCollab)=>{
          let clientsList=[...clients]

          clientsList[i].collab=setCollab
          setClients(clientsList);  
          
          console.log("yesminetest",clientsList)

          const selectedClients = clientsList.filter(client => client.collab);

          console.log("Clients with collab true only :", selectedClients);
          }}  /> 
        </Grid>
        ))}
     
    </Grid>
  </Box>

  {/* Pagination */}
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
};

export default CardContainer;
