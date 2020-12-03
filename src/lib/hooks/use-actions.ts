import {useMemo} from "react";
import {useDispatch} from "react-redux";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";

export function useActions<T>(actions: ActionCreatorsMapObject<T>): ActionCreatorsMapObject<T> {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), []);
}