/**
 * Инструменты для работы с HTTP-клиентом
 */
export class FetchUtils {
	/**
	 * Отправка собранных данных на сервер аналитической БД
	 * @param server Адрес сервера аналитической БД
	 * @param uuid UUID магазина
	 * @param body Тело запроса
	 * @returns Результат отправки на сервер
	 */
	public static async post<T>(server: string, uuid: string, body: T): Promise<T> {
		return (
			await fetch(`${server}visits/${uuid}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(body)
			})
		).json();
	}
}
