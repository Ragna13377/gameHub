import webpack from "webpack";
import path from "path";
import { WebpackOptions } from "../types/types";
import { getLoaders } from "./webpack.loaders";
import { getPlugins } from "./webpack.plugins";
import {getResolve} from "./webpack.resolve";

export function getCommonWebpack({mode, paths}: WebpackOptions): webpack.Configuration {
  const isProd = mode === "prod"
  return {
    entry: { main: path.resolve(__dirname, '../..', paths.entry) },
    output: {
      path: path.resolve(__dirname, '../..', paths.output),
      filename: isProd
        ? 'static/scripts/[name].[contenthash].js'
        : 'static/scripts/[name].js',
      publicPath: isProd ? "./" : "/"
    },
    module: {
      rules: getLoaders(mode),
    },
    resolve: getResolve(paths),
    plugins: getPlugins(mode, paths),
  }
}