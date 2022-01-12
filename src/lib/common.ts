import humanizeDuration from "humanize-duration-shortened-english";
export function roundup(num:number, precision:number = 0) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}
export function timetoword (sdate:string) {
    const startDate = new Date(sdate);
    const endDate = new Date();
    const diff = (endDate.getTime() - startDate.getTime());
    let r:any = humanizeDuration(diff, {round:true, spacer: "", delimiter: " "});
    r = r.split(" ");
    r = r[0] + (r[1] ? r[1] : "");
    return r;}