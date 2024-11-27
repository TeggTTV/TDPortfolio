module.exports = {
	locales: ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'zh'], // Languages that your website supports
	defaultLocale: 'en', // Default language of your website
	pages: {
		'*': ['common'], // Namespaces that you want to import per page (we stick to one namespace for all the application in this tutorial)
	},
};
