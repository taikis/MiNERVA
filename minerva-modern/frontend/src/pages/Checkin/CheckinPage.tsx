import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import QRScanner from '../../components/features/QRScanner';
import { CheckinData } from '../../types';

const CheckinPage: React.FC = () => {
  const handleSuccessfulScan = (data: CheckinData) => {
    // 必要に応じて処理を追加
    console.log('チェックイン成功:', data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          チェックイン
        </Typography>
        <Typography variant="body1" paragraph align="center">
          来場者のQRコードをスキャンして、訪問場所を記録します
        </Typography>

        <QRScanner onSuccessfulScan={handleSuccessfulScan} />
      </Box>
    </Container>
  );
};

export default CheckinPage;