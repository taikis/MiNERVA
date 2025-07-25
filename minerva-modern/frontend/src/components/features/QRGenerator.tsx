import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid,
  FormHelperText
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

interface QRGeneratorProps {
  baseUrl?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ baseUrl = 'https://minerva.example.com/form/?number=' }) => {
  const [startNumber, setStartNumber] = useState<string>('');
  const [count, setCount] = useState<string>('1');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateInput = (): boolean => {
    if (!startNumber.match(/^\d{6}$/)) {
      setError('開始番号は6桁の数字で入力してください');
      return false;
    }

    const countNum = parseInt(count, 10);
    if (isNaN(countNum) || countNum < 1 || countNum > 50) {
      setError('生成数は1〜50の間で入力してください');
      return false;
    }

    setError(null);
    return true;
  };

  const generateQRCodes = () => {
    if (!validateInput()) return;

    const start = parseInt(startNumber, 10);
    const codeCount = parseInt(count, 10);
    
    const codes: string[] = [];
    for (let i = 0; i < codeCount; i++) {
      const visitorId = String(start + i).padStart(6, '0');
      codes.push(visitorId);
    }

    setGeneratedCodes(codes);
  };

  const downloadQRCode = (visitorId: string) => {
    const canvas = document.getElementById(`qr-${visitorId}`) as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${visitorId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadAllQRCodes = () => {
    generatedCodes.forEach(code => {
      downloadQRCode(code);
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        QRコード生成
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="開始番号"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            placeholder="000001"
            variant="outlined"
            error={!!error && error.includes('開始番号')}
            helperText={error && error.includes('開始番号') ? error : '6桁の数字を入力してください'}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="生成数"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            variant="outlined"
            type="number"
            inputProps={{ min: 1, max: 50 }}
            error={!!error && error.includes('生成数')}
            helperText={error && error.includes('生成数') ? error : '1〜50の間で指定してください'}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          onClick={generateQRCodes}
          color="primary"
          sx={{ mr: 1 }}
        >
          QRコード生成
        </Button>
        {generatedCodes.length > 0 && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SaveAltIcon />}
            onClick={downloadAllQRCodes}
          >
            全てダウンロード
          </Button>
        )}
      </Box>

      {generatedCodes.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            生成されたQRコード
          </Typography>
          
          <Grid container spacing={3}>
            {generatedCodes.map(visitorId => (
              <Grid item xs={12} sm={6} md={4} key={visitorId} sx={{ textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <QRCode
                    id={`qr-${visitorId}`}
                    value={`${baseUrl}${visitorId}`}
                    size={150}
                    level="H"
                    includeMargin
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    ID: {visitorId}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<SaveAltIcon />}
                    onClick={() => downloadQRCode(visitorId)}
                    sx={{ mt: 1 }}
                  >
                    ダウンロード
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <FormHelperText sx={{ mt: 2, textAlign: 'center' }}>
            ※ QRコードはPNG形式でダウンロードされます
          </FormHelperText>
        </>
      )}
    </Paper>
  );
};

export default QRGenerator;