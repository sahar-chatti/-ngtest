import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import SmsIcon from '@mui/icons-material/Sms';
import CloseIcon from '@mui/icons-material/Close';
import BASE_URL from './constantes';
const ClientList = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md')); // Check for medium screen size
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [details, setDetails] = useState('');
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/clientsFDM?page=${page + 1}&pageSize=${pageSize}`)
      .then(response => {
        console.log('Data from API:', response.data);
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('There was an error fetching the clients!');
        setLoading(false);
      });
  }, [page, pageSize]);

  const columns = [
    { id: 'COMPTE_CLIENT', label: 'COMPTE CLIENT', minWidth: 150 },
    { id: 'CODE_CLIENT', label: 'CODE CLIENT', minWidth: 150 },
    { id: 'INTITULE_CLIENT', label: 'INTITULE CLIENT', minWidth: 100 },
    { id: 'TEL_CLIENT_F', label: 'TEL CLIENT F', minWidth: 130 },
    { id: 'ADR_C_FACT_1', label: 'ADR C FACT 1', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 300, align: 'center' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const handleOpen = (client) => {
    setCurrentClient(client);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentClient(null);
  };

  const handleSaveCommunication = () => {
    // Handle saving communication details
    console.log('Save Communication:', { dateTime, details });

    setOpen(false);
    setCurrentClient(null);
  };

  if (loading) {
    return (
      <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <Box sx={{ flex: '2', overflow: 'hidden' }}>
        <Paper elevation={3}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        minWidth: column.minWidth,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client, index) => (
                  <TableRow key={index} hover>
                    {columns.map((column) => {
                      const value = client[column.id];
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                              <Tooltip title="Appeler">
                                <IconButton color="primary" onClick={() => handleOpen(client)}>
                                  <PhoneIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Email">
                                <IconButton color="primary">
                                  <EmailIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Réunion">
                                <IconButton color="primary">
                                  <EventIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="SMS">
                                <IconButton color="primary">
                                  <SmsIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
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

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Détails de la Communication
          <Button onClick={handleClose} style={{ position: 'absolute', right: '8px', top: '8px' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remplissez les détails de la communication.
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveCommunication} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientList;
