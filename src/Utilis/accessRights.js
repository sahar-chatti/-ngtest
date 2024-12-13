import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../Utilis/constantes';

export const useAccessRights = (userLogin) => {
  const [accessRights, setAccessRights] = useState({});

  useEffect(() => {
    const fetchAccessRights = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        const userRights = response.data.find(user => user.LOGIN === userLogin);

        if (userRights) {
          setAccessRights({
            ACCESS_RECEPTION: Number(userRights.ACCESS_RECEPTION),
            ACCESS_CONTACT: Number(userRights.ACCESS_CONTACT),
            ACCESS_PARTENAIRE: Number(userRights.ACCESS_PARTENAIRE),
            ACCESS_INVESTISSEUR: Number(userRights.ACCESS_INVESTISSEUR),
            ACCESS_CLIENT_CSPD: Number(userRights.ACCESS_CLIENT_CSPD),
            ACCESS_CLIENT_FDM: Number(userRights.ACCESS_CLIENT_FDM),
            ACCESS_FAMILLE: Number(userRights.ACCESS_FAMILLE),
            ACCESS_HISTORIQUE_APPEL: Number(userRights.ACCESS_HISTORIQUE_APPEL),
            ACCESS_ACHATS: Number(userRights.ACCESS_ACHATS),
            ACCESS_FINANCE: Number(userRights.ACCESS_FINANCE),
            ACCESS_COMPTABILITE: Number(userRights.ACCESS_COMPTABILITE),
            ACCESS_IMPORT_EXPORT: Number(userRights.ACCESS_IMPORT_EXPORT),
            ACCESS_MAILING: Number(userRights.ACCESS_MAILING),
            ACCESS_ADMINISTRATION: Number(userRights.ACCESS_ADMINISTRATION),
            ACCESS_PARAMETRAGE: Number(userRights.ACCESS_PARAMETRAGE),
            ACCESS_MAGASIN: Number(userRights.ACCESS_MAGASIN),
            ACCESS_RH: Number(userRights.ACCESS_RH)
          });
        }
      } catch (error) {
        console.log('Error fetching access rights:', error);
      }
    };

    if (userLogin) {
      fetchAccessRights();
    }
  }, [userLogin]);

  return accessRights;
};
