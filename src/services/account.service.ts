import store from "@/store";

export default class AccountService {

  public hasAnyAuthority(authorities: any): boolean {

    if (!store.getters.account) return false;

    if (typeof authorities === 'string') {
      authorities = [authorities];
    }

    for (const authority of authorities) {
      if (this.userAuthorities.includes(authority)) {
        return true;
      }
    }

    return false;
  }

  public get userAuthorities(): any {
    return store.getters.account.authorities;
  }

}
