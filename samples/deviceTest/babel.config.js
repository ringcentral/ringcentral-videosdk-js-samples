module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: 'auto',
                loose: false,
            },
        ],
        '@babel/preset-typescript',
    ],
};
