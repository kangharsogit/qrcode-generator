
export enum QrCodeType {
  URL = 'URL',
  TEXT = 'Text',
  VCARD = 'vCard',
}

export interface VCardData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  website: string;
}
