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

/**
 * Shuffles the elements of an array randomly.
 * @param array - The array to shuffle.
 * @returns A new array with elements in random order.
 */
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
