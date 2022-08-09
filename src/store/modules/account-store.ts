import { Module } from 'vuex';

export const accountStore: Module<any, any> = {
  state: {
    authenticated: false,
  },
  getters: {
    logon: state => state.logon,
    account: state => state.userIdentity,
    authenticated: state => state.authenticated,
  },
  mutations: {
    authenticate(state) {
      state.logon = true;
    },
    authenticated(state, identity) {
      state.userIdentity = identity;
      state.authenticated = true;
      state.logon = false;
    },
    logout(state) {
      state.userIdentity = null;
      state.authenticated = false;
      state.logon = false;
    },
  },
};
