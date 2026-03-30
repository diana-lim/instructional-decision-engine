export default function handler(req: any, res: any) {
  // Simple health check for Vercel
  res.status(200).json({ ok: true, name: 'Instructional Decision Engine' });
}

