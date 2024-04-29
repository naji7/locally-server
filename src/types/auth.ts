declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export interface IAuthUser {
  id: string;
  username: string;
  email?: string;
}

export interface ISendOtp {
  email: string;
}
