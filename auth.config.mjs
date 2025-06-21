import { defineConfig } from "auth-astro";
import Google from "@auth/core/providers/google";

export default defineConfig({
    providers: [
        Google({
            clientId: import.meta.env.GOOGLE_CLIENT_ID,
            clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
                // Restringimos por correo
                if (!allowedUsers.includes(profile.email)) {
                    throw new Error('Unauthorized user');
                }

                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],
})