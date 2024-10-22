export interface GetRatioInput {
  width: number;
  height: number;
}

export function getRatio(info: GetRatioInput) {
  return info && typeof info?.width === "number" && typeof info?.height === "number"
    ? Math.round((info.width / info.height + Number.EPSILON) * 100) / 100
    : 0;
}
