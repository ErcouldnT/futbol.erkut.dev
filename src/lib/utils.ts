/**
 * Removes an element from a list by its ID.
 * @param list - The array of objects to remove the element from.
 * @param id - The ID of the element to remove.
 * @returns A new array with the element removed.
 */
export function removeFromListById<T extends { id: string | number }>(
	list: T[],
	id: string | number
): T[] {
	return list.filter((item) => item.id !== id);
}
