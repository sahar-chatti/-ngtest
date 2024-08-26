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
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import SmsIcon from '@mui/icons-material/Sms';
import BASE_URL from './constantes';
function CustomCard({ client }) {
  return (
    <Card sx={{ minWidth: 275, m: 1 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {client.COMPTE_FOURNI}
        </Typography>
        <Typography variant="h5" component="div">
          {client.INTITULE_FOURN}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {client.ADR_F_FACT_1}
        </Typography>
        <Typography variant="body2">
          {client.TEL_FOURNI_F}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<SaveIcon />}>Enregistrer</Button>
        <Button size="small" startIcon={<PhoneIcon />}>Appeler</Button>
        <Button size="small" startIcon={<EmailIcon />}>Email</Button>
        <Button size="small" startIcon={<EventIcon />}>Réunion</Button>
        <Button size="small" startIcon={<SmsIcon />}>SMS</Button>
      </CardActions>
    </Card>
  );
}

function CardContainer() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Assurez-vous de définir l'état de page et pageSize
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/clientsInvestisseurs?page=${page + 1}&pageSize=${pageSize}`)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {clients.map(client => (
        <CustomCard key={client.id} client={client} />
      ))}
    </Box>
  );
}

export default CardContainer;
