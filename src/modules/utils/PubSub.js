const PubSub = (() => {
	let events = {};

	function subscribe(event, newSubscriber) {
		if (!events[event]) events[event] = [];

		events[event].push(newSubscriber);
	}

	function publish(event, data) {
		if (!events[event]) return;

		const subs = events[event];
		subs.forEach((sub) => {
			sub(data);
		});
	}

	function unsubscribe(sub) {
		for (let event in events) {
			let subs = events[event];
			let index = subs.findIndex((e) => e.toString() === sub.toString());
			if (index > -1) {
				subs.splice(index, 1);
				if (subs.length === 0) {
					delete events[event];
				}
				break;
			}
		}
	}

	function logAllSubs() {
		console.log(events);
	}

	return { subscribe, unsubscribe, publish, logAllSubs };
})();

export default PubSub;
