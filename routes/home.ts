import * as express from 'express';
import {Router, Request, Response} from 'express'
import { CookieMakerApp } from '..';


export class HomeRouter {
    public readonly router: Router = Router();

    constructor(private cmapp:CookieMakerApp) {
        this.cmapp = cmapp;
        this.router = express.Router();
        this.setUpRoutes();
    }

    setUpRoutes() {
        this.router.get('/', this.home);
    }

    home = (req:Request, res:Response) => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('home/index', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };
}
