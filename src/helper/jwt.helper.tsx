import BaseService from "../service/base.service";

export const getJwtToken = () => {
    return localStorage.getItem('iconcxmuser');
}

export const refreshJwtToken = async (xSite: any, jwt: any) => {

    return await BaseService.getUserToken(xSite, jwt).then(
        (rp) => {
            try{
                if (rp.Status) {
                  // console.log('getUserToken rp', rp);
                  // console.log('getUserToken rp.Data', rp.Data);
                  // console.log('rp.Data.userToken', rp.Data.userToken);
                    localStorage.setItem('iconcxmuser', rp.Data.userToken);
                    return rp.Data.userToken;
                } else {
                    BaseService.post(xSite, "/frontendlog/", { method: `jwt.helper refreshJwtToken BaseService.getUserToken(${jwt}) else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    localStorage.removeItem('iconcxmuser');
                    return false;
                    // this.props.history.push(`/${this.props.match.params.xSite}/login`);
                }
            }catch(error){ 
                toastr.error('Something went wrong!, please refresh the page or try again later.');
                BaseService.post(xSite, "/frontendlog/", { method: `jwt.helper refreshJwtToken BaseService.getUserToken(${jwt}) catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            }
        }
    );

    // return localStorage.getItem('iconcxmuser');
}