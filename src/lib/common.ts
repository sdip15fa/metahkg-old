import humanizeDurationShortened from "humanize-duration-shortened-english";
import humanizeDuration from "humanize-duration";
export function roundup(num: number, precision = 0): number {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}
export function timetoword(sdate: string): string {
  const startDate = new Date(sdate);
  const endDate = new Date();
  const diff = endDate.getTime() - startDate.getTime();
  let r: any = humanizeDurationShortened(diff, {
    round: true,
    spacer: "",
    delimiter: " ",
  });
  r = r.split(" ");
  return r[0];
}
export function timetoword_long(sdate: string): string {
  const startDate = new Date(sdate);
  const endDate = new Date();
  const diff = endDate.getTime() - startDate.getTime();
  let r: any = humanizeDuration(diff, {
    round: true,
    spacer: " ",
    delimiter: ",",
  });
  r = r.split(",");
  return r[0];
}
export type severity = "success" | "info" | "warning" | "error";
export type summary = {
  c: number;
  id: number;
  op: string;
  sex: string;
  title: string;
  category: number;
  lastModified: string;
  createdAt: string;
  catname: string;
  vote: number;
};
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
