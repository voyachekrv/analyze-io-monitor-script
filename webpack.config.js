import * as path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

class Bundle {
	static LIBRARY = 'aio_monitor';

	static DEV = `${this.LIBRARY}.js`;

	static PROD = `${this.LIBRARY}.[contenthash].js`;
}

class Modes {
	static IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

	static IS_PRODUCTION = !this.IS_DEVELOPMENT;
}

class Path {
	static SRC = path.resolve(process.cwd(), 'src');

	static DIST = path.resolve(process.cwd(), 'dist');
}

const bundleName = () =>
	Modes.IS_PRODUCTION ? Bundle.PROD : Bundle.DEV;

const webpackConfig = {
	mode: Modes.IS_PRODUCTION ? 'production' : 'development',
	entry: {
		'aio_monitor': './src/index.ts'
	},
	target: 'web',
	devtool: Modes.IS_DEVELOPMENT ? 'source-map' : false,
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		path: Path.DIST,
		filename: bundleName(),
		libraryTarget: 'umd',
		library: 'aio_monitor',
		umdNamedDefine: true
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(Path.DIST, bundleName()),
					to: Path.TEST,
					noErrorOnMissing: true
				}
			]
		}),
		new ESLintPlugin({
			useEslintrc: true,
			fix: true,
			eslintPath: path.join(process.cwd(), 'node_modules', 'eslint'),
			extensions: ['ts']
		})
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: Modes.IS_DEVELOPMENT
								? 'tsconfig.json'
								: 'tsconfig.prod.json'
						}
					}
				],
				exclude: /node_modules/
			}
		]
	}
};

export default webpackConfig;

