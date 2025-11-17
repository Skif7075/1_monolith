import { DialogMessage } from "./types";
import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

export const messages = new Map<string, DialogMessage>();

export const router = Router();

router.post('/dialog/:user_id/send', (req: any, res) => {
    console.log("Sending message using dialog service");
    const from = req.headers["x-user-id"];
    const to = req.params.user_id as string;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text required' });
    const id = uuidv4();
    const msg: DialogMessage = {
        id,
        from,
        to,
        text,
        timestamp: new Date().toISOString(),
    };
    messages.set(id, msg);
    res.json({ message: 'ok' });
});

router.get('/dialog/:user_id/list', (req: any, res) => {
    console.log("Getting list of dialogs from dialog service");
    const userId = req.user as string;
    const otherUserId = req.params.user_id as string;
    const list = Array.from(messages.values())
    .filter(msg => msg.from === userId || msg.to === userId || msg.from === otherUserId || msg.to === otherUserId);
    res.json(list);
});
