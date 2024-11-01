export function arraysEqual(arr1: string[] | undefined, arr2: string[] | undefined): boolean {
  let areEqual = true;

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

  return areEqual;
}
