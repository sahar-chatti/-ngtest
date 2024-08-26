import * as React from 'react';
import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardPartenaires from './MailingCardPartenaires'; // Assurez-vous que le chemin est correct pour CardPartenaires
import ClientList from './ClientList';
import CommandesList from './CommandesEncours';
import senmail from './icons/mailing2.png'
import selectall from './icons/selectall.svg'
import SendIcon from '@mui/icons-material/Send';
import CardClientsFDM from './CardClientsFDM';
import Button from '@mui/material/Button';
import ClientListFDM from './ClientFDMList';
import ClientPartList from './MailingClientsPartenairesList';
import CardClientsPartenaires from './MailingcardclientsPartenaires'
import ListInvestisseursCSPD from './MailingListInvestisseurCSPD';
import CardInvestisseursCSPD from './MailingCardInvestisseurCSPD';
import PartenaireList from './PartenairesList';
import CardClientsCSPD from './MailingcardclientCSPD';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import { TextField,IconButton,Autocomplete,Table,TableBody,TableCell,TableHead,TablePagination,TableRow,Dialog,DialogContent,DialogTitle,DialogActions,Paper,TableContainer,InputAdornment} from '@mui/material';
import CardInvestisseur from './CardInvestisseurs'  
import Stock from './Stock'
import ClientsSearch from './components/clientSearch';
import ClientsIcon from './icons/addClient.png'
import BASE_URL from './constantes';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import cliIcon from './icons/clients.png'
import EmailIcon from '@mui/icons-material/Email';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CustomTabPanel({value,index,other,searchTerm,setSearchTerm,selectedOption,setSelectedOption,}) {

  const [displayMode, setDisplayMode] = React.useState('card'); // État pour gérer le mode d'affichage
  //const [selectedOption, setSelectedOption] = React.useState('0'); // État pour gérer l'option sélectionnée (0 pour Non Enregistrés, 1 pour Enregistrés)
//const [searchTerm,setSearchTerm]=React.useState("")
const [dialogOpen,setDialogOpen]=useState(false)
const [tot,setTot]=useState(0)
  const handleDisplayModeCard = () => {
    setDisplayMode('card');
  };

  const handleDisplayModeList = () => {
    setDisplayMode('list');
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Implement your search logic here
  };
  const avancementOptions = [
    'En cours',
    'Accepter par collaborateur', 
    'Refuser',
    'Injoignable',
    'Contrat signé',
    'En cours de signature',
    'Injoignable pour signature',
    'A rappeler'
  ];
  const triOptions = [
    'A->Z', 
    'Nbr jours', 
   
  ];
  const rotationOptions=[
    'rotation élevée',
    'rotation moyenne',
    'faible rotation'
  ]
  const [page, setPage] = useState(0);
const [pageSize, setPageSize] = useState(10);
const [userAffected,setUserAffected]=useState(false)
const [total, setTotal] = useState(0);
  const [selectedAvancement, setSelectedAvancement] =React.useState('');
  const [selectedTri, setSelectedTri] =React.useState('');
  const [selectedRotation, setSelectedRotation] =React.useState('');
  const [selectedClient, setSelectedClient] = React.useState(null);
  const [clients, setClients] = useState([]);
 const [searchClient,setSearchClient]=useState('')

 
  //const clients = clients
  const handleTriChange = (event, value) => {
    setSelectedTri(value);
  };
  const handleRotationChange = (event, value) => {
    setSelectedRotation(value);
  };
  const handleAvancementChange = (event, value) => {
    setSelectedAvancement(value);
  };
  useEffect(() => {
    fetchClients();
  }, [page, pageSize, searchClient]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientsCspdSearch`, {
        params: { page, pageSize, searchTerm: searchClient },
      });
      setClients(response.data.clients);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleSearchClientChange = (event) => {
    setSearchClient(event.target.value);
    setPage(0); 
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client.CODE_CLIENT);
  };
const [selectedCodeClient,setSelectedCodeClient]=useState(null)
  const handleConfirmSelection = () => {
    if (selectedClient) {
    
      setDialogOpen(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Conditionally render the search input for "Partenaires" tab
  const renderSearchInput =  
    <TextField
      variant="outlined"
      placeholder="Rechercher "
      value={searchTerm}
      onChange={handleSearchChange}
      InputProps={{
        endAdornment: (
          <IconButton>
            <SearchIcon />
          </IconButton>
        ),
      }}
      sx={{ width: "300px" }} 
    />
    
    const renderIconAndText = () => {
      let label = '';
      if (index === 0) {
        label = `Nombre de partenaires`;
      } else if (index === 1) {
        label = `Nombre d'investisseurs `;
      }
  
      if (selectedAvancement) {
        label += ` ${selectedAvancement}`;
      }
  
      return (index === 0 || index === 1) && selectedOption === "0" ? (
        <div style={{ display: 'flex', alignItems: 'center' ,marginRight:"20px",width:"380px"}}>
          <img src={cliIcon} alt="Clients Icon" style={{ height: '40px', width: '40px', marginRight: '10px' }} />
          <span style={{fontWeight:'bold',fontSize:"18px"}}>{label} : {tot}</span>
        </div>
      ) : null;
    };
    const renderSelectClImage = (index === 2 && selectedOption === '3') ? (
      <TextField
      fullWidth
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleDialogOpen}>
                <img src={ClientsIcon} alt="Clients Icon" style={{ height: '35px', width: '35px' }} />
              </IconButton>
            </InputAdornment>
          )
        }}
        variant="outlined"
        style={{marginRight:'20px'}}
      />
    ) : null;

  const renderFiltredRotInput = selectedOption==='4' ? (
    <Autocomplete
        options={rotationOptions}
        value={selectedRotation}
        onChange={handleRotationChange}
        renderInput={(params) => <TextField {...params} label="Filtrer par taux de rotation" variant="outlined" />}
        sx={{ width:"350px",marginRight:"20px" }}
      /> 
) : null;
  const renderTriInput = ((index === 2 || index===3) && selectedOption!=='3' )? (
    <Autocomplete
        options={triOptions}
        value={selectedTri}
        onChange={handleTriChange}
        renderInput={(params) => <TextField {...params} label="Trier par" variant="outlined" />}
        sx={{ width:"250px",marginRight:"20px" }}
      /> 
) : null;

