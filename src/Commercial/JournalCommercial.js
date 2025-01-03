

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Select,
  MenuItem
} from '@mui/material';
import BASE_URL from '../Utilis/constantes';
import { useSelector } from 'react-redux';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';

const JournalCommercial = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [communications, setCommunications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.user);
  const theme = useTheme();

  const isAdmin = user?.ROLE === "administrateur" ;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setSearchTerm({ LOGIN: user?.LOGIN, UTILISATEUR: user?.UTILISATEUR });
    }
  }, [user, isAdmin]);

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
      const searchQuery = isAdmin ? searchTerm.LOGIN : user?.LOGIN;

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
        console.error('Error fetching communications:', error);
      }
    }
  };

  const renderTableRow = (comm) => {
    if (comm.COLLABORATOR) {
      return (
        <TableRow key={comm.ID}>
          <TableCell>{new Date(comm.DATE_COMMUNICATION || comm.CALL_DATE).toLocaleString()}</TableCell>
          <TableCell style={{ alignItems: "center", display: "flex" }}>
            <PhoneCallbackIcon sx={{ mr: 1, color: "blue" }} />
            {comm.TYPE_APPEL || "Appel Sortant"}
          </TableCell>
          <TableCell>{comm.COLLABORATOR}</TableCell>
          <TableCell>{comm.PARTENAIRE || comm.CLIENT_NAME}</TableCell>
          <TableCell>{comm.RAISON}</TableCell>
          <TableCell>{comm.QUALIFICATION || "Consultation client"}</TableCell>
          <TableCell>{comm.DETAILS_COMMUNICATION || comm.DESCRIPTION}</TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow key={comm.id}>
        <TableCell>{new Date(comm.DATE_COMMUNICATION).toLocaleString()}</TableCell>
        <TableCell style={{ alignItems: "center", display: "flex" }}>
          {comm.TYPE_APPEL === "appel entrant" ? (
            <PhoneForwardedIcon sx={{ mr: 1, color: "green" }} />
          ) : (
            <PhoneCallbackIcon sx={{ mr: 1, color: "blue" }} />
          )}
          {comm.TYPE_APPEL}
        </TableCell>
        <TableCell>{comm.UTILISATEUR}</TableCell>
        <TableCell>{comm.PARTENAIRE ? `Par: ${comm.PARTENAIRE}` : `Inv: ${comm.INVESTISSEUR}`}</TableCell>
        <TableCell>{comm.RAISON}</TableCell>
        <TableCell>{comm.QUALIFICATION}</TableCell>
        <TableCell>{comm.DETAILS_COMMUNICATION}</TableCell>
      </TableRow>
    );
  };

  return (
    <Paper style={{ padding: 16 }}>
      <h2>Journal des Appels</h2>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
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
        
        {isAdmin ? (
          <Select
            labelId="select-label-1"
            id="select-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px" }}
          >
            {users?.map((raison) => (
              <MenuItem key={raison.ID_UTILISATEUR} value={raison}>
                {raison.UTILISATEUR}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            disabled
            value={user?.UTILISATEUR || ''}
            variant="outlined"
            style={{ width: "250px" }}
          />
        )}

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch} 
          style={{ marginLeft: 16 }}
        >
          Résultat
        </Button>
      </div>

      <TableContainer component={Paper} style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Date', "Type d'appel", 'Collaborateur', 'Contact', 'Raison', 'Status', 'Description'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {communications.map((comm) => renderTableRow(comm))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default JournalCommercial;
