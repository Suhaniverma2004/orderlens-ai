export const access = "public";
export const methods = ["GET"];

export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    route: "/api/health-check",
    method: req.method,
    checkedAt: new Date().toISOString()
  });
}
