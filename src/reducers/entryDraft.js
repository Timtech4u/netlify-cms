import { Map, List, fromJS } from 'immutable';
import {
  DRAFT_CREATE_FROM_ENTRY,
  DRAFT_CREATE_EMPTY,
  DRAFT_DISCARD,
  DRAFT_CHANGE_FIELD,
  ENTRY_PERSIST_REQUEST,
  ENTRY_PERSIST_SUCCESS,
  ENTRY_PERSIST_FAILURE,
} from '../actions/entries';
import {
  ADD_ASSET,
  REMOVE_ASSET,
} from '../actions/media';

const initialState = Map({ entry: Map(), mediaFiles: List(), fieldsMetaData: Map() });

const entryDraftReducer = (state = Map(), action) => {
  switch (action.type) {
    case DRAFT_CREATE_FROM_ENTRY:
      // Existing Entry
      return state.withMutations((state) => {
        state.set('entry', action.payload);
        state.setIn(['entry', 'newRecord'], false);
        state.set('mediaFiles', List());
        state.set('fieldsMetaData', Map());
      });
    case DRAFT_CREATE_EMPTY:
      // New Entry
      return state.withMutations((state) => {
        state.set('entry', fromJS(action.payload));
        state.setIn(['entry', 'newRecord'], true);
        state.set('mediaFiles', List());
        state.set('fieldsMetaData', Map());
      });
    case DRAFT_DISCARD:
      return initialState;
    case DRAFT_CHANGE_FIELD:
      return state.withMutations((state) => {
        state.setIn(['entry', 'data', action.payload.field], action.payload.value);
        state.mergeIn(['fieldsMetaData'], fromJS(action.payload.metadata));
      });
    case ENTRY_PERSIST_REQUEST: {
      return state.setIn(['entry', 'isPersisting'], true);
    }

    case ENTRY_PERSIST_SUCCESS:
    case ENTRY_PERSIST_FAILURE: {
      return state.deleteIn(['entry', 'isPersisting']);
    }

    case ADD_ASSET:
      return state.update('mediaFiles', list => list.push(action.payload.public_path));
    case REMOVE_ASSET:
      return state.update('mediaFiles', list => list.filterNot(path => path === action.payload));

    default:
      return state;
  }
};

export default entryDraftReducer;
