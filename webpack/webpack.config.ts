import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { getCommonWebpack } from './build/webpack.common';
import { getDevServer } from './build/webpack.devServer';
import { webpackPaths } from './webpack.paths';
import type { EnvVariables } from './types/types';

export default async ({ mode }: EnvVariables) => {
	const options = {
		mode: mode ?? 'dev',
		paths: webpackPaths,
	};
	const commonConfig = getCommonWebpack(options);
	const modeConfig = await import(`./build/webpack.${mode}` as string);
	const mergeConfig = merge(commonConfig, modeConfig.default);
	if (mode === 'prod') return mergeConfig;
	else
		return {
			...mergeConfig,
			devServer: getDevServer(options),
		} as webpack.Configuration;
};
