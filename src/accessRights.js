import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from './constantes';

export const useAccessRights = (userLogin) => {
  const [accessRights, setAccessRights] = useState(null);
  useEffect(() => {
    const fetchAccessRights = async () => {
      if (!userLogin) {
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/getUserAccess`, {
          params: { userLogin }
        });
        setAccessRights(response.data);
      } catch (error) {
        console.error('Rights fetch error:', error);
      }
    };

    fetchAccessRights();
  }, [userLogin]);

  return accessRights || {
    ACCESS_CONTACT: 0,
    ACCESS_ADMINISTRATION: 0,
    ACCESS_PARAMETRAGE: 0,
    ACCESS_MAGASIN: 0,
    ACCESS_RH: 0,
    ACCESS_MAILING: 0,
    ACCESS_IMPORT_EXPORT: 0,
    ACCESS_PARTENAIRE: 0,
    ACCESS_INVESTISSEUR: 0,
    ACCESS_CLIENT_CSPD: 0,
    ACCESS_CLIENT_FDM: 0,
    ACCESS_FAMILLE: 0,
    ACCESS_FINANCE: 0,
    ACCESS_HISTORIQUE_APPEL: 0,
    ACCESS_ACHATS: 0,
    ACCESS_COMPTABILITE: 0,
    ACCESS_RECEPTION: 0

  };
};
