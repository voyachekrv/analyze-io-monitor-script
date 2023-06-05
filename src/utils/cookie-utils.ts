/**
 * Инструменты для работы с cookie-файлами
 */
export class CookieUtils {
	/**
	 * Получить информацию из cookie
	 * @param name Название cookie
	 * @returns Значение cookie
	 */
	public static getCookie(name: string): string | undefined {
		const matches = document.cookie.match(
			new RegExp(
				`(?:^|; )${name.replace(
					/([.$?*|{}()[\]\\/+^])/g,
					'\\$1'
				)}=([^;]*)`
			)
		);

		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	/**
	 * Создание cookie-файла
	 * @param name Название cookie
	 * @param value Значение cookie
	 * @param options Опции cookie
	 */
	public static setCookie(
		name: string,
		value: string,
		options: Record<string, string | boolean | number | Date>
	): void {
		const cookieOptions = {
			path: '/',
			...options
		};

		if (options['expires'] instanceof Date) {
			options['expires'] = options['expires'].toUTCString();
		}

		let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(
			value
		)}`;

		for (const optionKey in cookieOptions) {
			if (Object.hasOwnProperty.call(cookieOptions, optionKey)) {
				updatedCookie += `; ${optionKey}`;

				const optionValue = options[optionKey];

				if (optionValue !== true) {
					updatedCookie += `=${optionValue}`;
				}
			}
		}

		document.cookie = updatedCookie;
	}

	/**
	 * Удалить Cookie
	 * @param name Название удаляемого cookie
	 */
	public static deleteCookie(name: string): void {
		this.setCookie(name, '', {
			'max-age': -1
		});
	}
}
