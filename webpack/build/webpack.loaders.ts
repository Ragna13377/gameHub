import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {ProjectMode} from "../types/types";

export function getLoaders(mode: ProjectMode): ModuleOptions['rules'] {
  const isProd = mode === "prod";
  const scriptLoader = {
    test: /\.[tj]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: !isProd
        }
      },
    ],
  }
  const styleLoader = {
    test: /\.(sa|sc|c)ss$/,
    use: [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            mode: 'local',
            localIdentName: '[name]__[local]__[hash:base64:5]',
            auto: /\.module\.\w+$/i,
          },
          importLoaders: 2,
        },
      },
      'postcss-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  }
  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
          svgoConfig: [
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              }
            }
          ]
        }
      },
      'url-loader'
    ],
  }
  const imageLoader = {
    test: /\.(png|jp(e)?g|gif|webp|avif)$/,
    type: 'asset/resource',
    generator: {
      filename: isProd
        ? 'static/images/[hash][ext][query]'
        : 'static/images/[name][ext][query]',
			publicPath: "./"
    }
  }
  const fontLoader = {
    test: /\.(woff(2)?|eot|[ot]tf)$/,
    type: 'asset/resource',
    generator: {
      filename: isProd
        ? 'static/fonts/[hash][ext][query]'
        : 'static/fonts/[name][ext][query]',
			publicPath: "./"
    }
  }
  return [
    scriptLoader, styleLoader, svgLoader, imageLoader, fontLoader,
  ]
}