const [open, setOpen] = useState(false);

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};
   
  const [values, setValues] = useState('')


  const [boiteMail,setBoiteMail]=useState([])

  const [allSelected,setAllSelected]=useState(false)

  const selectAll = () => {
    
    setAllSelected(!allSelected);
  };


{/*const toggleSelectAll = () => {
    const allSelected = clients.every(client => client.selectedCli);
    const updatedClients = clients.map(client => ({
      ...client,
      selectedCli: !allSelected
    }));
    console.log('hello',updatedClients)
    setClients(updatedClients);
    

  }; */}
  
 
 //email 
 const [email, setEmail] = useState('');
 const [code, setCode] = useState('');
 const [loginmail, setLoginmail] = useState('');
 const [username, setUsername] = useState('');
 
 const [messages, setMessages] = useState('');
 const [codeSent, setCodeSent] = useState();
 
 const handleSendCode = async(e) => {
   
   //let loginmail = (client.NUMERO_TELEPHONE)
 
   //let code = (client.MOT_DE_PASSE)
  //let username = (client.NOM_PRENOM)
 
   
     
        
 // alert(JSON.stringify(client))
 
   
 
    //return await axios.post('http://192.168.1.170:3200/signin', { email:client.EMAIL,loginmail, username,code }, {
            // headers: {
              //   "Content-Type": "application/json",
               //  'Authorization': ''
             }
       //  })
       //  .then(res => {
          //   alert(res.data)
            // setMessages(res.data);
           //  setCodeSent(true);
        // })
       //  .catch(error => {
        //  //   alert(error)
           //  setMessages('Error sending verification code');

        // });

 //}
 const [selectedValue, setSelectedValue] = useState('option1');

 const [sujet, setSujet] = useState(""); 

 const [text, setText] = useState(""); 

 

