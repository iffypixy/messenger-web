import {useMemo} from "react";
import {useDispatch} from "react-redux";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";

export function useActions(actions: ActionCreatorsMapObject) {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), []);
}