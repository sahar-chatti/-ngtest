import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,useTheme,InputAdornment,IconButton,Select,InputLabel,MenuItem} from '@mui/material';
import BASE_URL from './constantes';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
const CallsJournal = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [communications, setCommunications] = useState([]);
  const [searchTerm,setSearchTerm]=useState("")
  const [users,setUsers]=useState([])
  const user=useSelector((state)=>state.user)
  const theme = useTheme();
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Implement your search logic here
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setUsers(response.data);
 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = async () => {
    if (startDate && endDate) {
      let searchQuery = searchTerm.LOGIN;
      if (user?.ROLE !== "administrateur" && user?.ROLE !== "directeur communication") {
        searchQuery = user?.LOGIN; 
      } 
  
      try {
        const response = await axios.get(`${BASE_URL}/api/communicationsByPeriod`, {
          params: {
            du: startDate,
            au: endDate,
            searchTerm: searchQuery,
          }
        });
        setCommunications(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des communications:', error);
      }
    }
  };
  
 
  return (
    <Paper style={{ padding: 16 }}>
      <h2>Journal des Appels</h2>
      <div style={{ marginBottom: 16 ,display:"flex",alignItems:"center"}}>
        <TextField
          label="Date de début"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          style={{ marginRight: 16 }}
        />
        <TextField
          label="Date de fin"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          style={{ marginRight: 16 }}
        />
        {((user?.ROLE==="administrateur") || (user?.ROLE==="directeur communication")) && (
          <>
              {/* <InputLabel id="select-label-1">Collaborateur</InputLabel> */}
              <Select
                labelId="select-label-1"
                id="select-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{width:"250px"}}
              >
                {users?.map((raison) => (
                  <MenuItem key={raison.ID_UTILISATEUR} value={raison}>{raison.UTILISATEUR}</MenuItem>
                ))}
              </Select>
              </>
)}
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: 16 }}>
          Résultat
        </Button>
      </div>
      <TableContainer component={Paper} style={{maxHeight:"70vh",overflowY:"auto"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                            
                                        }}>Date</TableCell>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                            
                                        }}>Type d'appel</TableCell>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                            
                                        }}>Collaborateur</TableCell>
              <TableCell sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                            
                                        }}>Partenaire/Investisseur</TableCell>
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
              <TableCell  sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.common.white,
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                           
                                            
                                        }}>Détails communication</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {communications.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell>{new Date(comm.DATE_COMMUNICATION).toLocaleString()}</TableCell>
                <TableCell style={{alignItems:"center",display:"flex"}}>
                {comm.TYPE_APPEL === "appel entrant" ? (
          <PhoneForwardedIcon sx={{ mr: 1,color:"green" }} />  
        ) : (
          <PhoneCallbackIcon sx={{ mr: 1 ,color:"blue"}} />  
        )}
        {comm.TYPE_APPEL}
      
      </TableCell>
                <TableCell>{comm.UTILISATEUR}</TableCell>
                <TableCell>{comm.PARTENAIRE?`Par: ${comm.PARTENAIRE}`:`Inv :${comm.INVESTISSEUR}`}</TableCell>
                <TableCell>{comm.RAISON}</TableCell>
                <TableCell>{comm.QUALIFICATION}</TableCell>
                <TableCell>{comm.DETAILS_COMMUNICATION}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
      </TableContainer>
    </Paper>
  );
};

export default CallsJournal;