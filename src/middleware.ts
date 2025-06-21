import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const adminOnlyRoutes = createRouteMatcher(["/productos(.*)", "/inicio(.*)", "/proformas"]);

const adminAndEmployeeRoutes = createRouteMatcher(["/proformas/nueva-proforma"]);

export const onRequest = clerkMiddleware((auth, context) => {
    const { userId, redirectToSignIn, sessionClaims } = auth();
    const currentPath = new URL(context.request.url).pathname;

    const isAnyProtectedRoute =
        adminOnlyRoutes(context.request) || adminAndEmployeeRoutes(context.request);

    if (isAnyProtectedRoute && !userId) {
        return redirectToSignIn();
    }

    if (userId) {
        const userRole = (sessionClaims?.metadata && typeof sessionClaims.metadata === "object" && "role" in sessionClaims.metadata)
            ? (sessionClaims.metadata as { role?: string }).role
            : undefined;

        if ( (userRole === "employee" && currentPath === "/Inicio")) {
            return context.redirect("/Proformas/nueva-proforma");
        }

        if (adminOnlyRoutes(context.request)) {
            if (userRole === "admin") {
                return undefined;
            } else {
                return new Response("Acceso Denegado: Solo para Administradores", {
                status: 403,
                });
            }
        }

        if (adminAndEmployeeRoutes(context.request)) {
            if (userRole === "admin" || userRole === "employee") {
                return undefined;
            } else {
                return new Response(
                "Acceso Denegado: Requiere rol válido (Admin o Employee)",
                { status: 403 }
                );
            }
        }
    }

    return undefined;
});
