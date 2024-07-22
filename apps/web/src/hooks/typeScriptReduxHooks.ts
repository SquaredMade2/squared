import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useSearchParams as () => ReadonlyURLSearchParams & {
  size: number;
};
