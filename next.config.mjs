import path from 'path';

export default {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: 'webpack-glsl-loader',
      include: path.resolve('src/shaders'),
    });

    return config;
  },
};