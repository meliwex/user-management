import { useMemo } from 'react'


const range = (start, end) => {
  let length = end - start + 1;
  /*
      Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};


export const usePagination = ({
  totalNumOfPages,
  currentPage,
  limit,
  siblingCount = 1,
}) => {
  const paginationRange = useMemo(() => {
    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalNumOfPages]
    */
    if (totalPageNumbers >= totalNumOfPages) {
      return range(1, totalNumOfPages);
    }

    /*
        Calculate left and right sibling index and make sure they are within range 1 and totalNumOfPages 
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,

    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalNumOfPages. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalNumOfPages - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalNumOfPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalNumOfPages;

    /*
        Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, "...", totalNumOfPages];
    }

    /*
        Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {

      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalNumOfPages - rightItemCount + 1,
        totalNumOfPages
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    /*
        Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
  }, [totalNumOfPages, limit, siblingCount, currentPage]);

  return paginationRange;
};
