module.exports = () => {
	process.env = {
		// keystone env
		COOKIE_SECRET: 'c9191e5148832640e2a942e818bd244ddf06adffcc4727f890ac9ceda760d37930b3c55705f4d7aa4421ce65c9bc250d53776ed00141012c88f81a86e98cf78d',
		CLOUDINARY_URL: 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo',
		MONGO_URI: 'mongodb://admin:keystone@mongodb',
		EMAIL_USERNAME: 'momomodels99@gmail.com',
		EMAIL_PASSWORD: 'Momentum99',
		REDIS_PORT: '6379',
		REDIS_HOST: 'redis',
		REDIS_TTL: '1209600',
		REDIS_PASSWORD: 'keystone'
	}
};