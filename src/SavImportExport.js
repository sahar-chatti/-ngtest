import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import BASE_URL from '../src/constantes';

const ClaimAdjustmentReport = () => {
  const [formData, setFormData] = useState({
    document_no: '',
    rev_no: '',
    issue_no: '',
    issue_date: '',
    company_name: '',
    country: '',
    inspected_by: '',
    inspection_date: '',
    brand: ''
  });

  const [rows, setRows] = useState(Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    invoice_no: '',
    pictures_reference: '',
    tire_size: '',
    li_ss: '',
    pr: '',
    pattern: '',
    dot: '',
    serial_no: '',
    otd_mm: '',
    rtd_mm: '',
    description_of_damage: '',
    final_assessment: '',
    adjustment_value: ''
  })));

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRowChange = (id, field, value) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        details: rows.filter(row => row.invoice_no || row.serial_no)
      };

      const response = await fetch(`${BASE_URL}/api/createSavImport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        toast.success('Claim adjustment report submitted successfully');
        // Reset form
        setFormData({
          document_no: '',
          rev_no: '',
          issue_no: '',
          issue_date: '',
          company_name: '',
          country: '',
          inspected_by: '',
          inspection_date: '',
          brand: ''
        });
        setRows(Array.from({ length: 20 }, (_, index) => ({
          id: index + 1,
          invoice_no: '',
          pictures_reference: '',
          tire_size: '',
          li_ss: '',
          pr: '',
          pattern: '',
          dot: '',
          serial_no: '',
          otd_mm: '',
          rtd_mm: '',
          description_of_damage: '',
          final_assessment: '',
          adjustment_value: ''
        })));
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Export all component content to Excel
  const handleExportToExcel = () => {
    const sheetData = [
      // Add titles and descriptions
      ['Claim Adjustment Report'],
      ['Adjustment on Claim on Damaged Tires'],
      ['We submit below our settlement of your claim based on careful study by our Technical Services staff.'],
      [],
      // Add form fields at the top
      ['Document No.', 'Rev. No.', 'Issue No.', 'Issue Date', '', 'Company Name', 'Country', 'Inspected by', 'Date', 'Brand'],
      ['', '', '', '', '', '', '', '', '', ''], // Empty row for user input
      [],
      // Add table headers
      ['No.', 'Our Invoice No.', 'Pictures Reference', 'Tire Size', 'LI / SS', 'PR', 'Pattern', 'DOT', 'Serial No.', 'OTD mm', 'RTD mm', 'Description of Damage', 'Final Assessment', 'Adjustment Value'],
      // Add table data
      ...rows.map(row => [
        row.id,
        row.invoiceNo,
        row.pictureReference,
        row.tireSize,
        row.liSS,
        row.pr,
        row.pattern,
        row.dot,
        row.serialNo,
        row.otdMm,
        row.rtdMm,
        row.descriptionOfDamage,
        row.finalAssessment,
        row.adjustmentValue,
      ]),
      [],
      // Add footer notes
      ['Classification of Adjustment / Note'],
      ['1. Recognized to be due to Manufacturer\'s fault, the claim is accepted.'],
      ['2. Recognized to be due to user\'s fault, the claim is rejected. Report will be submitted for the same.']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Claim Adjustment Report');
    XLSX.writeFile(workbook, 'Claim_Adjustment_Report.xlsx');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Button variant="contained" color="primary" onClick={handleExportToExcel} sx={{ marginBottom: 2 }}>
        Export to Excel
      </Button>

      <Typography variant="h6" align="center">Claim Adjustment Report</Typography>
      <Typography variant="subtitle1" align="center">ADJUSTMENT ON CLAIM ON DAMAGED TIRES</Typography>
      <Typography variant="body2" align="center">
        We submit below our settlement of your claim based on careful study by our Technical Services staff.
      </Typography>

      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Box>
          <TextField label="Document No." size="small" sx={{ marginRight: 2 }} />
          <TextField label="Rev. No." size="small" sx={{ marginRight: 2 }} />
          <TextField label="Issue No." size="small" sx={{ marginRight: 2 }} />
          <TextField label="Issue Date" size="small" />
        </Box>
        <Box>
          <TextField label="Company Name" size="small" sx={{ marginRight: 2 }} />
          <TextField label="Country" size="small" sx={{ marginRight: 2 }} />
          <TextField label="Inspected by" size="small" sx={{ marginRight: 2 }} />
          <TextField label="Date" size="small" sx={{ marginRight: 2 }} />
          <TextField label="Brand" size="small" />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">Our Invoice No.</TableCell>
              <TableCell align="center">Pictures Reference</TableCell>
              <TableCell align="center">Tire Size</TableCell>
              <TableCell align="center">LI / SS</TableCell>
              <TableCell align="center">PR</TableCell>
              <TableCell align="center">Pattern</TableCell>
              <TableCell align="center">DOT</TableCell>
              <TableCell align="center">Serial No.</TableCell>
              <TableCell align="center">OTD mm</TableCell>
              <TableCell align="center">RTD mm</TableCell>
              <TableCell align="center">Description of Damage</TableCell>
              <TableCell align="center">Final Assessment</TableCell>
              <TableCell align="center">Adjustment Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
                <TableCell align="center"><TextField size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 4 }}>
  <Button 
    variant="outlined" 
    color="secondary" 
    onClick={() => {
      setFormData({});
      setRows(Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        invoice_no: '',
        pictures_reference: '',
        tire_size: '',
        li_ss: '',
        pr: '',
        pattern: '',
        dot: '',
        serial_no: '',
        otd_mm: '',
        rtd_mm: '',
        description_of_damage: '',
        final_assessment: '',
        adjustment_value: ''
      })));
    }}
  >
    Reset Form
  </Button>
  
  <Button 
    variant="contained" 
    color="primary" 
    onClick={handleSubmit}
  >
    Submit Report
  </Button>
</Box>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2">
          Classification of Adjustment / Note
        </Typography>
        <Typography variant="body2">
          1. Recognized to be due to Manufacturer's fault, the claim is accepted.
        </Typography>
        <Typography variant="body2">
          2. Recognized to be due to user's fault, the claim is rejected. Report will be submitted for the same.
        </Typography>
      </Box>
    </Box>
  );
};

export default ClaimAdjustmentReport;
