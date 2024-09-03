import * as React from 'react';
import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardPartenaires from './CardPartenaires'; // Assurez-vous que le chemin est correct pour CardPartenaires
import ClientList from './ClientList';
import CommandesList from './CommandesEncours';
import CardClientsFDM from './CardClientsFDM';
import Button from '@mui/material/Button';
import ClientListFDM from './ClientFDMList';
import ClientPartList from './ClientsPartenairesList';
import CardClientsPartenaires from './CardClientsPartenaires'
import ListInvestisseursCSPD from './ListInvestisseursCSPD';
import CardInvestisseursCSPD from './CardInvestisseurCSPD';
import PartenaireList from './PartenairesList';
import CardClientsCSPD from './CardClientCSPD';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import { TextField,IconButton,Autocomplete,Table,TableBody,TableCell,TableHead,TablePagination,TableRow,Dialog,DialogContent,DialogTitle,DialogActions,Paper,TableContainer,InputAdornment} from '@mui/material';
import CardInvestisseur from './CardInvestisseurs'  
import Stock from './Stock'
import ClientsSearch from './components/clientSearch';
import ClientsIcon from './icons/addClient.png'
import family from './icons/people-roof.svg'

import BASE_URL from './constantes';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import cliIcon from './icons/clients.png'
import annulerIcon from './icons/annuler.png'
import investmentIcon from './icons/investment.png'
import checkIcon from './icons/check.png'