useEffect(()=>{  
console.log('Sujet',sujet)
console.log('helloou2',text)

  
  },[sujet,text])
  

  return (
<div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
     
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedValue}
                  onChange={handleOptionChange}
                >
                  {(index === 0 || index === 1) && (
                    <>
                  <FormControlLabel value="option1" control={<Radio />} label="Enregistrés" />
                  </>
                  )}
                   {(index === 2 || index === 3) && (
                    <>
                  <FormControlLabel value="1" control={<Radio />} label="Clients" />
                 
                  </>
                  )}
                </RadioGroup>
                <Box sx={{ ml: 2 }}>
                 
                  
                  <Button style={{height:'40px', width:'maxContent', color:'black', backgroundColor:'#FFDA76', marginLeft:'20px'}} onClick={()=>selectAll()}  >
                  <img src={selectall} alt="Clients Icon" style={{ height: '30px', width: '30px', }} />

                      Sélectionner tous
                  </Button>
                  <Button style={{height:'40px', width:'120px', color:'white', backgroundColor:'#3477d3', marginLeft:'20px'}}  onClick={handleClickOpen}>
                  <img src={senmail} alt="Clients Icon" style={{ height: '40px', width: '40px', }} />
                      Mailing
                  </Button>
                   
                  <Grid   style={{}}>
                  <Dialog open={open} onClose={handleClose} >
        <DialogTitle style={{backgroundColor:'#EEEDEB',textAlign:'start', color:'black',fontSize:'15px',height:'maxContent'}}>Nouveau message</DialogTitle>
        <DialogContent style={{marginTop:'20px'}}>
        <TextField 
         style={{marginTop:'5px', width:'555px'}}
            placeholder="à:"
            size="small"
            variant="outlined"
            value={boiteMail} // Concatenates selected emails into a single string
            InputProps={{
            readOnly:false,  }}
          />
           <TextField
            style={{marginTop:'5px', width:'555px'}}
            placeholder="Sujet:"
            size="small"
            variant="outlined"
            type='text'
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
          />

          {/* <TextField
          style={{marginTop:'5px'}}
            placeholder="Enter your paragraph here"
            multiline
            rows={10} // Adjust the number of rows as needed
            variant="outlined"
            fullWidth
                /> */} 
          <ReactQuill id='sahar' theme="snow" values={values} onChange={setValues} style={{marginTop:'5px', width:'555px', height:'150px'}} />
          
        </DialogContent>
       
        <DialogActions>
        <Button onClick={()=>{console.log("saharHtml",document.getElementsByClassName('ql-editor')[0].innerHTML)
          alert(document.getElementsByClassName('ql-editor')[0].innerHTML)
        }} style={{fontSize:'15px'}} color="primary">
           cc
          </Button>
          <Button onClick={handleClose} style={{fontSize:'15px'}} color="primary">
            Annuler
          </Button>
          <Button  style={{fontSize:'15px' , color:'white', backgroundColor:'#3477d3', width:'120px', textAlign:'center',height:'40px'}} onClick={handleSendCode}>
            Envoyé <SendIcon style={{marginLeft:'10px'}} />
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' ,justifyContent:"flex-end"}}>
                {renderIconAndText()}
              
                {renderTriInput}
                {renderSelectClImage}
                {renderFiltredRotInput}

                {renderSearchInput}
              </Box>
            </Box>
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Choisir un client
          <Button onClick={handleDialogClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher"
              value={searchClient}
              onChange={handleSearchClientChange}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
           
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code Client</TableCell>
                    <TableCell>Intitulé Client</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow
                      key={client.CODE_CLIENT}
                      hover
                      onClick={() => handleSelectClient(client)}
                      selected={selectedClient?.CODE_CLIENT === client.CODE_CLIENT}
                    >
                      <TableCell>{client.CODE_CLIENT}</TableCell>
                      <TableCell>{client.INTITULE_CLIENT}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={total}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Box>
        </DialogContent>
            <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSelection}
            disabled={!selectedClient}
            sx={{ mt: 2 }}
          >
            Sélectionner
          </Button>
          </DialogActions>
      </Dialog>
          {index === 0 && selectedOption === '0' && displayMode === 'card' && (
            <div></div>
            // <CardPartenaires displayMode={displayMode} searchTerm={searchTerm} selectedAvancement={selectedAvancement} setTot={setTot}/>
          )}
          {index === 0 && selectedOption === '0' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
              <div></div>
              {/* <PartenaireList searchTerm={searchTerm} selectedAvancement={selectedAvancement}/> */}
            </Box>
          )}
          {index === 0 && selectedOption === '1' && displayMode === 'card' && (
       
             <CardClientsPartenaires selectedAll={allSelected} displayMode={displayMode}  setOpen={handleClickOpen} searchTerm={searchTerm}  setBoite={(setBoite)=>setBoiteMail(setBoite)}  />
          )}
          {index === 0 && selectedOption === '1' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ClientPartList selectedAll={allSelected} displayMode={displayMode}  setOpen={handleClickOpen} searchTerm={searchTerm}  setBoite={(setBoite)=>setBoiteMail(setBoite)}  />
            </Box>
          )}
          {index === 1 && selectedOption === '1' && displayMode === 'card' && (
            <CardInvestisseursCSPD displayMode={displayMode} selectedAll={allSelected}   setOpen={handleClickOpen} searchTerm={searchTerm}  setBoite={(setBoite)=>setBoiteMail(setBoite)} />
          )}
            {index === 1 && selectedOption === '0' && displayMode === 'card' && (
            <CardInvestisseur displayMode={displayMode}  searchTerm={searchTerm} selectedAvancement={selectedAvancement} setTot={setTot}/>
          )}
          {index === 0 && selectedOption === '2' && (
            <CommandesList base={"fdm"} type={"partenaire"} searchTerm={searchTerm} />
          )}
            {index === 1 && selectedOption === '2' && (
            <CommandesList base={"cspd"} type={"investisseur"} searchTerm={searchTerm}/>
          )}
            {index === 2 && selectedOption === '2' && (
            <CommandesList base={"cspd"} type={"client"} searchTerm={searchTerm}/>
          )}
            {index === 3 && selectedOption === '2' && (
            <CommandesList base={"fdm"} type={"client"}  searchTerm={searchTerm}/>
          )}
          {index === 1 && selectedOption === '1' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ListInvestisseursCSPD />
            </Box>
          )}
          {index === 2 && selectedOption === '1'&&  displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ClientList selectedClientType={"clientsCspd"} searchTerm={searchTerm} selectedTri={selectedTri}/>
            </Box>
          )}
          {index === 2  && selectedOption === '1'&& displayMode === 'card' && (
            <CardClientsCSPD selectedClientType={"clientsCspd"}  displayMode={displayMode} selectedTri={selectedTri} searchTerm={searchTerm}/>
          )}
            {index === 3  && selectedOption === '1' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ClientList selectedClientType={"clientsFdm"} searchTerm={searchTerm} selectedTri={selectedTri}/>
            </Box>
          )}
          {index === 3  && selectedOption === '1' && displayMode === 'card' && (
            <CardClientsCSPD selectedClientType={"clientsFdm"} searchTerm={searchTerm} selectedTri={selectedTri} displayMode={displayMode} />
          )}
          
           { selectedOption === '3' && index===3 && (
            <Stock searchTerm={searchTerm}  codeCli={selectedClient} base={"fdm"} type={"client"}/>
          )}
            { selectedOption === '3' && index===0 && (
            <Stock searchTerm={searchTerm}  codeCli={selectedClient} base={"fdm"} type={"partenaire"}/>
          )}
           { selectedOption === '3' && index===2 && (
            <Stock searchTerm={searchTerm}  codeCli={selectedClient} base={"cspd"} type={"client"}/>
          )}
          { selectedOption === '3' && index===1 && (
            <Stock searchTerm={searchTerm}  codeCli={selectedClient} base={"cspd"} type={"client"}/>
          )}
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function BasicTabs({searchTerm,setSearchTerm,selectedOption,setSelectedOption,value,setValue, }) {
  //const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    console.log("value",newValue)
    setValue(newValue)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(e, newValue) => handleChange(newValue)} aria-label="basic tabs example">
          <Tab label="Partenaires" {...a11yProps(0)} />
          <Tab label="Investisseurs" />
          <Tab label="Clients Cspd" />
          <Tab label="Clients Fdm" />
        </Tabs>
        

      </Box>
       
      <CustomTabPanel value={value} index={0} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <CustomTabPanel value={value} index={1} searchTerm={searchTerm} setSearchTerm={setSearchTerm}  selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <CustomTabPanel value={value} index={2} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption}  />
      <CustomTabPanel value={value} index={3} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption}  />
     
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
