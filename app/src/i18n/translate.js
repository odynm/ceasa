import i18n from 'i18n-js'

import pt_br from 'src/i18n/locales/pt-br'

i18n.translations = {
	'pt-BR': {
		...pt_br,
	},
}

export const translate = (key, options) => i18n.t(key, options)
