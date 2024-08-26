import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FranceFlag from './FranceFlag'; // Chemin vers le composant de drapeau de la France
import UKFlag from './UKFlag'; // Chemin vers le composant de drapeau du Royaume-Uni
import {
  Container, Grid, Typography, TextField, Button, Select, MenuItem, InputLabel, Box,
  InputAdornment, IconButton
} from '@mui/material';
import logoLogin from './images/login.png';
import backgroundImage1 from './images/bnt-1.png';
import logoCrm from './images/logo crrm.png';
import './Login.css';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setUser } from './store';
import BASE_URL from './constantes';








const Login = () => {
  const [language, setLanguage] = useState('fr');
  const [LOGIN, setLogin] = useState('');
  const [MOT_DE_PASSE, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    alert('Réinitialisation du mot de passe en cours...');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/authenticate`, { LOGIN, MOT_DE_PASSE }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.data && response.data.message === 'Authentification réussie') {
       
        await dispatch(setUser(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/appBar');
      } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (error) {
      console.log('Erreur lors de la requête:', error);
      alert('Erreur interne du serveur');
    }
  };

  

  return (
    <div className="background">
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} className="left-content">
            <img src={logoLogin} alt="Logo" className="logo" />
            <Typography variant="h5" className="description">
              La Solution Intégrée
            </Typography>
            <Typography variant="body1" className="additional-text">
              Optimisez les rênes de votre Entreprise avec<br />
              révolutionnaire et exceptionnelle !
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
          <div className="language-select-container">
            <Select
                labelId="language-select-label"
                value={language}
                onChange={handleLanguageChange}
                margin="normal"
            >
                <MenuItem value="fr" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FranceFlag style={{ marginRight: '10px' }} /> {/* Adjust margin as needed */}
                    Français
                </MenuItem>
                <MenuItem value="en" sx={{ display: 'flex', alignItems: 'center' }}>
                    <UKFlag style={{ marginRight: '10px' }} /> {/* Adjust margin as needed */}
                    Anglais
                </MenuItem>
            </Select>
        </div>
            <br />
            <div className="login-panel">
              <form onSubmit={handleLogin}>
                <br />
                <img src={logoCrm} alt="Logo" className="logo1" style={{ padding: '15px', marginRight: '-15px' }} />
                <br />
                <div className="form-group1">
                  <TextField
                    label="Login"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={LOGIN}
                    onChange={(e) => setLogin(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <br />
                <br />
                <div className="form-group2">
                  <TextField
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={MOT_DE_PASSE}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} tabIndex={-1} style={{ minWidth: 'unset', color: '#2e3956' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <br />
                <br />
                <Typography variant="body1" className="additional-text2" onClick={handlePasswordReset}>
                  Mot de passe oublié ?
                </Typography>
                <br />
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
                <br></br>
                            <br></br>
                            <br></br>
                            {/* <br></br> */}
                <Grid container className="boutons">
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className='connect'
                      fullWidth
                      style={{
                        backgroundImage: `url(${backgroundImage1})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    >
                      Se connecter
                    </Button>
                  </Grid>
                  <Box mt={33} className="copy">
                    <Typography variant="body2" color="textSecondary" left="15px" top="15px">
                      © {new Date().getFullYear()} Scienta Solution. Tous droits réservés.
                    </Typography>
                  </Box>
                </Grid>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
