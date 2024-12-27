import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://192.168.1.170:3300/api/vehicles";

const VehicleMaintenance = () => {
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    // Group 1: Administrative Documents
    documentGroup: {
      Assurance: "",
      Visite: "",
      Taxe: "",
      vehicule: ""
    },

    // Group 2: Maintenance Fluids & Filters
    maintenanceGroup: {
      Vidange_boite: { date: "", value: "" },
      Vidange_moteur: { date: "", value: "" },
      Vidange_poids_arriere: { date: "", value: "" },
      filtre_huile: "",
      filtre_gaz: "",
      filtre_air: "",
      filtre_clim: ""
    },

    // Group 3: Mechanical Components
    mechanicalGroup: {
      Amortisseurs: "",
      patins: "",
      rotules: "",
      chaine_distante: "",
      croix_chaine: { date: "", value: "" },
      Tendeur: "",
      pompe_eau: "",
      pompe_assiste: "",
      Autre: { date: "", value: "" }
    }
  });
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('documentGroup');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(API_URL);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicle records", error);
    }
  };

  const handleInputChange = (group, field, value) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const flattenedData = {
        ...formData.documentGroup,
        ...formData.maintenanceGroup,
        ...formData.mechanicalGroup
      };

      if (editing) {
        await axios.put(`${API_URL}/${editing}`, flattenedData);
      } else {
        await axios.post(API_URL, flattenedData);
      }

      await fetchVehicles();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const resetForm = () => {
    setFormData({
      documentGroup: {
        Assurance: "",
        Visite: "",
        Taxe: "",
        vehicule: ""
      },
      maintenanceGroup: {
        Vidange_boite: "",
        Vidange_moteur: "",
        Vidange_poids_arriere: "",
        filtre_huile: "",
        filtre_gaz: "",
        filtre_air: "",
        filtre_clim: ""
      },
      mechanicalGroup: {
        Amortisseurs: "",
        patins: "",
        rotules: "",
        chaine_distante: "",
        croix_chaine: "",
        Tendeur: "",
        pompe_eau: "",
        pompe_assiste: "",
        Autre: ""
      }
    });
    setEditing(null);
  };

  const handleEdit = (vehicle) => {
    const groupedData = {
      documentGroup: {
        Assurance: vehicle.ASSURANCE,
        "Visite Technique": vehicle.VISITE,
        "Taxe Circulation": vehicle.TAXE,
        Véhicule: vehicle.VEHICULE
      },
      maintenanceGroup: {
        "Vidange Boîte": vehicle.VIDANGE_BOITE,
        "Vidange Moteur": vehicle.VIDANGE_MOTEUR,
        "Vidange Pont Arrière": vehicle.VIDANGE_POIDS_ARRIERE,
        "Filtre à Huile": vehicle.FILTRE_HUILE,
        "Filtre à Gasoil": vehicle.FILTRE_GAZ,
        "Filtre à Air": vehicle.FILTRE_AIR,
        "Filtre Climatisation": vehicle.FILTRE_CLIM
      },
      mechanicalGroup: {
        Amortisseurs: vehicle.AMORTISSEURS,
        "Plaquettes de Frein": vehicle.PATINS,
        Rotules: vehicle.ROTULES,
        "Chaîne Distribution": vehicle.CHAINE_DISTANTE,
        "Croisillon Chaîne": vehicle.CROIX_CHAINE,
        Tendeur: vehicle.TENDEUR,
        "Pompe à Eau": vehicle.POMPE_EAU,
        "Direction Assistée": vehicle.POMPE_ASSISTE,
        Autre: vehicle.AUTRE
      }
    };
    setFormData(groupedData);
    setEditing(vehicle.ID);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchVehicles();
    } catch (error) {
      console.error("Error deleting vehicle record", error);
    }
  };

  const styles = {
    dashboardContainer: {
      padding: '2rem',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
    },
    dashboardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    addButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    recordsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
      gap: '1.5rem',
    },
    recordCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
    },
    cardHeader: {
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #eee',
    },
    cardActions: {
      display: 'flex',
      gap: '0.5rem',
    },
    actionButton: {
      padding: '0.5rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    modalForm: {
      padding: '1.5rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#666',
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      transition: 'border-color 0.3s ease',
    },
    modalFooter: {
      padding: '1.5rem',
      borderTop: '1px solid #eee',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
    },
    button: {
      padding: '0.8rem 1.5rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    submitButton: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    cancelButton: {
      backgroundColor: '#6c757d',
      color: 'white',
    },
    tabContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      borderBottom: '1px solid #eee',
    },
    tab: {
      padding: '1rem 2rem',
      border: 'none',
      borderBottom: '3px solid transparent',
      background: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    activeTab: {
      borderBottom: '3px solid #007bff',
      color: '#007bff',
    },
    groupContainer: {
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    groupTitle: {
      color: '#2c3e50',
      marginBottom: '1rem',
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    cardContent: {
      padding: '1.5rem',
    },
    cardSection: {
      marginBottom: '1.5rem',
    },
    cardSectionTitle: {
      color: '#2c3e50',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.8rem',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '0.5rem',
    },
    fieldGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.8rem',
    },
    field: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
    },
    fieldLabel: {
      fontWeight: '500',
      color: '#6c757d',
    },
    fieldValue: {
      color: '#212529',
    }
  };
  const isWithinWeek = (dateString, key, value) => {
    if (key === 'Vidange Moteur') {
      return parseInt(value) >= 8000;
    }
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return date - today <= oneWeek && date >= today;
  };

  const renderFormGroup = (group, title) => (
    <div style={styles.groupContainer}>
      <h3 style={styles.groupTitle}>{title}</h3>
      <div style={styles.formGrid}>
        {Object.entries(formData[group]).map(([key, value]) => (
          <div style={styles.formGroup} key={key}>
            <label style={styles.label}>{key}</label>
            <input
  style={{
    ...styles.input,
    ...(isWithinWeek(value, key, value) ? { backgroundColor: '#ffebee', borderColor: '#ef5350' } : {})
  }}
  // Corriger le type des champs en fonction de leur nom
  type={
    key === 'vehicule' ? 'text' :
    key === 'Vidange_moteur'  ? 'number' : 
    key.includes('date') ? 'date' : 'date' // pour les champs contenant "date"
  }
  value={value}
  onChange={(e) => handleInputChange(group, key, e.target.value)}
/>


          </div>
        ))}
      </div>
    </div>
  );

  const renderCardSection = (data, title) => (
    <div style={styles.cardSection}>
      <h4 style={styles.cardSectionTitle}>{title}</h4>
      <div style={styles.fieldGrid}>
        {Object.entries(data).map(([key, value]) => (
          <div
            style={{
              ...styles.field,
              ...(isWithinWeek(value, key, value) ? { backgroundColor: '#ffebee' } : {})
            }}
            key={key}
          >
            <span style={styles.fieldLabel}>{key}:</span>
            <span style={styles.fieldValue}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardHeader}>
        <h1>Gestion de Maintenance des Véhicules</h1>
        <button style={styles.addButton} onClick={() => setIsModalOpen(true)}>
        + Ajouter une nouvelle véhicule  </button>
      </div>

      <div style={styles.recordsGrid}>
        {vehicles.map((vehicle) => {
          const groupedData = {
            documentGroup: {
              Assurance: vehicle.ASSURANCE,
              "Visite Technique": vehicle.VISITE,
              "Taxe Circulation": vehicle.TAXE,
              Véhicule: vehicle.VEHICULE
            },
            maintenanceGroup: {
              "Vidange Boîte": vehicle.VIDANGE_BOITE,
              "Vidange Moteur": vehicle.VIDANGE_MOTEUR,
              "Vidange Pont Arrière": vehicle.VIDANGE_POIDS_ARRIERE,
              "Filtre à Huile": vehicle.FILTRE_HUILE,
              "Filtre à Gasoil": vehicle.FILTRE_GAZ,
              "Filtre à Air": vehicle.FILTRE_AIR,
              "Filtre Climatisation": vehicle.FILTRE_CLIM
            },
            mechanicalGroup: {
              Amortisseurs: vehicle.AMORTISSEURS,
              "Plaquettes de Frein": vehicle.PATINS,
              Rotules: vehicle.ROTULES,
              "Chaîne Distribution": vehicle.CHAINE_DISTANTE,
              "Croisillon Chaîne": vehicle.CROIX_CHAINE,
              Tendeur: vehicle.TENDEUR,
              "Pompe à Eau": vehicle.POMPE_EAU,
              "Direction Assistée": vehicle.POMPE_ASSISTE,
              Autre: vehicle.AUTRE
            }
          };
          return (
            <div key={vehicle.ID} style={styles.recordCard}>
              <div style={styles.cardHeader}>
                <h3>{vehicle.VEHICULE}</h3>
                <div style={styles.cardActions}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => handleEdit(vehicle)}
                  >
                    Modifier                    </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(vehicle.ID)}
                  >
                    Supprimer                    </button>
                </div>
              </div>
              <div style={styles.cardContent}>
                {renderCardSection(groupedData.documentGroup, "Documents Administratifs")}
                {renderCardSection(groupedData.maintenanceGroup, "Maintenance et Filtres")}
                {renderCardSection(groupedData.mechanicalGroup, "Composants Mécaniques")}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editing ? "Modifier le dossier du véhicule" : "Ajouter un nouveau dossier de véhicule"}</h2>
              <button style={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <div style={styles.tabContainer}>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'documentGroup' ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab('documentGroup')}
              >
                Administrative
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'maintenanceGroup' ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab('maintenanceGroup')}
              >
                Maintenance
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(activeTab === 'mechanicalGroup' ? styles.activeTab : {})
                }}
                onClick={() => setActiveTab('mechanicalGroup')}
              >
                Mechanical
              </button>
            </div>
            <form onSubmit={handleSubmit} style={styles.modalForm}>
              {activeTab === 'documentGroup' && renderFormGroup('documentGroup', 'Administrative Documents')}
              {activeTab === 'maintenanceGroup' && renderFormGroup('maintenanceGroup', 'Maintenance & Filters')}
              {activeTab === 'mechanicalGroup' && renderFormGroup('mechanicalGroup', 'Mechanical Components')}

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.cancelButton }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.submitButton }}
                >
                  {editing ? "Mettre à jour l'enregistrement" : "Ajouter un enregistrement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleMaintenance;