module.exports = {
	name: 'error',
	once: false,
	async execute(error) {
		console.log(`Player Log : Error emitted from the queue ${error.message}`);
	},
};