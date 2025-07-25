import axios, { AxiosRequestConfig } from 'axios';
import { 
  ApiResponse, 
  LoginCredentials, 
  User, 
  Visitor, 
  Entry, 
  Group, 
  CheckinData,
  DashboardStats
} from '../types';

// APIのベースURL - 環境変数から取得
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Axios インスタンスを作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター - 認証トークンの追加
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター - エラーハンドリング
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 認証エラーの場合
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認証関連API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'ログインに失敗しました',
      };
    }
  },

  register: async (userData: any): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/register', userData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '登録に失敗しました',
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'ユーザー情報の取得に失敗しました',
      };
    }
  },
};

// 来場者関連API
export const visitorApi = {
  getVisitors: async (): Promise<ApiResponse<Visitor[]>> => {
    try {
      const response = await api.get<ApiResponse<Visitor[]>>('/visitors');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '来場者情報の取得に失敗しました',
      };
    }
  },

  getVisitorById: async (id: string): Promise<ApiResponse<Visitor>> => {
    try {
      const response = await api.get<ApiResponse<Visitor>>(`/visitors/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '来場者情報の取得に失敗しました',
      };
    }
  },

  registerVisitor: async (visitorData: Omit<Visitor, 'id' | 'registeredAt'>): Promise<ApiResponse<Visitor>> => {
    try {
      const response = await api.post<ApiResponse<Visitor>>('/visitors/register', visitorData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '来場者登録に失敗しました',
      };
    }
  },
};

// チェックイン関連API
export const checkinApi = {
  checkIn: async (data: CheckinData): Promise<ApiResponse<Entry>> => {
    try {
      const response = await api.post<ApiResponse<Entry>>('/entries/checkin', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'チェックインに失敗しました',
      };
    }
  },

  getEntries: async (params?: { groupId?: string; placeId?: string }): Promise<ApiResponse<Entry[]>> => {
    try {
      const response = await api.get<ApiResponse<Entry[]>>('/entries', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'チェックイン履歴の取得に失敗しました',
      };
    }
  },

  getVisitorEntries: async (visitorId: string): Promise<ApiResponse<Entry[]>> => {
    try {
      const response = await api.get<ApiResponse<Entry[]>>(`/entries/visitor/${visitorId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '来場者の履歴取得に失敗しました',
      };
    }
  },
};

// 団体・場所情報API
export const groupsApi = {
  getGroups: async (): Promise<ApiResponse<Group[]>> => {
    try {
      const response = await api.get<ApiResponse<Group[]>>('/groups');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '団体情報の取得に失敗しました',
      };
    }
  },

  getGroupById: async (id: string): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.get<ApiResponse<Group>>(`/groups/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '団体情報の取得に失敗しました',
      };
    }
  },

  createGroup: async (groupData: Omit<Group, 'id'>): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.post<ApiResponse<Group>>('/groups', groupData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '団体の作成に失敗しました',
      };
    }
  },

  updateGroup: async (id: string, groupData: Partial<Group>): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.put<ApiResponse<Group>>(`/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '団体の更新に失敗しました',
      };
    }
  },
};

// ダッシュボード統計API
export const statsApi = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/stats/dashboard');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '統計データの取得に失敗しました',
      };
    }
  },

  getVisitorStats: async (params?: { date?: string }): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get<ApiResponse<any>>('/stats/visitors', { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: '来場者統計の取得に失敗しました',
      };
    }
  },
};

export default api;