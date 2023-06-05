import { loadHandler } from './load-handler';

/**
 * Входная точка приложения
 * @param uuid UUID магазина, на котором происходит отслеживание
 */
const init = (uuid: string): void => {
	window.addEventListener('load', loadHandler.bind(this, uuid));
};

export { init };
