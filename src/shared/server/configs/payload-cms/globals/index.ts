import { GlobalConfig } from 'payload';
import { banner } from './banner';
import { siteMetaData } from './metadata';
import { popup } from './popup';
import { terms, privacyPolicy } from './terms';

export const Globals = {
  banner,
  siteMetaData,
  popup,
  terms,
  privacyPolicy,
};

export const getAllGlobal = (): GlobalConfig[] => Object.values(Globals);
