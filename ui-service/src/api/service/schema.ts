import {Guardians} from '@helpers/guardians';
import {Users} from '@helpers/users';
import {Request, Response, Router} from 'express';
import {UserRole} from 'interfaces';

/**
 * Schema route
 */
export const schemaAPI = Router();

schemaAPI.post('/create', async (req: Request, res: Response) => {
    const guardians = new Guardians();
    const users = new Users();

    if (!(await users.permission(req, UserRole.ROOT_AUTHORITY))) {
        res.status(403).send({code: 403, message: 'Forbidden'});
        return;
    }

    const newSchema = req.body;
    const schemes = (await guardians.setSchema(newSchema));

    res.status(200).json(schemes);
});

schemaAPI.get('/', async (req: Request, res: Response) => {
    const guardians = new Guardians();

    const schemes = (await guardians.getSchemes(null));
    res.status(200).json(schemes);
});

schemaAPI.get('/by-entity', async (req: Request, res: Response) => {
    const guardians = new Guardians();

    const schemes = (await guardians.getSchemes(null));
    res.status(200).json(schemes);
});

schemaAPI.post('/import', async (req: Request, res: Response) => {
    const guardians = new Guardians();
    const newSchemes = req.body.schemes;
    await guardians.importSchemes(newSchemes);
    const schemes = (await guardians.getSchemes(null));
    res.status(200).json(schemes);
});

schemaAPI.post('/export', async (req: Request, res: Response) => {
    const guardians = new Guardians();
    const ids = req.body.ids as string[];
    const schemes = (await guardians.exportSchemes(ids));
    for (let i = 0; i < schemes.length; i++) {
        const element = schemes[i];
        element.id = undefined;
        element.isDefault = undefined;
    }
    const json = schemes;
    res.status(200).json({ schemes: json });
});

