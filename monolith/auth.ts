import jwt from "jsonwebtoken";

const SECRET = 'super_secret'

export function generateToken(userId: string) {
    return jwt.sign({ sub: userId }, SECRET, { expiresIn: '30d' });
}

function verifyToken(token: string): { userId: string } | null {
    try {
        const payload = jwt.verify(token, SECRET) as any;
        return { userId: payload.sub };
    } catch (e) {
        return null;
    }
}

export function authMiddleware(req: any, res: any, next: any) {
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth) return res.status(401).json({message: 'Unauthorized'});
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({message: 'Unauthorized'});
    const token = parts[1];
    const verified = verifyToken(token);
    if (!verified) return res.status(401).json({message: 'Unauthorized'})
    req.user = verified.userId;
    next();
}
