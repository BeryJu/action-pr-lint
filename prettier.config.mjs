import config from "@goauthentik/prettier-config";

export default {
    ...config,
    overrides: [
        {
            files: ["*.yml", "*.yaml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
