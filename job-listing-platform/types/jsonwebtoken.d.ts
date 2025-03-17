declare module 'jsonwebtoken' {
  export interface JwtPayload {
    [key: string]: any;
  }
  
  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: {
      algorithm?: string;
      expiresIn?: string | number;
      notBefore?: string | number;
      audience?: string | string[];
      subject?: string;
      issuer?: string;
      jwtid?: string;
      keyid?: string;
      mutatePayload?: boolean;
      noTimestamp?: boolean;
      header?: object;
      encoding?: string;
    }
  ): string;
  
  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: {
      algorithms?: string[];
      audience?: string | RegExp | Array<string | RegExp>;
      complete?: boolean;
      issuer?: string | string[];
      jwtid?: string;
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      subject?: string;
      clockTimestamp?: number;
      maxAge?: string | number;
      clockTolerance?: number;
      nonce?: string;
    }
  ): JwtPayload | string;
  
  export function decode(
    token: string,
    options?: {
      complete?: boolean;
      json?: boolean;
    }
  ): null | JwtPayload | string;
}