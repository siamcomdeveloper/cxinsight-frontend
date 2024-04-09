import Response from "../models/response";
import axios from "axios";
// console.log('baseURL', process.env.REACT_APP_BASE_URL)
export default class BaseService {
    // private static baseURL: string = "http://116.206.81.49/cxmapi";
    // private static baseURL: string = "http://116.206.81.49:3000";
    // private static baseURL: string = "http://localhost:3000";
    // private static baseURL: string = "http://www.cxthailand.com/cxmapi";
    // private static baseURL: string = "http://203.154.95.145/cxmapi";
    // private static xSite = this.props.match.params.xSite;
    // private static xBusiness = process.env.REACT_APP_X_BUSINESS;
    private static baseURL = process.env.REACT_APP_BASE_URL;
    
    public static async getAll<T>(xSite: any, url: string, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        let res = await axios.get<Array<T>>(this.baseURL + url, obj)
            .then(response => {
                return new Response(true, response.data as Array<T>, "Got All", "");
            })
            .catch(function (error) {
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static getJSON(xSite: any, url: string, param: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        let res = axios.get(this.baseURL + url + param, obj)
            .then(response => {
                // return new Response(true, response.data, "Got JSON", "");
                return new Response(response.data.status, response.data, response.data.message, response.data.exception);
            })
            .catch(function (error) {
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static post(xSite: any, url: string, obj: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        if(jwt){
            axios.defaults.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
                'x-site' : xSite.toLowerCase()
            }
        }
        else{
            axios.defaults.headers = {
                'Content-Type': 'application/json',
                'x-site' : xSite.toLowerCase()
            }
        }

        let res = axios.post(this.baseURL + url ,obj)
            .then(function (response) {
              // console.log('post response', response);
                return new Response(response.data.status, response.data, response.data.message, response.data.exception);
            })
            .catch(function (error) {
              // console.log('post error', error);
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static getFromURL(url: string): Promise<Response> {
        
        let res = fetch(url, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => { 
                // console.log('data', data); 
                return new Response(true, data, 'Got IP', '');
            })
            // .then(data => componentsData.onSuccess())
            .catch(error => {
                // console.log('Error fetching ip ' + error);
                return new Response(false, null, 'Got No IP', error);
            })

        return res;
    }

    public static getApiURL(url: string): Promise<Response> {
        
        let res = fetch(url, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => { 
                // console.log('data', data); 
                return new Response(data.status, data, data.message, data.exception);
            })
            // .then(data => componentsData.onSuccess())
            .catch(error => {
                // console.log('Error fetching ip ' + error);
                return new Response(false, null, error, error);
            })

        return res;
    }
    // public static getFromURL(url: string): Promise<Response> {
    //     axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

    //     let res = axios.get(url)
    //         .then(response => {
    //             return new Response(true, response.data, "Got From URL", "");
    //         })
    //         .catch(function (error) {
    //             return new Response(false, null, error, error);
    //         });

    //     return res;
    // }

    public static get<T>(xSite: any, url: string, param: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        let res = axios.get<T>(this.baseURL + url + param, obj)
            .then(response => {
                return new Response(true, response.data, "Got It", "");
            })
            .catch(function (error) {
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static getWithBody<T>(xSite: any, url: string, param: any, obj: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        if(jwt){
            axios.defaults.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
                'x-site' : xSite.toLowerCase()
            }
        }

        let res = axios.put(this.baseURL + url + param, obj)
            .then(function (response) {
                return new Response(true, response.data, "Got It", "");
            })
            .catch(function (error) {
                return new Response(false, null, "Get with filter", error);;
            });

        return res;
    }

    public static delete(xSite: any, url: string, param: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        let res = axios.delete(this.baseURL + url + param, obj)
            .then(function (response) {
                return new Response(response.data.status, response.data, response.data.message, response.data.exception);
            })
            .catch(function (error) {
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static create<T>(xSite: any, url: string, obj: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        if(jwt){
            axios.defaults.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
                'x-site' : xSite.toLowerCase()
            }
        }
        
        let res = axios.post(this.baseURL + url ,obj)
            .then(function (response) {
                return new Response(response.data.status, response.data, response.data.message, response.data.exception);
            })
            .catch(function (error) {
                return new Response(false, null, error, error);
            });

        return res;
    }

    public static update(xSite: any, url: string, param: any, obj: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        if(jwt){
            axios.defaults.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
                'x-site' : xSite.toLowerCase()
            }
        }

        let res = axios.put(this.baseURL + url + param, obj)
            .then(function (response) {
                return new Response(response.data.status, response.data, response.data.message, response.data.exception);
            })
            .catch(function (error) {
                return new Response(false, null, error, error);;
            });

        return res;
    }

    public static async getSurveytatistics<T>(xSite: any, url: string, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        // console.log('getSurveytatistics obj', obj);
        let res = await axios.get<T>(this.baseURL + url, obj)
            .then(response => {
                return new Response(true, response.data, "Got It", "");
            })
            .catch(function (error) {
                return new Response(false, null, "Get Error", error);
            });

        return res;
    }

    public static async getSearch<T>(xSite: any, url: string, param: any, jwt?: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }
        
        const obj = jwt ? { headers: { Authorization: `Bearer ${jwt}`} } : {};
        let res = await axios.get<Array<T>>(this.baseURL + url + param, obj)
            .then(response => {
                return new Response(true, response.data as Array<T>, "Got All Search", "");
            })
            .catch(function (error) {
                return new Response(false, null, "Get All Search Error", error);
            });

        return res;
    }

    public static async getUserToken(xSite: any, jwt: any): Promise<Response> {
        axios.defaults.headers = { 'x-site' : xSite.toLowerCase() }

        let res = await axios.get(this.baseURL + '/auth/getUserToken/', { headers: { Authorization: `Bearer ${jwt}`} })
            .then(response => {
                return new Response(true, response.data, "Got an user token", "");
            })
            .catch(function (error) {
                return new Response(false, null, "Get an user token Error", error);
            });

        return res;
    }

    // public static axiosPost(url: string, param: any, obj: any): Promise<Response> {

    //     let res = axios.get(this.baseURL + url + param, obj)
    //         .then(response => {
    //             return new Response(true, response.data, "Got It", "");
    //         })
    //         .catch(function (error) {
    //             return new Response(false, null, "Get Error", error);
    //         });

    //     return res;
    // }

}