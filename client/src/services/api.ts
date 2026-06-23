import axios, { type AxiosInstance } from "axios";

class BackendApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_HTTP_URL,
      withCredentials: true,
    });
  }

  public login = async ({
    email,
    username,
    password,
  }: {
    email?: string;
    username?: string;
    password: string;
  }) => {
    try {
      const response = await this.api.post("/api/users/login", {
        email,
        username,
        password,
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public signup = async ({
    email,
    username,
    password,
  }: {
    email?: string;
    username?: string;
    password: string;
  }) => {
    try {
      const response = await this.api.post("/api/users/signup", {
        email,
        username,
        password,
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public logout = async () => {
    try {
      const response = await this.api.post("/api/users/logout");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public getMe = async () => {
    try {
      const response = await this.api.get("/api/users/me");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public getTokens = async () => {
    try {
      const response = await this.api.get("/api/tokens");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public getTokenDetails = async (token: string) => {
    try {
      const response = await this.api.get(`/api/tokens/${token}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public getQueues = async () => {
    try {
      const response = await this.api.get("/api/queues");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public callNext = async (queueId: string) => {
    try {
      const response = await this.api.get(`/api/queues/${queueId}/call-next`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public endCurrent = async (queueId: string) => {
    try {
      console.log(`Ending current token in queue: ${queueId}`);
      const response = await this.api.get(`/api/queues/${queueId}/end-current`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public removeToken = async (token: string) => {
    try {
      const response = await this.api.delete(`/api/tokens/${token}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public addToken = async (queueId: string, username: string) => {
    try {
      const response = await this.api.post(`/api/tokens`, {
        username,
        queueId,
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  public getStats = async () => {
    try {
      const response = await this.api.get("/api/stats");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };
}

const api = new BackendApi();

export { api };
