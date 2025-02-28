export interface ApiKey {
  id: string;
  name: string;
  key: string;
}

export interface ApiService {
  id: string;
  name: string;
  baseUrl: string;
  apiKeys: ApiKey[];
  models: string[];
}
