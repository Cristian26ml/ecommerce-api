export function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send("No autenticado");
    }
    next();
}

export function authRole(roles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).send("No autenticado");
        }

        console.log("Usuario en sesión:", req.session.user);

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.session.user.role)) {
            console.log("Rol no permitido:", req.session.user.role, "Permitidos:", allowedRoles);
            return res.status(403).send("No autorizado");
        }

        next();
    };
}