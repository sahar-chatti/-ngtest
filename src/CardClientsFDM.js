import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import SmsIcon from '@mui/icons-material/Sms';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import BASE_URL from './constantes';

const CustomCardWrapper = styled(Card)(({ theme }) => ({
  width: 'calc(25% - 16px)', 
  margin: theme.spacing(1),
  border: '1px solid #ccc', 
  borderRadius: theme.shape.borderRadius, 
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
  },
}));

const CustomCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const CustomCardActions = styled(CardActions)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 16px',
});

const CustomButton = styled(Button)({
  fontSize: '0.6rem',
  minWidth: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
});

function CustomCard({ client }) {
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [details, setDetails] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveCommunication = () => {
    setOpen(false);
  };

  return (
    <CustomCardWrapper>
      <CustomCardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {client.INTITULE_CLIENT}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {client.TEL_CLIENT_L}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {client.ADR_C_FACT_1}
        </Typography>
      </CustomCardContent>
      <CustomCardActions>
        <CustomButton startIcon={<PhoneIcon />} size="small" onClick={handleOpen}>
          Appeler
        </CustomButton>
        <CustomButton startIcon={<EmailIcon />} size="small">
          Email
        </CustomButton>
        <CustomButton startIcon={<EventIcon />} size="small">
          Réunion
        </CustomButton>
        <CustomButton startIcon={<SmsIcon />} size="small">
          SMS
        </CustomButton>
      </CustomCardActions>
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
            label="Détails Comunication"
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
    </CustomCardWrapper>
  );
}

function CardContainer() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/clientsFDM?page=${page + 1}&pageSize=${pageSize}`)
      .then(response => {
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('There was an error fetching the clients!');
        setLoading(false);
      });
  }, [page, pageSize]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {clients.map(client => (
          <CustomCard key={client.ID_CLIENT} client={client} />
        ))}
      </Box>
    </div>
  );
}

export default CardContainer;
