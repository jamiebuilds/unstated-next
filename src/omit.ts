const omit = <T extends object, K extends keyof T>(
	obj: T,
	keys: Array<K>,
): Omit<T, K> => {
	let res: any = {}
	let objKeys = Object.keys(obj) as Array<K>
	objKeys.forEach(objKey => {
		if (keys.indexOf(objKey) < -1) {
			res[objKey] = obj[objKey]
		}
	})
	return res
}

export default omit
