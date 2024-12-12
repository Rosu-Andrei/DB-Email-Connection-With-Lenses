import express from 'express';
import { Request, Response } from 'express';
import { allInterpreters } from '../../src/interpreter/interpreter';
import { Event } from '../../src/events/events';
import { eventStoreUsingEFS } from '../../src/events/efs.event.store';
import { eventStoreUsingGithub } from '../../src/events/github.event.store';
import dotenv from 'dotenv';

const app = express();
const port = 3001;

// parse Json bodies
app.use(express.json());
dotenv.config();

app.get(
    '/read',
    (req: Request, res: Response): void => {
        const interpreterName = (req.query.interpreter as string) || 'asJson';

        const handleRequest = async () => {
            try {
                const interpreter = allInterpreters[interpreterName];
                if (!interpreter) {
                    res.status(400).json({ error: `Interpreter "${interpreter} not found`});
                    return;
                }

                // fetch events
                const { events: rawEvents } = await eventStoreUsingGithub.getEvents<Event[]>();

                // process and render the result
                const processedResult = await interpreter.process(rawEvents);
                const renderedResult = interpreter.render(processedResult);

                //send the response
                res.setHeader('Content-Type', interpreter.mimetype);
                res.status(200).send(renderedResult);
            } catch (error) {
                console.error('Error processing /read endpoint:', error);

                if (error instanceof Error) {
                    res.status(500).json({ error: 'Failed to process events',details: error.message});
                } else {
                    res.status(500).json({ error: 'Failed to process events',details: String(error)});
                }
            }
        };

        handleRequest();
    }
);

//start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
