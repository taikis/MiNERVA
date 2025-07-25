// 認証関連の型定義
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff' | 'user';
  groupId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// QRコード関連の型定義
export interface QRData {
  visitorId: string;
  timestamp?: string;
}

export interface CheckinData {
  visitorId: string;
  groupId: string;
  placeId: string;
  timestamp?: string;
}

// 来場者情報の型定義
export interface Visitor {
  id: string;
  referenceNumber: string;
  confirmationNumber: string;
  nameKanji: string;
  nameKana: string;
  phoneNumber: string;
  bodyTemperature: string;
  registeredAt: string;
}

// チェックイン履歴の型定義
export interface Entry {
  id: string;
  visitorId: string;
  groupId: string;
  groupName?: string;
  placeId: string;
  placeName?: string;
  timestamp: string;
}

// 団体・場所データの型定義
export interface Place {
  placeId: string;
  placeName: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  places: Place[];
}

// API関連の型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ダッシュボード用の統計データ型
export interface DashboardStats {
  totalVisitors: number;
  activeVisitors: number;
  visitsByPlace: {
    placeId: string;
    placeName: string;
    count: number;
  }[];
  visitsByHour: {
    hour: number;
    count: number;
  }[];
}