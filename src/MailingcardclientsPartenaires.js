import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import EmailIcon from '@mui/icons-material/Email';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BASE_URL from './constantes';
import { TablePagination } from '@mui/material';
import { Checkbox } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

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


const GlowingBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 20,
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.3s ease-in-out',
  padding: '10px',
  '&:hover': {
    boxShadow: '0 0 16px rgba(0, 0, 0, 0.5)',
  },
}));



function CustomCard({ client, setSelectedCli, }) {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (

    <CustomCardWrapper style={{ backgroundColor: 'white', borderRadius: '15px', border: 'transparent' }}>
      <CustomCardContent >
        <GlowingBox style={{ backgroundColor: client.CC_BLOQUER ? "red" : "#7695FF", borderRadius: '11px' }}>
          <Typography
            variant="h6"
            component="div"
            align="center"
            style={{
              color: "white",
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {client.INTITULE_CLIENT ? client.INTITULE_CLIENT.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()) : 'N/A'}
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({client.INTITULE_GR || 'N/A'})</span>
          </Typography>
          {!client.CC_BLOQUER && (
            <Checkbox style={{ color: 'white' }}
              sx={{
                color: 'white',
                '& .MuiSvgIcon-root': {
                  borderRadius: '50%',
                }
              }}
              {...label} checked={client.selectedCli} onChange={(e) => setSelectedCli(e.target.checked)}

            />
          )}
          {client.CC_BLOQUER && (
            <BlockIcon style={{ marginLeft: '8px', fontSize: '1.5rem', color: "white" }} />
          )}
        </GlowingBox>

        <Typography style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <PhoneIphoneIcon style={{ marginRight: '0.3em' }} />
          <Button variant="text" color="primary">
            {client.TEL_CLIENT_F || 'No Phone Number'}
          </Button>
        </Typography>

        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <PinDropIcon style={{ marginRight: '0.5em' }} />
          {client.ADR_C_FACT_1 ? client.ADR_C_FACT_1.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()) : 'No Address'}
        </Typography>

        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <CoPresentIcon style={{ marginRight: '0.5em' }} />
          {client.INTITULE_REPRES ? client.INTITULE_REPRES.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()) : 'No Representative'}
        </Typography>

        <Typography variant="h6" component="div" gutterBottom style={{ display: "flex", alignItems: "center", marginBottom: 10, marginTop: "10px", color: '#545454', fontWeight: 'bold', fontSize: '16px' }}>
          <EmailIcon style={{ marginRight: '0.5em' }} />
          {client.EMAIL ? client.EMAIL.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()) : 'No Email'}
        </Typography>
      </CustomCardContent>
    </CustomCardWrapper>
  );
}


const CardContainer = ({ searchTerm, setBoite, selectedAll }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState(0);
  let listMail = ""

  useEffect(() => {
    (clients.filter((a) => a.selectedCli == true)).map((row) => {
      listMail += row.EMAIL + ';'
    })
    setBoite(listMail)
    console.log('boite email1', listMail)

  }, [clients])

  useEffect(() => {
    let newClient = [...clients]
    newClient.map((row) => {
      row.selectedCli = selectedAll
    })

    setClients(newClient)
    console.log('new client', newClient)
    console.log('boite emails2', selectedAll)

  }, [selectedAll])


  const fetchPart = async () => {
    const URL = `${BASE_URL}/api/clientsPartenaires`;

    setLoading(true);
    try {
      const params = {
        page: page,
        pageSize: pageSize,
        searchTerm: searchTerm,
      };

      const response = await axios.get(URL, { params });

      let clientsList = [...response.data.clients]
      let FinalList = []
      console.log("listClient")
      clientsList.map((row, i) => {
        FinalList.push({
           ...row, 
           selectedCli: false,
            EMAIL: i == 0 ? 'dev1cspd@gmail.com' : i == 1 ? 'dev1cspd@gmail.com' : 'sahar.chatti@isimg.tn' })

      })
      console.log("listclient", FinalList)

      setClients(FinalList);
      //all selected
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
  }, [page, pageSize, searchTerm]);



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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {clients.map((client, i) => (
          <CustomCard key={client.ID_CLIENT}
           client={client} user={user}
            setSelectedCli={(setSelectedCli) => {
            let clientsList = [...clients]
            clientsList[i].selectedCli = setSelectedCli
            setClients(clientsList);
          }}
          />
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

