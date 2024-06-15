import path from "path";
import { Configuration } from 'webpack'
import HTMLWebpackPlugins from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {ProjectMode, WebpackPaths} from "../types/types";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export function getPlugins(mode: ProjectMode, paths: WebpackPaths): Configuration['plugins'] {
  const isProd = mode === "prod"
  const basePlugins: Configuration['plugins'] = [
    new HTMLWebpackPlugins({
      template: path.resolve(__dirname, '../..', paths.html),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd
        ? 'static/styles/[name].[contenthash].css'
        : 'static/styles/[name].css',
    }),

  ];
  if(!isProd) {
    basePlugins.push(new ReactRefreshWebpackPlugin())
    basePlugins.push(new ForkTsCheckerWebpackPlugin())
  }
  return basePlugins;
}