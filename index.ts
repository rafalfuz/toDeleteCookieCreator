import * as express from 'express';
import {Request, Response} from 'express'
import {engine} from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import {HomeRouter} from './routes/home'
import {ConfiguratorRouter} from "./routes/configurator";
import {OrderRouter} from "./routes/order";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import {COOKIE_BASES, COOKIE_ADDONS} from "./data/cookies-data";

//UPDATED

export class CookieMakerApp {
    app: express.Application
    data = {
        COOKIE_BASES,
        COOKIE_ADDONS,
    };
    constructor() {
        this._configureApp();
        this._setRoutes();
        this._run();
    }

    _configureApp(): void {

        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(cookieParser());
        this.app.engine('.hbs', engine({
            extname: '.hbs',
            helpers: handlebarsHelpers,
        }));
        this.app.set('view engine', '.hbs');
    }

    _setRoutes(): void {
       // this.app.use('/', new HomeRouter(this).router);
        this.app.use('/configurator', new ConfiguratorRouter(this).router);
       // this.app.use('/order', new OrderRouter(this).router);
    }

    _run(): void {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Listening on :3000');
        });
    }

    showErrorPage(res: Response, description: string): void {
        res.render('error', {
            description,
        });
    }

    getAddonsFromReq(req: Request): any[] {
        const {cookieAddons} = req.cookies;
        return cookieAddons ? JSON.parse(cookieAddons) : [];
    }

    getCookieSettings(req: Request) {
        const {cookieBase: base} = req.cookies;

        const addons = this.getAddonsFromReq(req);

        const allBases = Object.entries(this.data.COOKIE_BASES);
        const allAddons = Object.entries(this.data.COOKIE_ADDONS);

        const sum = (base ? handlebarsHelpers.findPrice(allBases, base) : 0)
            + addons.reduce((prev, curr) => (
                prev + handlebarsHelpers.findPrice(allAddons, curr)
            ), 0);

        return {
            // Selected stuff
            addons,
            base,

            // Calculations
            sum,

            // All possibilities
            allBases,
            allAddons,
        };
    }
}

new CookieMakerApp();
