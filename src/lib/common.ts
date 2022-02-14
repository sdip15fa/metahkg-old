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
  const shortened: string = humanizeDurationShortened(diff, {
    round: true,
    spacer: "",
    delimiter: " ",
  });
  let r: string = shortened.split(" ")[0];
  if (r.endsWith("s")) {
    r = "now";
  }
  return r;
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
  sex: boolean;
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
export const categories = {
  "1": "Chit-chat",
  "2": "Stories",
  "3": "School",
  "4": "Admin",
  "5": "Leisure",
  "6": "IT",
};
export function splitarray(arr: [], start: number, end: number) {
  const r: [] = [];
  for (let i = start; i <= end; i++) {
    arr[i] !== undefined && r.push(arr[i]);
  }
  return r;
}
