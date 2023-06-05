import { CookieUtils, FetchUtils, UUIDUtils } from './utils';
import { SchemaParser } from './parser';
import { ItemProp } from './parser/schema-parser';

const ADB_SERVER_ADDR = 'http://localhost:3002/';

/**
 * Cookie для хранения UUID пользователя
 */
const COOKIE_VISITOR = 'visitorId';

/**
 * Тело запроса отправки данных на САБД
 */
type RequestBody = { [p: string]: string | null; visitorId: string };

/**
 * Проверка на готовность данных к отправке на сервер АБД
 * @param itemProps Свойства, считанные из разметки Schema.org
 * @param visitor ID посетителя
 * @returns Могут ли данные быть отправлены на сервер
 */
const isPreparedToPost = (itemProps: ItemProp, visitor: string | undefined): boolean => {
	const hasItemProps = Object.keys(itemProps).length > 0;

	if (hasItemProps && visitor) {
		return true;
	}

	return false;
};

/**
 * Формирование DTO для отправки на сервер АБД
 * @param visitorId ID посетителя
 * @param itemProps Свойства, считанные из разметки Schema.org
 * @returns DTO для отправки на сервер АБД
 */
const prepareRequest = (visitorId: string, itemProps: ItemProp): RequestBody => {
	return {
		visitorId,
		...itemProps
	};
};

/**
 * Обработчик события загрузки страницы
 * @param uuid UUID магазина, на котором происходит отслеживание
 */
export const loadHandler = async (uuid: string): Promise<void> => {
	if (CookieUtils.getCookie(COOKIE_VISITOR) === undefined) {
		CookieUtils.setCookie(COOKIE_VISITOR, UUIDUtils.getUUID(), {
			expires: 'Fri, 31 Dec 9999 23:59:59 GMT'
		});
	}

	const visitor = CookieUtils.getCookie(COOKIE_VISITOR);

	const itemProps = new SchemaParser().getData();

	if (isPreparedToPost(itemProps, visitor)) {
		const requestBody = prepareRequest(visitor as string, itemProps);

		await FetchUtils.post(ADB_SERVER_ADDR, uuid, requestBody);
	}
};
