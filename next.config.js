/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Минимальная конфигурация для оптимизации изображений
  images: {
    domains: ["example.com"], // Замени на нужные домены, если используешь изображения из интернета
  },

  // Если у тебя нет кастомного Webpack-конфига, можно его временно убрать
  webpack: (config, { isServer }) => {
    // Можно оставить для оптимизации в случае сборки на сервере
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
        },
      };
    }

    return config;
  },

  // Убедимся, что мы не настраиваем лишние или экспериментальные параметры
  // Временно отключим любые экспериментальные флаги, если они есть
  experimental: {
    // Пример, если что-то было настроено
    // ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
