import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  FormControlLabel, 
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { visitorApi } from '../../services/api';

interface VisitorRegistrationProps {
  referenceNumber?: string;
  onSuccess?: () => void;
}

const VisitorRegistration: React.FC<VisitorRegistrationProps> = ({ 
  referenceNumber = '', 
  onSuccess 
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const validationSchema = Yup.object({
    referenceNumber: Yup.string()
      .required('整理番号は必須です')
      .matches(/^\d{6}$/, '整理番号は6桁の数字である必要があります'),
    confirmationNumber: Yup.string()
      .required('予約番号は必須です')
      .matches(/^[A-Z]\d{6}$/, '予約番号は「A123456」の形式で入力してください'),
    nameKanji: Yup.string()
      .required('お名前は必須です'),
    nameKana: Yup.string()
      .required('お名前(カタカナ)は必須です')
      .matches(/^[ァ-ヶー　]+$/, 'カタカナで入力してください'),
    phoneNumber: Yup.string()
      .required('電話番号は必須です')
      .matches(/^0\d{9,10}$/, '電話番号を正しい形式で入力してください（ハイフンなし）'),
    bodyTemperature: Yup.string()
      .required('体温は必須です')
      .matches(/^\d{2}\.\d$/, '体温は「36.5」の形式で入力してください'),
    isHealthy: Yup.boolean()
      .oneOf([true], '健康状態に問題がある場合は入場できません'),
  });

  const formik = useFormik({
    initialValues: {
      referenceNumber: referenceNumber,
      confirmationNumber: '',
      nameKanji: '',
      nameKana: '',
      phoneNumber: '',
      bodyTemperature: '',
      isHealthy: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await visitorApi.registerVisitor({
          referenceNumber: values.referenceNumber,
          confirmationNumber: values.confirmationNumber,
          nameKanji: values.nameKanji,
          nameKana: values.nameKana,
          phoneNumber: values.phoneNumber,
          bodyTemperature: values.bodyTemperature,
          id: '', // API側で生成
          registeredAt: '', // API側で設定
        });

        if (response.success) {
          setSuccess(true);
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(response.error || '登録に失敗しました');
        }
      } catch (error) {
        setError('システムエラーが発生しました');
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
    return (
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Box textAlign="center">
          <Alert severity="success" sx={{ mb: 2 }}>
            登録が完了しました！
          </Alert>
          <Typography variant="h6" gutterBottom>
            ありがとうございます
          </Typography>
          <Typography variant="body1">
            受付での登録が完了しました。QRコードを使って会場内を移動してください。
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        入場フォーム
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="整理番号"
              name="referenceNumber"
              value={formik.values.referenceNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.referenceNumber && Boolean(formik.errors.referenceNumber)}
              helperText={
                formik.touched.referenceNumber && formik.errors.referenceNumber
                  ? formik.errors.referenceNumber
                  : '6桁の数字を入力してください'
              }
              disabled={!!referenceNumber}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="予約番号"
              name="confirmationNumber"
              value={formik.values.confirmationNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmationNumber && Boolean(formik.errors.confirmationNumber)}
              helperText={
                formik.touched.confirmationNumber && formik.errors.confirmationNumber
                  ? formik.errors.confirmationNumber
                  : '例：A123456'
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="お名前"
              name="nameKanji"
              value={formik.values.nameKanji}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nameKanji && Boolean(formik.errors.nameKanji)}
              helperText={formik.touched.nameKanji && formik.errors.nameKanji}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="お名前(カタカナ)"
              name="nameKana"
              value={formik.values.nameKana}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nameKana && Boolean(formik.errors.nameKana)}
              helperText={
                formik.touched.nameKana && formik.errors.nameKana
                  ? formik.errors.nameKana
                  : '例：ホウセイ タロウ'
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="電話番号（ハイフンなし）"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? formik.errors.phoneNumber
                  : '例：09012345678'
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="体温"
              name="bodyTemperature"
              value={formik.values.bodyTemperature}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.bodyTemperature && Boolean(formik.errors.bodyTemperature)}
              helperText={
                formik.touched.bodyTemperature && formik.errors.bodyTemperature
                  ? formik.errors.bodyTemperature
                  : '例：36.5'
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isHealthy"
                  checked={formik.values.isHealthy}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="健康状態に問題はありません"
            />
            {formik.touched.isHealthy && Boolean(formik.errors.isHealthy) && (
              <Typography color="error" variant="caption" display="block">
                {formik.errors.isHealthy}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '送信する'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default VisitorRegistration;