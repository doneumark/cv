import { useMemo } from 'react';
import { useMatch, useParams, useResolvedPath } from 'react-router-dom';

export function useFormRoute() {
	const { pathname: rootPath } = useResolvedPath('');
	const { pathname: updatePath } = useResolvedPath(':param');
	const { pathname: createPath } = useResolvedPath('new');

	const isCreatePath = !!useMatch(createPath);
	const isUpdatePath = !!useMatch(updatePath) && !isCreatePath;

	const { '*': relativePath } = useParams();
	const pathParam = useMemo(
		() => relativePath?.split('/')[0],
		[relativePath],
	);

	return {
		rootPath, isCreatePath, isUpdatePath, pathParam,
	};
}