function CustomTabPanel({value,index,other,searchTerm,setSearchTerm,selectedOption,setSelectedOption,setNumber}) {
// to change collab 
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [repres,setRepres]=useState([])
  const handleClickOpen = () => {
    setOpen(true);
    fetchUsers(); 
   };

  const handleClose = () => {
    setOpen(false);
  };  


  // fin 
  const [displayMode, setDisplayMode] = React.useState('card'); // État pour gérer le mode d'affichage
  //const [selectedOption, setSelectedOption] = React.useState('0'); // État pour gérer l'option sélectionnée (0 pour Non Enregistrés, 1 pour Enregistrés)
//const [searchTerm,setSearchTerm]=React.useState("")
const [dialogOpen,setDialogOpen]=useState(false)
const [tot,setTot]=useState({typeCli:'',nbr:0})


useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users`);
    setUsers(response.data);
    console.log('users from API test:', response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

useEffect(()=>{
 
  setNumber(tot.typeCli,tot.nbr)

},[tot])

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

  const handleAffectCollab = (user) => {
    if (user) {
      // setEditing(true);
      // setCurrentUser(user);
      // if(repres.length>0){
      // const representant = repres?.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
      // setSelectedRepres(representant);
      }
    }
  
  
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

      return( 
       null
    )
     
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
  const renderFiltredInput = ((index === 0 || index===1) && selectedOption!=='3') ? (
      <Autocomplete
          options={avancementOptions}
          value={selectedAvancement}
          onChange={handleAvancementChange}
          renderInput={(params) => <TextField {...params} label="Filtrer par statut" variant="outlined" />}
          sx={{ width:"250px",marginRight:"20px" }}
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
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  {(index === 0 || index === 1) && (
                    <>
                  <FormControlLabel value="0" control={<Radio />} label="Non Enregistrés" />
                  <FormControlLabel value="1" control={<Radio />} label="Enregistrés" />
                  </>
                  )}
                   {(index === 2 || index === 3) && (
                    <>
                  <FormControlLabel value="1" control={<Radio />} label="Clients" />
                 
                  </>
                  )}
                  
                  <FormControlLabel value="2" control={<Radio />} label="Commandes en cours" />
                  <FormControlLabel value="3" control={<Radio />} label="Etat de stock" />
                
                  
                </RadioGroup>


                <Box sx={{ ml: 2 }}>
                  <Button variant={displayMode === 'card' ? 'contained' : 'outlined'} onClick={handleDisplayModeCard}>
                    <ViewModuleIcon />
                  </Button>
                  <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  size="small"
                  sx={{ minWidth: '150px',  fontSize: '0.875rem', textTransform: 'none' }}
                >
                  Liste des collaborateurs
                </Button>
                 {/*<Button variant={displayMode === 'list' ? 'contained' : 'outlined'} onClick={handleDisplayModeList}>
                    <ViewListIcon />
                  </Button>*/}
                  <div>

                    
                  <Dialog open={open} onClose={handleClose} fullWidth
                    maxWidth="md" 
                    PaperProps={{
                    style: {
                      height: '90vh', 
                      maxHeight: '900vh', 
                           },
                   }}>
                  <DialogTitle> Liste des collaborateurs</DialogTitle>
                  <DialogContent>
                  <TableContainer component={Paper} style={{maxHeight:"700vh",overflowY:'auto'}}>
          <Table>
            <TableHead>
              <TableRow> 
                <TableCell  sx={{
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                        }}>Utilisateur</TableCell>
                <TableCell  sx={{
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Login</TableCell>
                <TableCell  sx={{
                                            
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            
                                        }}>Role</TableCell>
                <TableCell  sx={{
                                         
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                       
                                        }}>Email</TableCell>

                                              <TableCell  sx={{
                                         
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                       
                                        }}>Poste N°</TableCell>
                                             <TableCell  sx={{
                                          
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                       
                                        }}>Code software</TableCell>
                                         
                                         <TableCell  sx={{
                                          
                                          fontWeight: 'bold',
                                          borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                     
                                      }}>Actions</TableCell>
                                         
                                        
              </TableRow>
            </TableHead> 
            
            <TableBody>
            
  {users.map((user) => {
    const representative = repres.find((rep) => rep.NUM_REPRES === user.COMMERCIAL_OK);
    return (
      <TableRow key={user.ID_UTILISATEUR}>
  
        <TableCell>{user.UTILISATEUR}</TableCell>
        <TableCell>{user.LOGIN}</TableCell>
        <TableCell>{user.ROLE}</TableCell>
        <TableCell>{user.EMAIL}</TableCell>
        <TableCell>{user.NUM_POSTE}</TableCell>
        <TableCell>{user.CODE_SOFTWARE}</TableCell>
        <TableCell>
          <IconButton color="primary" onClick={() => handleAffectCollab(user)}>
          <img src={checkIcon} alt="check Icon" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
          </IconButton>
          </TableCell>
      </TableRow>
    );
  })}
</TableBody>

          </Table>
        </TableContainer>

                  
                  </DialogContent>
               <DialogActions>
                  <Button onClick={handleClose}   color="primary">
                        <img src={annulerIcon} alt="Annuler Icon" style={{ height: '24px', width: '24px', marginRight: '8px' }} />

                  </Button>
                  </DialogActions>
                 </Dialog>
                   </div>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' ,justifyContent:"flex-end"}}>
                {renderIconAndText()}
                {renderFiltredInput}
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
            <CardPartenaires displayMode={displayMode} searchTerm={searchTerm} selectedAvancement={selectedAvancement} setTotalObj={(tp,nn)=>{
              let obj={...tot}
              obj.typeCli=tp
              obj.nbr=nn
              setTot(obj)}}/>
          )}
          {/*{index === 0 && selectedOption === '0' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
              <PartenaireList searchTerm={searchTerm} selectedAvancement={selectedAvancement}/>
            </Box>
          )}*/}
          {index === 0 && selectedOption === '1' && displayMode === 'card' && (
            <CardClientsPartenaires displayMode={displayMode}  searchTerm={searchTerm}/>
          )} 
          {/*{index === 0 && selectedOption === '1' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ClientPartList />
            </Box>
          )}*/}
          
          {index === 1 && selectedOption === '1' && displayMode === 'card' && (
            <CardInvestisseursCSPD displayMode={displayMode} />
          )}
            {index === 1 && selectedOption === '0' && displayMode === 'card' && (
            <CardInvestisseur displayMode={displayMode} searchTerm={searchTerm} selectedAvancement={selectedAvancement} setTotalObj={(tp,nn)=>{
              let obj={...tot}
              obj.typeCli=tp
              obj.nbr=nn
              setTot(obj)}}/>
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
           
         {/*} {index === 1 && selectedOption === '1' && displayMode === 'list' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <ListInvestisseursCSPD />
            </Box>
          )} */}
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

export default function BasicTabs({searchTerm,setSearchTerm,selectedOption,setSelectedOption,value,setValue,tot}) {
  //const [value, setValue] = React.useState(0);

  const [numberCli,setNumberCli]=useState([])

  const handleChange = (newValue) => {
    console.log("value",newValue)
    setValue(newValue)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(e, newValue) => handleChange(newValue)} aria-label="basic tabs example">
         
        <Tab
            label={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '150px' }}>
            <img src={cliIcon} alt="Clients Icon" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
            <span>Partenaires</span>
            <span style={{ marginLeft: '1px'}}>
            <span style={{ marginLeft: '1px', fontWeight: 'bold' }}>
            {
            numberCli.length > 0 
            ? (numberCli.find((a) => a.typeCli === 'par') 
            ? `(${numberCli.find((a) => a.typeCli === 'par').Nbr || 0})` 
            : '(0)') 
            : '(0)'
            }
            </span>
            </span>
            </Box>
            }
            {...a11yProps(0)}
            />
          
          <Tab 
            label={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '150px' }}>
            <img src={investmentIcon} alt="investment Icon" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
            <span>Investisseurs</span>
            <span style={{ marginLeft: '1px', fontWeight: 'bold'}}>
            {
            numberCli.length > 0 
            ? (numberCli.find((a) => a.typeCli === 'inv') 
            ? `(${numberCli.find((a) => a.typeCli === 'inv').Nbr || 0})` 
            : '(0)') 
            : '(0)'
            }
            </span>
            </Box>
            }
            />
            
         

          <Tab label="Clients Cspd" />
          <Tab label="Clients Fdm" />
          <Tab label="Famille" />

        </Tabs>
      </Box>



      <CustomTabPanel value={value} index={0} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} 
      setNumber={ (TypeCl,num)=>{
        let newArray=[...numberCli]
        let editArray=[]

        let obj=newArray.filter((a)=>a.typeCli==TypeCl)

        if (obj.length==0){
          newArray.push({typeCli:TypeCl,Nbr:num})
        }else{
          editArray=[...numberCli.filter((a)=>a.typeCli!==TypeCl)]

          editArray.push({typeCli:TypeCl,Nbr:num})
          newArray=[...editArray]
        }
        
    
        setNumberCli(newArray)
      
      }} />
      <CustomTabPanel value={value} index={1} searchTerm={searchTerm} setSearchTerm={setSearchTerm}  selectedOption={selectedOption} setSelectedOption={setSelectedOption} setNumber={ (TypeCl,num)=>{
        let newArray=[...numberCli]
        let editArray=[]

        let obj=newArray.filter((a)=>a.typeCli==TypeCl)

        if (obj.length==0){
          newArray.push({typeCli:TypeCl,Nbr:num})
        }else{
          editArray=[...numberCli.filter((a)=>a.typeCli!==TypeCl)]

          editArray.push({typeCli:TypeCl,Nbr:num})
          newArray=[...editArray]
        }
        
    
        setNumberCli(newArray)
      }} />
      <CustomTabPanel value={value} index={2} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} setNumber={ (TypeCl,num)=>{
        let newArray=[...numberCli]
        let editArray=[]

        let obj=newArray.filter((a)=>a.typeCli==TypeCl)

        if (obj.length==0){
          newArray.push({typeCli:TypeCl,Nbr:num})
        }else{
          editArray=[...numberCli.filter((a)=>a.typeCli!==TypeCl)]

          editArray.push({typeCli:TypeCl,Nbr:num})
          newArray=[...editArray]
        }
        
    
        setNumberCli(newArray)
      }}  />





      <CustomTabPanel value={value} index={3} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} setNumber={ (TypeCl,num)=>{
        let newArray=[...numberCli]
        let editArray=[]

        let obj=newArray.filter((a)=>a.typeCli==TypeCl)

        if (obj.length==0){
          newArray.push({typeCli:TypeCl,Nbr:num})
        }else{
          editArray=[...numberCli.filter((a)=>a.typeCli!==TypeCl)]

          editArray.push({typeCli:TypeCl,Nbr:num})
          newArray=[...editArray]
        }
        
    
        setNumberCli(newArray)
      }}  />
     
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
