export class EscapeUtility {
	public static escapeRegex(string: string) {
		return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	public static escapeHtml(string: string) {
		return string
			.split('')
			.map((char) => `&#${char.charCodeAt(0)};`)
			.join('');
	}

	public static unescapeHtml(string: string) {
		const regex = /&#(\d?\d{2});/g;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(string)) != null) {
			const { index } = match;
			const { length } = match[0];
			const charCode = Number(match[1]);

			string = `${string.substring(0, index)}${String.fromCharCode(
				charCode,
			)}${string.substring(index + length)}`;
		}

		return string;
	}

	public static escapeHtmlCommonEntities(string: string) {
		return string
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	public static unescapeHtmlCommonEntities(string: string) {
		return string
			.replace(/&amp[;]?/g, '&')
			.replace(/&lt[;]?/g, '<')
			.replace(/&gt[;]?/g, '>')
			.replace(/&quot[;]?/g, '"')
			.replace(/&#[0]?39[;]?/g, "'");
	}
}
