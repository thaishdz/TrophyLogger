import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export class ApiRepository {
    private BASE_URL_API = process.env.BASE_URL_API;

    constructor(apiBaseUrl: string) {
        this.BASE_URL_API = apiBaseUrl;
    }

    const CC = 'es';


}