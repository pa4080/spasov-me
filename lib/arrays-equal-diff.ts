export function arraysEqualDiff(arr1: string[] | undefined, arr2: string[] | undefined) {
  let areEqual = true;
  const diff2: string[] = [];
  const diff1: string[] = [];

  arr1?.sort();
  arr2?.sort();

  if (arr1 && arr1.length > 0 && (!arr2 || arr2.length === 0)) {
    areEqual = false;
  }

  if (arr2 && arr2.length > 0 && (!arr1 || arr1.length === 0)) {
    areEqual = false;
  }

  if (arr1 && arr1.length === 0 && arr2 && arr2.length === 0) {
    areEqual = true;
  }

  if (!arr1 && !arr2) {
    areEqual = true;
  }

  if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) {
    areEqual = arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
  }

  arr1?.forEach((value) => {
    if (!arr2?.includes(value)) {
      diff1.push(value);
    }
  });

  arr2?.forEach((value) => {
    if (!arr1?.includes(value)) {
      diff2.push(value);
    }
  });

  return [areEqual, diff1, diff2] as const;
}
