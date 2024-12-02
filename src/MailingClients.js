import * as React from 'react';
import { useState, useEffect } from 'react';
import BASE_URL from './constantes';
import axios from 'axios';
import CardClientsPartenaires from './MailingcardclientsPartenaires'
import CardInvestisseursCSPD from './MailingCardInvestisseurCSPD';
import Checkbox from '@mui/material/Checkbox';
import CardInvestisseur from './CardInvestisseurs'
import CardClientsCSPD from './MailingcardclientCSPD';
import PropTypes from 'prop-types';
import cliIcon from './icons/clients.png'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import {
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  InputAdornment,
  Typography
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ClientsIcon from './icons/addClient.png'
import MailIcon from '@mui/icons-material/Mail';
import { Person } from '@mui/icons-material';

function CustomTabPanel({
  value,
  index,
  other,
  searchTerm,
  setSearchTerm,
  selectedOption,
  setSelectedOption }) {

  const [displayMode, setDisplayMode] = useState('card');
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tot, setTot] = useState(0)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedAvancement, setSelectedAvancement] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [searchClient, setSearchClient] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedValue, setSelectedValue] = useState('option1');
  const [allSelected, setAllSelected] = useState(false)
  const [boiteMail, setBoiteMail] = useState('');
  const [messages, setMessages] = useState('');
  const [open, setOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [subject, setSubject] = useState('');
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [fileNames, setFileNames] = useState([]); // To hold the selected file names


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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


  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <div style={{ display: 'flex', alignItems: 'center', marginRight: "20px", width: "380px" }}>
        <img src={cliIcon} alt="Clients Icon" style={{ height: '40px', width: '40px', marginRight: '10px' }} />
        <span style={{ fontWeight: 'bold', fontSize: "18px" }}>{label} : {tot}</span>
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
      style={{ marginRight: '20px' }}
    />
  ) : null;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setMessages(event.target.value);
  };
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };
  const selectAll = () => {
    setAllSelected(!allSelected);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!subject || !messages || !boiteMail) {
        alert('Please fill in all required fields.');
        return;
    }

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', messages);
    formData.append('code', boiteMail);

    // Append all selected files to FormData
    files.forEach((file, index) => {
        formData.append('files', file);
    });

    try {
        const res = await axios.post('http://192.168.1.170:3300/mailing', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        alert('Email sent successfully!');
        setEmailSent(true);
        
        // Reset form
        setMessages("");
        setSubject("");
        setBoiteMail("");
        setFiles([]); // Reset files array
        setFileNames([]); // Reset file names
        setOpen(false); // Close dialog
        
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Error sending email: ' + (error.response ? error.response.data : error.message));
    }
};
const [fileName, setFileName] = useState(''); // To hold the selected file name

  useEffect(() => {
    fetchClients();
  }, [page, pageSize, searchClient]);
  const [files, setFiles] = useState([]); // To hold multiple file objects

  const [file, setFile] = useState(null);

  // Handle file selection

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
    setFiles(selectedFiles);
    const names = selectedFiles.map(file => file.name); // Extract file names
    setFileNames(names); // Update the fileNames state with the selected file names
};


  // Handle file upload
  const handleFileUpload = async () => {
      if (!file) {
          alert('Please select a file first!');
          return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
          const response = await axios.post('http://192.168.1.170:3300/upload', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          alert('File uploaded successfully');
      } catch (error) {
          console.error('Error uploading file:', error);
          alert('Failed to upload file');
      }
  };
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
                defaultValue="Enregistrés"

              >
                {(index === 0 || index === 1) && (
                  <>
                    <FormControlLabel value="1" control={<Radio />} label="Enregistrés" />
                  </>
                )}
                {(index === 2 || index === 3) && (
                  <>
                    <FormControlLabel value="1" control={<Radio />} label="Clients" />

                  </>
                )}
              </RadioGroup>
              <Box sx={{ ml: 2 }}>


                <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                  <Typography style={{ height: '40px', color: '#545454', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <Checkbox {...label} onClick={() => selectAll()} />
                    Sélectionner tous
                  </Typography>
                  <Button style={{ height: '40px', width: '120px', color: 'white', backgroundColor: '#3477d3', marginLeft: '20px', fontWeight: 'bold' }} onClick={handleClickOpen}>
                    <MailIcon style={{ marginRight: '5px' }} />
                    Mailing
                  </Button>
                </Box>
                <div>
                  <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>New Message</DialogTitle>
<DialogContent>
  <TextField 
    fullWidth 
    placeholder="To:" 
    value={boiteMail} 
    onChange={(e) => setBoiteMail(e.target.value)} 
    sx={{ mb: 2 }} 
  />
  <TextField 
    fullWidth 
    placeholder="Subject:" 
    value={subject} 
    onChange={(e) => setSubject(e.target.value)} 
    sx={{ mb: 2 }} 
  />
  <TextField
    multiline 
    rows={4} 
    fullWidth 
    placeholder="Type your message" 
    value={messages}
    onChange={(e) => setMessages(e.target.value)}
    sx={{ mb: 2 }}
  />
  <label 
    htmlFor="file-upload" 
    style={{ cursor: 'pointer', color: '#3477d3' }}
  >
    Attach a file
    {fileNames.length > 0 && <p>Selected files: {fileNames.join(', ')}</p>} {/* Display selected file names */}

  </label>

  <input
  id="file-upload"
  type="file"
  multiple // Add this to enable multiple file selection
  onChange={handleFileChange}
  style={{ display: 'none' }}
/>
</DialogContent>


                    <DialogActions >
                    <Button
                        style={{ fontSize: '15px', color: 'white', backgroundColor: '#3477d3', width: '120px', textAlign: 'center', height: '40px' }}
                        onClick={handleSendCode}
                      >
                        Envoyé <SendIcon style={{ marginLeft: '10px' }} />
                      </Button>

                      <Button onClick={handleClose} style={{ fontSize: '15px' }} color="primary">
                        Annuler
                      </Button>
                   
                    </DialogActions>
                  </Dialog>
                </div>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
              {renderIconAndText()}
              {renderSelectClImage}
              {renderSearchInput}
            </Box>
          </Box>
         
          {index === 0 && selectedOption === '0' && displayMode === 'card' && (
            <div></div>
          )}
          
          {index === 0 && selectedOption === '1' && displayMode === 'card' && (

            <CardClientsPartenaires selectedAll={allSelected} displayMode={displayMode} setOpen={handleClickOpen} searchTerm={searchTerm} setBoite={(setBoite) => setBoiteMail(setBoite)} />
          )}
        
          {index === 1 && selectedOption === '1' && displayMode === 'card' && (
            <CardInvestisseursCSPD displayMode={displayMode} selectedAll={allSelected} setOpen={handleClickOpen} searchTerm={searchTerm} setBoite={(setBoite) => setBoiteMail(setBoite)} />
          )}
          
          {index === 1 && selectedOption === '0' && displayMode === 'card' && (
            <CardInvestisseur displayMode={displayMode} searchTerm={searchTerm} selectedAvancement={selectedAvancement} setTot={setTot} />
          )}

          {index === 2 && selectedOption === '1' && displayMode === 'card' && (
            <CardClientsCSPD  selectedAll={allSelected} selectedClientType={"clientsCspd"}  setOpen={handleClickOpen} displayMode={displayMode} searchTerm={searchTerm} setBoite={(setBoite) => setBoiteMail(setBoite)}  />
          )}
          
          {index === 3 && selectedOption === '1' && displayMode === 'card' && (
            <CardClientsCSPD  selectedAll={allSelected} selectedClientType={"clientsFdm"}  setOpen={handleClickOpen}  searchTerm={searchTerm} displayMode={displayMode} setBoite={(setBoite) => setBoiteMail(setBoite)}  />
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

export default function BasicTabs({ searchTerm, setSearchTerm, selectedOption, setSelectedOption, value, setValue, }) {

  const handleChange = (newValue) => {
    console.log("value", newValue)
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
      <CustomTabPanel value={value} index={1} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <CustomTabPanel value={value} index={2} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <CustomTabPanel value={value} index={3} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
