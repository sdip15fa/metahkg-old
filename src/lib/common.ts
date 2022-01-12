import humanizeDuration from "humanize-duration-shortened-english";
export function roundup(number:number, decimals:number = 0) {
    const p = 10 ** decimals;
	const fpFix = Number.EPSILON * (number < 0 ? -1 : 1);
	return (Math.round((number + fpFix) * p) / p) + 1;}
export function timetoword (sdate:string) {
    const startDate = new Date(sdate);
    const endDate = new Date();
    const diff = (endDate.getTime() - startDate.getTime());
    let r:any = humanizeDuration(diff, {round:true, spacer: "", delimiter: " "});
    r = r.split(" ");
    r = r[0] + r[1];
    return r;}