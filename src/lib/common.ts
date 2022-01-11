export function roundup(number:number, decimals:number = 0) {
    const p = 10 ** decimals;
	const fpFix = Number.EPSILON * (number < 0 ? -1 : 1);
	return (Math.round((number + fpFix) * p) / p) + 1;}