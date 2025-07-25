import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import { Group, CheckinData, QRData } from '../../types';
import { checkinApi, groupsApi } from '../../services/api';

const qrcodeRegionId = 'html5qr-code-full-region';

interface QRScannerProps {
  onSuccessfulScan?: (data: CheckinData) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onSuccessfulScan }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [places, setPlaces] = useState<{ placeId: string; placeName: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<QRData | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>('');

  // グループデータの取得
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await groupsApi.getGroups();
        if (response.success && response.data) {
          setGroups(response.data);
        } else {
          setError('団体情報の取得に失敗しました');
        }
      } catch (error) {
        setError('データ取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // QRコードスキャナーの初期化
  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
    };

    if (!loading) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        config,
        /* verbose= */ false
      );
      
      const onScanSuccess = (decodedText: string) => {
        // QRコードの形式を検証
        const qrRegex = /number=(\d{6})/;
        const match = decodedText.match(qrRegex);
        
        if (match) {
          const visitorId = match[1];
          setScanResult({ visitorId });
          setModalOpen(true);
          html5QrcodeScanner.pause();
        } else {
          setError('無効なQRコードです。正しい形式のQRコードをスキャンしてください。');
          setTimeout(() => setError(null), 3000);
        }
      };

      html5QrcodeScanner.render(onScanSuccess, undefined);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => console.error('Failed to clear scanner', error));
      }
    };
  }, [loading]);

  // 選択されたグループに基づいて場所を更新
  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    setSelectedPlace('');
    
    const selectedGroupData = groups.find(group => group.groupId === groupId);
    if (selectedGroupData) {
      setPlaces(selectedGroupData.places);
    } else {
      setPlaces([]);
    }
  };

  // 場所選択ハンドラ
  const handlePlaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedPlace(event.target.value);
  };

  // チェックインの処理
  const handleCheckin = async () => {
    if (!scanResult || !selectedGroup || !selectedPlace) {
      setMessage('団体と場所を選択してください');
      return;
    }

    setProcessing(true);
    
    try {
      const checkinData: CheckinData = {
        visitorId: scanResult.visitorId,
        groupId: selectedGroup,
        placeId: selectedPlace,
      };
      
      const response = await checkinApi.checkIn(checkinData);
      
      if (response.success) {
        setSuccess(true);
        setMessage('チェックインが完了しました');
        if (onSuccessfulScan) {
          onSuccessfulScan(checkinData);
        }
      } else {
        setSuccess(false);
        setMessage(response.error || '登録に失敗しました');
      }
    } catch (error) {
      setSuccess(false);
      setMessage('エラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setScanResult(null);
    setSuccess(null);
    setMessage('');
    // スキャンを再開
    const scanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scanner.render(() => {}, () => {});
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        QRコードスキャン
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>団体選択</InputLabel>
          <Select
            value={selectedGroup}
            onChange={handleGroupChange}
            label="団体選択"
          >
            {groups.map((group) => (
              <MenuItem key={group.groupId} value={group.groupId}>
                {group.groupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedGroup}>
          <InputLabel>場所選択</InputLabel>
          <Select
            value={selectedPlace}
            onChange={handlePlaceChange}
            label="場所選択"
          >
            {places.map((place) => (
              <MenuItem key={place.placeId} value={place.placeId}>
                {place.placeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <div id={qrcodeRegionId} style={{ width: '100%' }} />
      </Box>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {success === null ? 'QRコードスキャン完了' : success ? '成功' : '失敗'}
        </DialogTitle>
        <DialogContent>
          {processing ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {scanResult && success === null && (
                <Typography variant="body1">
                  来場者ID: {scanResult.visitorId}<br />
                  チェックインを行いますか？
                </Typography>
              )}
              {message && (
                <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
                  {message}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {success === null ? (
            <>
              <Button onClick={handleCloseModal} color="secondary">
                キャンセル
              </Button>
              <Button 
                onClick={handleCheckin} 
                color="primary" 
                disabled={!selectedGroup || !selectedPlace || processing}
              >
                登録
              </Button>
            </>
          ) : (
            <Button onClick={handleCloseModal} color="primary">
              閉じる
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default QRScanner;