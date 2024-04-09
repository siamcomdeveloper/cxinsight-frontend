import BaseService from "../service/base.service";

export const getJwtToken = () => {
    return localStorage.getItem('cxmuser');
}

export const refreshJwtToken = async (xSite: any, jwt: any) => {

    return await BaseService.getUserToken(xSite, jwt).then(
        (rp) => {
            try{
                if (rp.Status) {
                    localStorage.setItem('cxmuser', rp.Data.userToken);
                    return rp.Data.userToken;
                } else {
                    BaseService.post(xSite, "/frontendlog/", { method: `jwt.helper refreshJwtToken BaseService.getUserToken(${jwt}) else`, message: `Messages: ${rp.Messages} | Exception: ${rp.Exception}` }, getJwtToken()).then( (rp) => { console.log(`Messages: ${rp.Messages} | Exception: ${rp.Exception}`); });
                    localStorage.removeItem('cxmuser');
                    return false;
                }
            }catch(error){ 
                toastr.error('Something went wrong!, please refresh the page or try again later.');
                BaseService.post(xSite, "/frontendlog/", { method: `jwt.helper refreshJwtToken BaseService.getUserToken(${jwt}) catch`, message: `catch: ${error}` }, getJwtToken()).then( (rp) => { console.log(`catch: ${error}`); });
            }
        }
    );
}