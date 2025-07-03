
/* Le estás diciendo a TypeScript:
* “Aquí estoy usando los tipos de Express. Por favor, carga su definición.”
*/

import * as express from 'express';

declare global { // Quiero que todo mi proyecto sepa que ahora Request va a tener algo nuevo
    namespace Express {  // "Hey TypeScript, en Express..."
        interface Request {      // "...el objeto Request..."
            steamAuth?: {        // "...ahora puede tener steamAuth como propiedad"
                apiKey: string;
                steamId: string;
            }
        }
    }
}
