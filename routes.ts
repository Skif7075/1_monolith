import {DialogMessage, Post, User} from "./types";
import {authMiddleware, generateToken} from "./auth";
import {Router} from "express";
import {v4 as uuidv4} from 'uuid';

export const users = new Map<string, User>();
export const posts = new Map<string, Post>();
export const messages = new Map<string, DialogMessage>();

export const router = Router();

router.post('/user/register', (req, res) => {
    const { first_name, second_name, birthdate, biography, city, password } = req.body;
    if (!password) return res.status(400).json({message: 'password required'});
    if (!first_name) return res.status(400).json({message: 'first_name required'});
    if (!second_name) return res.status(400).json({message: 'second_name required'});

    const id = uuidv4();
    const user: User = {
        id,
        first_name,
        second_name,
        birthdate,
        biography,
        city,
        password,
        friends: new Set(),
    };
    users.set(id, user);
    res.json({ user_id: id });
});

router.post('/login', (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).json({ message: 'id and password required' });
    const user = users.get(id as string);
    if (!user) return res.status(404).json({ message: 'not found' });
    if (user.password !== password) return res.status(400).json({ message: 'invalid credentials' });
    const token = generateToken(user.id);
    res.json({ token });
});

router.get('/user/get/:id', (req, res) => {
    const id = req.params.id as string;
    const user = users.get(id);
    if (!user) return res.status(404).json({ message: 'not found' });
    const { password, friends, ...rest } = user as any;
    res.json(rest);
});

router.get('/user/search', (req, res) => {
    const { first_name = '', last_name = '' } = req.query as any;
    if (!first_name && !last_name) return res.status(400).json({ message: 'first_name or last_name required' });
    const result = Array.from(users.values())
        .filter(u =>
            u.first_name.toLowerCase().includes(first_name.toLowerCase())
            && u.second_name.toLowerCase().includes(last_name.toLowerCase()))
        .map(u => {
            const { password, friends, ...rest } = u as any;
            return rest;
        });
    res.json(result);
});

router.put('/friend/set/:user_id', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const otherId = req.params.user_id as string;
    if (!users.has(otherId)) return res.status(404).json({ message: 'not found' });
    const user = users.get(userId)!;
    user.friends.add(otherId);
    res.json({ message: 'ok' });
});

router.put('/friend/delete/:user_id', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const otherId = req.params.user_id as string;
    const user = users.get(userId)!;
    user.friends.delete(otherId);
    res.json({ message: 'ok' });
});

router.post('/post/create', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text required' });
    const id = uuidv4();
    const post: Post = { id, text, author_user_id: userId };
    posts.set(id, post);
    res.json({ post_id: id });
});

router.put('/post/update', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const { id, text } = req.body;
    if (!id || !text) return res.status(400).json({ message: 'id and text required' });
    const post = posts.get(id);
    if (!post) return res.status(404).json({ message: 'not found' });
    if (post.author_user_id !== userId) return res.status(401).json({ message: 'access denied' });
    post.text = text;
    posts.set(id, post);
    res.json({ message: 'ok' });
});

router.put('/post/delete/:id', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const id = req.params.id as string;
    const post = posts.get(id);
    if (!post) return res.status(404).json({ message: 'not found' });
    if (post.author_user_id !== userId) return res.status(401).json({ message: 'access denied' });
    posts.delete(id);
    res.json({ message: 'ok' });
});

router.get('/post/get/:id', (req, res) => {
    const id = req.params.id as string;
    const post = posts.get(id);
    if (!post) return res.status(404).json({ message: 'not found' });
    res.json(post);
});

router.get('/post/feed', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 10);
    const user = users.get(userId)!;
    const friends = user.friends;
    const feed = Array.from(posts.values())
        .filter(p => friends.has(p.author_user_id))
        .slice(offset, offset + limit);
    res.json(feed);
});

router.post('/dialog/:user_id/send', authMiddleware, (req: any, res) => {
    const from = req.user as string;
    const to = req.params.user_id as string;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text required' });
    if (!users.has(to)) return res.status(404).json({ message: 'not found' });
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

router.get('/dialog/:user_id/list', authMiddleware, (req: any, res) => {
    const userId = req.user as string;
    const otherUserId = req.params.user_id as string;
    if (!users.has(otherUserId)) return res.status(404).json({ message: 'not found' });
    const list = Array.from(messages.values())
        .filter(msg => msg.from === userId || msg.to === userId || msg.from === otherUserId || msg.to === otherUserId);
    res.json(list);
});

